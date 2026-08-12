import os
import io
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

app = FastAPI(title="Arknights Character Recognition ML Service")

# Define the class names in the alphabetical order of the dataset folders
CLASS_NAMES = [
    "amiya",
    "ch'en",
    "exusiai",
    "lappland",
    "logos",
    "myrtle",
    "silverash",
    "surtr",
    "texas",
    "thorns"
]

# Initialize the model structure
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.resnet18(pretrained=False)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, len(CLASS_NAMES))

# Load the weights
model_path = os.path.join(os.path.dirname(__file__), 'arknight_character_recognization_model.pth')
if os.path.exists(model_path):
    model.load_state_dict(torch.load(model_path, map_location=device))
    print(f"Successfully loaded model from {model_path}")
else:
    print(f"Warning: Model file not found at {model_path}. Please place it there before running in production.")

model.to(device)
model.eval()

# Standard ImageNet normalization
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        # Read image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Transform and predict
        input_tensor = transform(image)
        input_batch = input_tensor.unsqueeze(0).to(device)
        
        with torch.no_grad():
            output = model(input_batch)
            _, predicted_idx = torch.max(output, 1)
            
        predicted_class = CLASS_NAMES[predicted_idx.item()]
        
        return JSONResponse(content={"predicted_class": predicted_class})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
