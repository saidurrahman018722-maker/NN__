import os
import requests
import json
from pathlib import Path

# JSON output from browser subagent
data = {
  "phantom": [
    "https://static.wikia.nocookie.net/mrfz/images/e/ec/Phantom.png/revision/latest?cb=20200422222319",
    "https://static.wikia.nocookie.net/mrfz/images/e/e4/Phantom_Elite_2.png/revision/latest?cb=20200422222320",
    "https://static.wikia.nocookie.net/mrfz/images/d/db/Phantom_Skin_1.png/revision/latest?cb=20201015205140"
  ],
  "skadi": [
    "https://static.wikia.nocookie.net/mrfz/images/2/2b/Skadi.png/revision/latest?cb=20190724203654",
    "https://static.wikia.nocookie.net/mrfz/images/7/7c/Skadi_Elite_2.png/revision/latest?cb=20190724203716",
    "https://static.wikia.nocookie.net/mrfz/images/0/04/Skadi_Skin_1.png/revision/latest?cb=20200811102050"
  ],
  "kal'tsit": [
    "https://static.wikia.nocookie.net/mrfz/images/6/68/Kal%27tsit.png/revision/latest?cb=20231010112313",
    "https://static.wikia.nocookie.net/mrfz/images/1/1e/Kal%27tsit_Elite_2.png/revision/latest?cb=20210424140805",
    "https://static.wikia.nocookie.net/mrfz/images/3/39/Kal%27tsit_Skin_1.png/revision/latest?cb=20230501091215"
  ],
  "w": [
    "https://static.wikia.nocookie.net/mrfz/images/2/25/W.png/revision/latest?cb=20200501132649",
    "https://static.wikia.nocookie.net/mrfz/images/6/64/W_Elite_2.png/revision/latest?cb=20200501132518",
    "https://static.wikia.nocookie.net/mrfz/images/6/60/W_Skin_1.png/revision/latest?cb=20201214010748"
  ],
  "nian": [
    "https://static.wikia.nocookie.net/mrfz/images/e/e0/Nian.png/revision/latest?cb=20200201060614",
    "https://static.wikia.nocookie.net/mrfz/images/c/c8/Nian_Elite_2.png/revision/latest?cb=20200201060609",
    "https://static.wikia.nocookie.net/mrfz/images/5/5f/Nian_Skin_1.png/revision/latest?cb=20210406101532"
  ],
  "mudrock": [
    "https://static.wikia.nocookie.net/mrfz/images/a/a4/Mudrock.png/revision/latest?cb=20201101075104",
    "https://static.wikia.nocookie.net/mrfz/images/9/97/Mudrock_Elite_2.png/revision/latest?cb=20201101075314",
    "https://static.wikia.nocookie.net/mrfz/images/4/4c/Mudrock_Skin_1.png/revision/latest?cb=20210803142508"
  ],
  "eyjafjalla": [
    "https://static.wikia.nocookie.net/mrfz/images/b/b7/Eyjafjalla.png/revision/latest?cb=20190627032126",
    "https://static.wikia.nocookie.net/mrfz/images/9/95/Eyjafjalla_Elite_2.png/revision/latest?cb=20190627032127",
    "https://static.wikia.nocookie.net/mrfz/images/c/c7/Eyjafjalla_Skin_1.png/revision/latest?cb=20210720125841"
  ],
  "saria": [
    "https://static.wikia.nocookie.net/mrfz/images/b/b5/Saria.png/revision/latest?cb=20190625063653",
    "https://static.wikia.nocookie.net/mrfz/images/e/e8/Saria_Elite_2.png/revision/latest?cb=20190625063654",
    "https://static.wikia.nocookie.net/mrfz/images/d/d1/Saria_Skin_1.png/revision/latest?cb=20200501183635"
  ],
  "ifrit": [
    "https://static.wikia.nocookie.net/mrfz/images/b/b5/Ifrit.png/revision/latest?cb=20190625063649",
    "https://static.wikia.nocookie.net/mrfz/images/b/b2/Ifrit_Elite_2.png/revision/latest?cb=20190625063650",
    "https://static.wikia.nocookie.net/mrfz/images/d/df/Ifrit_Skin_1.png/revision/latest?cb=20200201075626"
  ],
  "hoshiguma": [
    "https://static.wikia.nocookie.net/mrfz/images/a/aa/Hoshiguma.png/revision/latest?cb=20190627031440",
    "https://static.wikia.nocookie.net/mrfz/images/e/eb/Hoshiguma_Elite_2.png/revision/latest?cb=20190627031440",
    "https://static.wikia.nocookie.net/mrfz/images/c/c2/Hoshiguma_Skin_1.png/revision/latest?cb=20200719101839"
  ]
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

BASE_DIR = Path(__file__).resolve().parent / "arknights_dataset"
TRAIN_DIR = BASE_DIR / "train"
VAL_DIR = BASE_DIR / "val"

def download_image(url, save_path):
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
    return False

def setup_empty_val_folders():
    # Make sure val has all folders that exist in train
    for char_dir in TRAIN_DIR.iterdir():
        if char_dir.is_dir():
            (VAL_DIR / char_dir.name).mkdir(parents=True, exist_ok=True)

if __name__ == "__main__":
    setup_empty_val_folders()
    
    for char_name, urls in data.items():
        print(f"Downloading images for {char_name}...")
        
        train_char_dir = TRAIN_DIR / char_name
        val_char_dir = VAL_DIR / char_name
        
        train_char_dir.mkdir(parents=True, exist_ok=True)
        val_char_dir.mkdir(parents=True, exist_ok=True)
        
        for i, url in enumerate(urls):
            # Put first two in train, third in val
            target_dir = train_char_dir if i < 2 else val_char_dir
            save_path = target_dir / f"browser_{i}.png"
            download_image(url, save_path)
            
    print("Done downloading browser images!")
