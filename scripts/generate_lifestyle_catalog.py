#!/usr/bin/env python3
"""Emit lifestyle-catalog.js with 1500 apparel products; 20 baseline IDs when toggle off."""
import hashlib
import json
from pathlib import Path

# 12 brands × 125 = 1500
TOTAL_PRODUCTS = 1500

# Slugs that contribute to baseline in-stock (4 SKUs each = 20 total)
BASELINE_SLUGS = frozenset({"jockey", "boldfit", "adidas", "pepe", "uspa"})

# (display name, slug, name templates — cycled with index for uniqueness)
ALL_BRANDS = [
    ("Jockey", "jockey", [
        "Cotton Vest Pack of 3", "Briefs Pack of 2", "Trunks Solid", "Ankle Socks Pack of 3",
        "Ribbed Vest", "Boxer Briefs", "Thermal Top", "Loungewear Shorts", "Sports Socks",
        "Crew Neck Tee", "Tank Top Pack", "Long Johns", "Gym Vest", "Printed Briefs",
        "Classic Briefs", "Seamless Vest", "Low-rise Trunks", "Cotton Socks 6-pack",
        "Track Pants", "Polo Tee", "Zip Hoodie Lite", "Essential Tee 2-pack",
    ]),
    ("Boldfit", "boldfit", [
        "Quick Dry Hoodie", "Training Tee", "Compression Tights", "Gym Shorts", "Dryfit Polo",
        "Yoga Mat Strap Tee", "Running Singlet", "Athletic Joggers", "Sports Cap", "Track Jacket",
        "Mesh Tank", "Performance Shorts", "Zip Track Top", "Training Hoodie", "Dryfit Shorts",
        "Muscle Tee", "Reflective Jacket", "Stretch Leggings", "Cricket Jersey", "Badminton Shorts",
        "Training Vest", "Active Polo",
    ]),
    ("Adidas", "adidas", [
        "Running Shoes", "Stan Smith Sneakers", "Ultraboost Lite", "Adilette Slides",
        "Training Pants", "Trefoil Tee", "3-Stripes Track Top", "Football Jersey",
        "Basketball Shorts", "Classic Cap", "Gym Duffel Tee", "Response Runner",
        "Predator Cleats", "Essentials Hoodie", "Tiro Track Pants", "Squadra Jersey",
        "Duramo Sandals", "Linear Tee", "Own the Run Tee", "Designed 2 Move Shorts",
        "Prime Tee", "Essentials Polo",
    ]),
    ("Pepe Jeans", "pepe", [
        "Slim Fit Shirt", "Slim Jeans", "Denim Jacket", "Chino Trousers", "Polo Pique",
        "Graphic Tee", "Cargo Shorts", "Knit Sweater", "Longline Tee", "Skinny Jeans",
        "Oxford Shirt", "Bomber Jacket", "Relaxed Tee", "Tapered Jeans", "Henley Top",
        "Denim Shirt", "Hooded Sweatshirt", "Straight Jeans", "Stripe Polo",
        "Lightweight Jacket", "Muscle Fit Tee", "Casual Blazer",
    ]),
    ("USPA", "uspa", [
        "Solid Polo", "Oxford Shirt", "Chino Shorts", "Crew Sweatshirt", "Slim Chinos",
        "Pique Tee", "Denim Shorts", "V-neck Pullover", "Stripe Polo", "Casual Shirt",
        "Jogger Pants", "Half-zip Sweater", "Linen Shirt", "Cargo Pants", "Polo Dress Shirt",
        "Lightweight Jacket", "Twill Trousers", "Rugby Shirt", "Essential Tee",
        "Relaxed Shorts", "Zip Hoodie", "Classic Fit Jeans",
    ]),
    ("Bata", "bata", [
        "Floaters", "Sandals", "School Shoes", "Comfort Slides", "Formal Shoes", "Sports Sandals",
        "Leather Loafers", "Walking Shoes", "Canvas Sneakers", "Hiking Sandals", "Monk Straps",
        "Derby Shoes", "Moccasins", "Boat Shoes", "Chelsea Boots", "Sneakers", "Boots",
    ]),
    ("Blackberry", "bb", [
        "Slim Shirt", "Formal Shirt", "Casual Shirt", "Linen Shirt", "Printed Shirt",
        "Denim Shirt", "Oxford", "Checks Shirt", "Stripe Shirt", "Party Shirt",
        "Half Sleeve", "Full Sleeve", "Slim Fit", "Tailored Fit", "Spread Collar",
    ]),
    ("Tommy Hilfiger", "tommy", [
        "Logo Tee", "Polo Flag", "Chinos", "Denim Jeans", "Hoodie Flag", "Cap", "Belt",
        "Sweater", "Oxford Shirt", "Shorts", "Swim Shorts", "Puffer Vest", "Cardigan",
        "Bomber", "Track Pants", "Polo", "Henley",
    ]),
    ("Calvin Klein", "ck", [
        "Trunks Pack", "Boxer Briefs", "Cotton Tee", "Loungewear", "Hoodie CK", "Joggers",
        "Socks Pack", "Tank 2-pack", "Pyjama Set", "Robe", "Briefs", "Long Sleeve Tee",
        "Shorts", "Polo CK", "Cap", "Vest",
    ]),
    ("Jack & Jones", "jj", [
        "Slim Jeans", "Bomber", "Graphic Tee", "Chinos", "Denim Jacket", "Hoodie", "Polo",
        "Shorts", "Sweatshirt", "Parka", "Shirt", "Joggers", "Blazer", "Knit", "Tee",
    ]),
    ("Levi", "levi", [
        "511 Jeans", "501 Original", "Trucker Jacket", "Graphic Tee", "Shorts", "Hoodie",
        "Shirt", "502 Taper", "505 Regular", "Denim Shorts", "Sherpa", "Beanie", "Belt",
        "Tank", "Polo", "Trucker",
    ]),
    ("Bewakoof", "bewakoof", [
        "Graphic Tee", "Oversized Tee", "Joggers", "Hoodie", "Phone Pocket Tee", "Pyjama",
        "Shorts", "Crop Top", "Bomber", "Shirt", "Sweatshirt", "Tank", "Cap", "Socks", "Slides",
    ]),
]

