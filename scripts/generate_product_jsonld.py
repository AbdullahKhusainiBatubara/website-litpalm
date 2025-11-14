#!/usr/bin/env python3
"""
Generate JSON-LD Product and Service schema from products.xml

Usage:
  python scripts/generate_product_jsonld.py

Output:
  - generated/products-schema.json  (array of Product objects)
  - generated/products-schema.html  (HTML <script type="application/ld+json">...)</n+"""
import json
import os
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(__file__))
XML_PATH = os.path.join(ROOT, "products.xml")
OUT_DIR = os.path.join(ROOT, "generated")
os.makedirs(OUT_DIR, exist_ok=True)

NS = {"p": "http://www.litpalm.id/schema/products"}

def text_or_none(node, tag):
    el = node.find(tag, NS)
    return el.text.strip() if el is not None and el.text else None

def main():
    tree = ET.parse(XML_PATH)
    root = tree.getroot()

    products = []

    for category in root.findall("p:category", NS):
        cat_name = category.get("name") or text_or_none(category, "p:description") or ""
        for prod in category.findall("p:products/p:product", NS):
            pid = prod.get("id") or text_or_none(prod, "p:name")
            name = text_or_none(prod, "p:name")
            desc = text_or_none(prod, "p:description")
            image = text_or_none(prod, "p:image")

            item = {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": name,
                "description": desc,
                "sku": pid,
                "category": cat_name,
                "brand": {"@type": "Organization", "name": "LitPalm"},
            }
            if image:
                item["image"] = image

            # Optional specifications -> convert to key/value
            specs = prod.find("p:specifications", NS)
            if specs is not None:
                specs_dict = {}
                for s in specs.findall("p:specification", NS):
                    name_attr = s.get("name") or s.tag
                    specs_dict[name_attr] = s.text.strip() if s.text else None
                if specs_dict:
                    item["additionalProperty"] = [
                        {"@type": "PropertyValue", "name": k, "value": v}
                        for k, v in specs_dict.items()
                    ]

            products.append(item)

    # Write JSON file
    out_json = os.path.join(OUT_DIR, "products-schema.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    # Write HTML snippet with script tag
    out_html = os.path.join(OUT_DIR, "products-schema.html")
    with open(out_html, "w", encoding="utf-8") as f:
        f.write('<script type="application/ld+json">\n')
        json.dump(products, f, ensure_ascii=False, indent=2)
        f.write('\n</script>')

    print(f"Generated {out_json} and {out_html}")

if __name__ == '__main__':
    main()
