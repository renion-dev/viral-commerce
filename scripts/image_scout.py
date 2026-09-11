#!/usr/bin/env python3
"""
Image Scout — автоматичний пошук та завантаження фото продуктів через SerpApi.
"""

import json
import os
import sys
import urllib.request
import urllib.parse
import ssl
from pathlib import Path

# Завантажуємо ключ з .env
def load_key():
    env_path = Path(__file__).parent.parent / ".env"
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line.startswith("SERPAPI_KEY="):
                    return line.split("=", 1)[1]
    return os.environ.get("SERPAPI_KEY", "")

def search_image(query, api_key):
    """Шукає перше зображення через SerpApi (Google Images)"""
    params = {
        "q": query,
        "tbm": "isch",  # image search
        "ijn": "0",
        "api_key": api_key
    }
    url = f"https://serpapi.com/search?{urllib.parse.urlencode(params)}"
    
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(url, context=ctx, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            if "images_results" in data and len(data["images_results"]) > 0:
                return data["images_results"][0].get("original", "")
    except Exception as e:
        print(f"  Search error: {e}")
    return ""

def download_image(url, save_path):
    """Завантажує зображення з URL"""
    ctx = ssl.create_default_context()
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            with open(save_path, "wb") as f:
                f.write(resp.read())
        return True
    except Exception as e:
        print(f"  Download error: {e}")
        return False

def main():
    api_key = load_key()
    if not api_key:
        print("ERROR: SERPAPI_KEY not found in .env or environment")
        sys.exit(1)
    
    # Читаємо world-state.json
    ws_path = Path(__file__).parent.parent / "website" / "data" / "world-state.json"
    with open(ws_path) as f:
        world = json.load(f)
    
    products_dir = Path(__file__).parent.parent / "website" / "assets" / "products"
    products_dir.mkdir(parents=True, exist_ok=True)
    
    updated = 0
    for product in world.get("products", []):
        pid = product.get("id", "")
        name = product.get("name", "")
        image = product.get("image", "")
        
        # Пропускаємо якщо вже є локальне фото
        local_path = products_dir / f"{pid}.jpg"
        if local_path.exists() and local_path.stat().st_size > 1000:
            print(f"  {name}: already has image, skipping")
            continue
        
        # Шукаємо зображення
        print(f"  Searching image for: {name}")
        query = f"{name} product photo white background"
        img_url = search_image(query, api_key)
        
        if not img_url:
            # Пробуємо інший запит
            query = f"{name} amazon product"
            img_url = search_image(query, api_key)
        
        if img_url:
            print(f"  Found: {img_url[:80]}...")
            if download_image(img_url, str(local_path)):
                size = local_path.stat().st_size
                print(f"  Downloaded: {size} bytes")
                product["image"] = f"assets/products/{pid}.jpg"
                updated += 1
            else:
                print(f"  Failed to download")
        else:
            print(f"  No image found")
    
    # Зберігаємо оновлений world-state.json
    with open(ws_path, "w") as f:
        json.dump(world, f, indent=2, ensure_ascii=False)
    
    print(f"\nDone! Updated {updated} product images.")

if __name__ == "__main__":
    main()
