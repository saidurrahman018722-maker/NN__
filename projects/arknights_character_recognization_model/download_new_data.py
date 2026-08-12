import requests
import base64
import os
import uuid
from pathlib import Path

# IMPORTANT: Change this URL to your live Render backend URL when you run this!
API_BASE_URL = "http://localhost:3000/api"

def main():
    print("Fetching new verified training data from server...")
    try:
        response = requests.get(f"{API_BASE_URL}/feedback/download")
        response.raise_for_status()
        feedback_records = response.json()
    except Exception as e:
        print(f"Failed to connect to API: {e}")
        return

    if not feedback_records:
        print("No new training data found! The model is fully up to date.")
        return

    print(f"Found {len(feedback_records)} new verified images. Downloading...")

    processed_ids = []
    base_dir = Path(__file__).resolve().parent / "arknights_dataset" / "train"

    for record in feedback_records:
        record_id = record['id']
        correct_character = record['correctCharacter']
        base64_data = record['imageData']
        
        # Strip the data:image/jpeg;base64, prefix if it exists
        if ',' in base64_data:
            base64_data = base64_data.split(',')[1]

        # Create character directory if it doesn't exist
        char_dir = base_dir / correct_character.lower()
        char_dir.mkdir(parents=True, exist_ok=True)

        # Generate a unique filename
        filename = f"user_verified_{uuid.uuid4().hex[:8]}.jpg"
        filepath = char_dir / filename

        try:
            image_bytes = base64.b64decode(base64_data)
            with open(filepath, 'wb') as f:
                f.write(image_bytes)
            processed_ids.append(record_id)
            print(f"Saved: {correct_character} -> {filename}")
        except Exception as e:
            print(f"Failed to save image for record {record_id}: {e}")

    # Mark as processed on the server
    if processed_ids:
        print(f"Marking {len(processed_ids)} records as processed on the server...")
        try:
            requests.post(f"{API_BASE_URL}/feedback/mark-processed", json={"ids": processed_ids})
            print("Successfully updated server!")
        except Exception as e:
            print(f"Warning: Downloaded images but failed to update server status: {e}")

    print("\nDownload complete! You can now run model_train.py to improve the model.")

if __name__ == "__main__":
    main()
