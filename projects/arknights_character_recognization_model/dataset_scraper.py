import os
from bing_image_downloader import downloader
from pathlib import Path

TARGET_COUNT = 200

CHARACTERS = {
    # Existing
    "amiya": "Arknights Amiya official art",
    "ch'en": "Arknights Ch'en official art",
    "exusiai": "Arknights Exusiai official art",
    "lappland": "Arknights Lappland official art",
    "logos": "Arknights Logos official art",
    "myrtle": "Arknights Myrtle official art",
    "silverash": "Arknights SilverAsh official art",
    "surtr": "Arknights Surtr official art",
    "texas": "Arknights Texas official art",
    "thorns": "Arknights Thorns official art",
    # New
    "phantom": "Arknights Phantom official art",
    "skadi": "Arknights Skadi official art",
    "kal'tsit": "Arknights Kal'tsit official art",
    "w": "Arknights W official art",
    "nian": "Arknights Nian official art",
    "mudrock": "Arknights Mudrock official art",
    "eyjafjalla": "Arknights Eyjafjalla official art",
    "saria": "Arknights Saria official art",
    "ifrit": "Arknights Ifrit official art",
    "hoshiguma": "Arknights Hoshiguma official art",
}

BASE_DIR = Path(__file__).resolve().parent / "arknights_dataset" / "train"

def scrape_character(char_name, query):
    char_dir = BASE_DIR / char_name
    char_dir.mkdir(parents=True, exist_ok=True)
    
    existing_count = len(list(char_dir.glob("*.jpg"))) + len(list(char_dir.glob("*.png")))
    needed = TARGET_COUNT - existing_count
    
    if needed <= 0:
        print(f"[{char_name}] Already has {existing_count} images. Skipping.")
        return

    print(f"[{char_name}] Needs {needed} more images. Scraping using Bing...")
    
    try:
        downloader.download(query, limit=needed, output_dir=str(BASE_DIR), adult_filter_off=True, force_replace=False, timeout=10, verbose=False)
    except Exception as e:
        print(f"Error scraping {char_name}: {e}")
    finally:
        # Bing image downloader creates a folder with the query name. 
        # We need to move those files to our target char_dir
        download_dir = BASE_DIR / query
        if download_dir.exists():
            for i, f in enumerate(download_dir.glob("*")):
                dest_path = char_dir / f"bing_{f.name}"
                # Handle filename collisions
                if dest_path.exists():
                    dest_path = char_dir / f"bing_{i}_{f.name}"
                try:
                    f.rename(dest_path)
                except Exception as e:
                    print(f"Failed to move {f.name}: {e}")
            
            # Remove empty directory
            try:
                download_dir.rmdir()
            except:
                pass

if __name__ == "__main__":
    for char_name, query in CHARACTERS.items():
        scrape_character(char_name, query)
    print("Scraping complete!")
