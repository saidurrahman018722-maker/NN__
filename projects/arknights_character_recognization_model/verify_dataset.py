import os
from pathlib import Path
from PIL import Image

def verify_and_clean_dataset(dataset_path):
    print(f"Scanning dataset at {dataset_path} for corrupt images...")
    dataset_dir = Path(dataset_path)
    
    corrupt_count = 0
    valid_count = 0
    
    for filepath in dataset_dir.rglob("*.*"):
        if filepath.is_file():
            try:
                with Image.open(filepath) as img:
                    img.verify() # Verify that it is, in fact, an image
                valid_count += 1
            except Exception as e:
                print(f"Removing corrupt file: {filepath}")
                filepath.unlink()
                corrupt_count += 1

    print(f"Scan complete. Valid images: {valid_count}. Corrupt images removed: {corrupt_count}")

if __name__ == "__main__":
    SCRIPT_DIR = Path(__file__).resolve().parent
    TRAIN_DIR = SCRIPT_DIR / "arknights_dataset" / "train"
    VAL_DIR = SCRIPT_DIR / "arknights_dataset" / "val"
    
    verify_and_clean_dataset(TRAIN_DIR)
    verify_and_clean_dataset(VAL_DIR)
