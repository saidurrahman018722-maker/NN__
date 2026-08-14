import os
import requests
import time
from pathlib import Path

# Target counts
TARGET_TRAIN = 200
TARGET_VAL = 40
TOTAL_TARGET = TARGET_TRAIN + TARGET_VAL

CHARACTERS = [
    "amiya", "ch'en", "exusiai", "lappland", "logos",
    "myrtle", "silverash", "surtr", "texas", "thorns",
    "phantom", "skadi", "kal'tsit", "w", "nian",
    "mudrock", "eyjafjalla", "saria", "ifrit", "hoshiguma"
]

BASE_DIR = Path(__file__).resolve().parent / "arknights_dataset"
TRAIN_DIR = BASE_DIR / "train"
VAL_DIR = BASE_DIR / "val"

# Danbooru API headers (requires User-Agent)
HEADERS = {
    'User-Agent': 'ArknightsDatasetScraper/1.0'
}

def balance_existing_files(char_name):
    train_char_dir = TRAIN_DIR / char_name
    val_char_dir = VAL_DIR / char_name
    
    train_char_dir.mkdir(parents=True, exist_ok=True)
    val_char_dir.mkdir(parents=True, exist_ok=True)
    
    train_files = list(train_char_dir.glob("*.*"))
    val_files = list(val_char_dir.glob("*.*"))
    
    # Simple re-balancing logic if train has extra and val needs them
    while len(val_files) < TARGET_VAL and len(train_files) > TARGET_TRAIN:
        file_to_move = train_files.pop()
        file_to_move.rename(val_char_dir / file_to_move.name)
        val_files.append(val_char_dir / file_to_move.name)
        
    while len(train_files) < TARGET_TRAIN and len(val_files) > TARGET_VAL:
        file_to_move = val_files.pop()
        file_to_move.rename(train_char_dir / file_to_move.name)
        train_files.append(train_char_dir / file_to_move.name)
        
    # Delete excess files
    while len(train_files) > TARGET_TRAIN:
        file_to_delete = train_files.pop()
        file_to_delete.unlink()
        
    while len(val_files) > TARGET_VAL:
        file_to_delete = val_files.pop()
        file_to_delete.unlink()
        
    return len(train_files), len(val_files)

def fetch_safebooru_posts(tag, limit=200):
    url = f"https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags={tag}&limit={limit}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching API for {tag}: {e}")
        return []

def download_image(url, save_path):
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
    return False

def scrape_character(char_name):
    # Danbooru limits anonymous API requests to 2 tags maximum
    tag = f"{char_name}_(arknights)+solo"
    
    # 1. Balance existing files between train/val
    train_count, val_count = balance_existing_files(char_name)
    
    need_train = TARGET_TRAIN - train_count
    need_val = TARGET_VAL - val_count
    total_needed = max(0, need_train) + max(0, need_val)
    
    if total_needed <= 0:
        print(f"[{char_name}] Already perfectly populated (Train: {train_count}, Val: {val_count}). Skipping.")
        return
        
    print(f"[{char_name}] Needs {max(0, need_train)} train, {max(0, need_val)} val. Fetching from Safebooru...")
    
    posts = fetch_safebooru_posts(tag, limit=total_needed + 50) # fetch a bit extra in case of missing file_urls
    
    downloaded = 0
    for post in posts:
        if downloaded >= total_needed:
            break
            
        # Safebooru uses 'file_url' or sometimes 'sample_url'
        file_url = post.get('file_url')
        if not file_url:
            # Try to build absolute URL if relative (Safebooru sometimes gives relative directory/image paths)
            directory = post.get('directory')
            image = post.get('image')
            if directory and image:
                file_url = f"https://safebooru.org/images/{directory}/{image}"
            else:
                continue
        elif file_url.startswith('//'):
            file_url = f"https:{file_url}"
        
        # Determine target directory
        if need_train > 0:
            target_dir = TRAIN_DIR / char_name
            prefix = "train_"
            need_train -= 1
        elif need_val > 0:
            target_dir = VAL_DIR / char_name
            prefix = "val_"
            need_val -= 1
        else:
            break
            
        ext = file_url.split('.')[-1]
        save_path = target_dir / f"{prefix}danbooru_{post['id']}.{ext}"
        
        if not save_path.exists():
            if download_image(file_url, save_path):
                downloaded += 1
                time.sleep(0.1) # Be nice to the server

if __name__ == "__main__":
    for char_name in CHARACTERS:
        scrape_character(char_name)
    print("Scraping and balancing complete!")