IMG_POOL = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=533&fit=crop&auto=format&q=80",
]

# Dress / oxford / loafer imagery — Bata only (verified HTTP 200; not sandals or slides).
BATA_FORMAL_SHOE_IMG_POOL = [
    "https://images.unsplash.com/photo-1563434194539-fcc823f9bf92?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1657034321685-1fba1b2751f3?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1576792741377-eb0f4f6d1a47?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1770198408387-7f45e5d6c056?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1773021370310-7fe0b80838ec?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1748341545593-12c86c6ab718?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1766113478661-4abfd38f3c02?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1772678144516-4fddf7635ab4?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1760616172899-0681b97a2de3?w=400&h=533&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1657036779347-db31ebaad251?w=400&h=533&fit=crop&auto=format&q=80",
]


def pick_img(i: int) -> str:
    return IMG_POOL[i % len(IMG_POOL)]


def pick_bata_formal_img(i: int) -> str:
    return BATA_FORMAL_SHOE_IMG_POOL[i % len(BATA_FORMAL_SHOE_IMG_POOL)]


def price_tuple(seed: str) -> tuple:
    h = int(hashlib.md5(seed.encode()).hexdigest()[:8], 16)
    price = 299 + (h % 4700)
    off = 15 + (h % 25)
    mrp = int(round(price / (1 - off / 100.0)))
    if mrp <= price:
        mrp = price + 100
    return price, mrp, off


def main() -> None:
    n_brands = len(ALL_BRANDS)
    per_brand = TOTAL_PRODUCTS // n_brands
    assert per_brand * n_brands == TOTAL_PRODUCTS, "TOTAL_PRODUCTS must divide evenly by brand count"

    products = []
    baseline_ids = []
    bata_img_i = 0

    for brand_label, slug, templates in ALL_BRANDS:
        tlen = len(templates)
        for idx in range(1, per_brand + 1):
            pid = f"lv-{slug}-{idx:03d}"
            tmpl = templates[(idx - 1) % tlen]
            full_name = f"{brand_label} {tmpl} #{idx}"
            price, mrp, off = price_tuple(pid)
            if slug == "bata":
                img = pick_bata_formal_img(bata_img_i)
                bata_img_i += 1
            else:
                img = pick_img(len(products))
            products.append(
                {
                    "id": pid,
                    "brand": brand_label,
                    "name": full_name,
                    "price": price,
                    "mrp": mrp,
                    "off": off,
                    "img": img,
                    "unit": "1 pc",
                    "hasSize": True,
                }
            )
            if slug in BASELINE_SLUGS and idx <= 4:
                baseline_ids.append(pid)

    assert len(baseline_ids) == 20
    assert len(products) == TOTAL_PRODUCTS

    out_path = Path(__file__).resolve().parent.parent / "lifestyle-catalog.js"
    lines = [
        "/** Auto-generated by scripts/generate_lifestyle_catalog.py — do not edit by hand. */",
        "window.LIFESTYLE_BASELINE_IDS = " + json.dumps(baseline_ids) + ";",
        "window.LIFESTYLE_CATALOG = " + json.dumps(products, ensure_ascii=False) + ";",
    ]
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {len(products)} products, baseline {len(baseline_ids)} → {out_path}")


if __name__ == "__main__":
    main()
