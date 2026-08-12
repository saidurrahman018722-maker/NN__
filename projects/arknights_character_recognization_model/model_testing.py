import torch
import random
import matplotlib.pyplot as plt
import torchvision.models as models
from torchvision import datasets
from torch.utils.data import DataLoader
import torchvision.transforms as transforms
from pathlib import Path
import torch.nn as nn


# Assuming model, train_dataset, and test_data are already defined earlier

mean = (0.485, 0.456, 0.406)
std = (0.229, 0.224, 0.225)

train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(brightness=0.1, contrast=0.1),
    transforms.RandomRotation(15),
    transforms.ToTensor(),
    transforms.Normalize(mean=mean, std=std)
])

val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=mean, std=std)
])

SCRIPT_DIR = Path(__file__).resolve().parent

TRAIN_DIR = SCRIPT_DIR / "arknights_dataset" / "train"
VAL_DIR = SCRIPT_DIR / "arknights_dataset" / "val"


train_dataset = datasets.ImageFolder(
    root=str(TRAIN_DIR), transform=train_transform)
test_dataset = datasets.ImageFolder(root=str(VAL_DIR), transform=val_transform)

model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
model.fc = nn.Linear(model.fc.in_features, len(train_dataset.classes))

model.load_state_dict(torch.load("arknight_character_recognization_model.pth"))

classes_name = train_dataset.classes


def predicting_images(model, images):
    model.eval()
    with torch.inference_mode():
        if isinstance(images, list):
            images = torch.stack(images)

        y_logit = model(images)
        y_prediction = torch.argmax(y_logit, dim=1)

    return y_prediction


sample_images = []
targets = []


for sample, target in random.sample(list(test_dataset), 4):
    sample_images.append(sample)
    targets.append(target)

# Get the predicted name using our new function
predictions = predicting_images(model, sample_images)
print('The predictions are:', predictions)

print(f"\n--- Prediction Test ---")

for i in range(len(predictions)):
    print(f"The model guessed: {classes_name[predictions[i]]}")
    print(f"The actual image is: {classes_name[targets[i]]}")

# Visualize Visualize Visualize!!!!

mean_tensor = torch.tensor(mean).view(3, 1, 1)
std_tensor = torch.tensor(std).view(3, 1, 1)

plt.figure(figsize=(6, 6))
nrow = 2
ncol = 2

for i, sample in enumerate(sample_images):
    plt.subplot(nrow, ncol, i+1)
    normalize_sample = (sample * std_tensor) + mean_tensor
    img = normalize_sample.permute(1, 2, 0).numpy()
    plt.imshow(img)
    predicted_name = classes_name[predictions[i]]
    true_name = classes_name[targets[i]]

    if predicted_name == true_name:
        title_color = 'green'
    else:
        title_color = 'red'

    plt.title(f"Pred: {predicted_name} | True: {true_name}", color=title_color)
    plt.axis('off')
plt.show()
