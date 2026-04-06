#!/usr/bin/env python3
"""Emit lifestyle-catalog.js from Brand_Category_Data.xlsx.

Requirement: at least N products for every (brand × category/type) combination in the sheet.
"""

import hashlib
import json
import re
from pathlib import Path

try:
    import openpyxl  # type: ignore
except Exception as e:  # pragma: no cover
    raise SystemExit(
        "Missing dependency 'openpyxl'. Install with: pip install openpyxl"
    ) from e


MIN_PRODUCTS_PER_COMBO = 20

APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"]
SHOE_SIZES = ["7", "8", "9", "10", "11"]


def norm_brand(s: str) -> str:
    return re.sub(r"\s+", " ", str(s or "").strip()).upper()


def norm_type(s: str) -> str:
    # Keep user-facing label mostly intact, just trim whitespace.
    return re.sub(r"\s+", " ", str(s or "").strip())


def slugify(s: str) -> str:
    s2 = str(s or "").strip().lower()
    s2 = re.sub(r"[^a-z0-9]+", "-", s2)
    s2 = re.sub(r"-{2,}", "-", s2).strip("-")
    return s2 or "x"


def price_tuple(seed: str) -> tuple[int, int, int]:
    h = int(hashlib.md5(seed.encode()).hexdigest()[:8], 16)
    price = 299 + (h % 4700)
    off = 15 + (h % 25)
    mrp = int(round(price / (1 - off / 100.0)))
    if mrp <= price:
        mrp = price + 100
    return price, mrp, off


def size_for(pid: str, type_label: str) -> str:
    t = str(type_label or "").lower()
    footwear = any(
        k in t
        for k in (
            "shoe",
            "sneaker",
            "sandal",
            "slide",
            "boot",
            "floater",
            "loafer",
            "moccasin",
            "derby",
            "monk",
            "chelsea",
            "runner",
            "adilette",
            "chappal",
            "slipper",
            "oxford",
            "closed",
        )
    )
    h = int(hashlib.md5((pid + "sz").encode()).hexdigest()[:8], 16)
    if footwear:
        return SHOE_SIZES[h % len(SHOE_SIZES)]
    return APPAREL_SIZES[h % len(APPAREL_SIZES)]


def unit_for(type_label: str) -> str:
    return "1 pc"


def has_size_for(type_label: str) -> bool:
    t = str(type_label or "").lower()
    if any(k in t for k in ("bag", "hand bag", "belt", "tie", "watch", "sunglass", "wallet", "perfume", "cufflink")):
        return False
    return True


def read_brand_category_pairs(xlsx_path: Path) -> list[tuple[str, str]]:
    wb = openpyxl.load_workbook(xlsx_path, read_only=True, data_only=True)
    ws = wb.active
    pairs: list[tuple[str, str]] = []
    first = True
    for row in ws.iter_rows(values_only=True):
        if first:
            first = False
            continue
        brand = norm_brand(row[0] if len(row) > 0 else "")
        typ = norm_type(row[1] if len(row) > 1 else "")
        if not brand or not typ:
            continue
        pairs.append((brand, typ))
    # Deduplicate but keep stable order.
    seen = set()
    out: list[tuple[str, str]] = []
    for b, t in pairs:
        key = (b, t)
        if key in seen:
            continue
        seen.add(key)
        out.append(key)
    return out


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    xlsx_path = root / "Brand_Category_Data.xlsx"
    if not xlsx_path.exists():
        raise SystemExit(f"Missing {xlsx_path}")

    combos = read_brand_category_pairs(xlsx_path)
    if not combos:
        raise SystemExit("No (brand, category) combinations found in Brand_Category_Data.xlsx")

    products: list[dict] = []
    baseline_ids: list[str] = []

    # Track per brand+type counter for naming and IDs.
    per_combo_idx: dict[tuple[str, str], int] = {}

    for brand, typ in combos:
        combo_key = (brand, typ)
        for i in range(1, MIN_PRODUCTS_PER_COMBO + 1):
            per_combo_idx[combo_key] = per_combo_idx.get(combo_key, 0) + 1
            n = per_combo_idx[combo_key]
            pid = f"lv-{slugify(brand)}-{slugify(typ)}-{n:03d}"
            price, mrp, off = price_tuple(pid)
            products.append(
                {
                    "id": pid,
                    "brand": brand,
                    "name": f"{brand} {typ} #{n}",
                    "price": price,
                    "mrp": mrp,
                    "off": off,
                    # Image is now category-derived in lifestyle-render.js; keep a non-empty placeholder for compatibility.
                    "img": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=533&fit=crop&auto=format&q=80",
                    "unit": unit_for(typ),
                    "hasSize": has_size_for(typ),
                    "gender": "",
                    "type": typ,
                    "size": size_for(pid, typ) if has_size_for(typ) else "",
                }
            )

    # Keep baseline IDs stable: first 50 items are enough for the "toggle off" view.
    baseline_ids = [p["id"] for p in products[:50]]

    # Filter options should match the sheet (brands/types).
    brands = []
    seen_b = set()
    for b, _t in combos:
        if b in seen_b:
            continue
        seen_b.add(b)
        brands.append(b)
    types = sorted({t for _b, t in combos}, key=str.lower)

    filter_options = {"brands": brands, "types": types}

    out_path = root / "lifestyle-catalog.js"
    lines = [
        "/** Auto-generated by scripts/generate_lifestyle_catalog.py — do not edit by hand. */",
        "window.LIFESTYLE_BASELINE_IDS = " + json.dumps(baseline_ids, ensure_ascii=False) + ";",
        "window.LIFESTYLE_FILTER_OPTIONS = " + json.dumps(filter_options, ensure_ascii=False) + ";",
        "window.LIFESTYLE_CATALOG = " + json.dumps(products, ensure_ascii=False) + ";",
    ]
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {len(products)} products ({MIN_PRODUCTS_PER_COMBO} per combo × {len(combos)} combos) → {out_path}")


if __name__ == "__main__":
    main()
