import torch
import torchvision.transforms as transforms
import torch.nn as nn
from tqdm import tqdm
from torchmetrics import Accuracy
import torch.optim as optim
import torchvision.models as models
from torchvision import datasets
from torch.utils.data import DataLoader
from pathlib import Path

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

train_dataloader = DataLoader(
    dataset=train_dataset, batch_size=32, shuffle=True)
test_dataLoader = DataLoader(
    dataset=test_dataset, batch_size=32, shuffle=False)

classes = train_dataset.classes
print(f"Classes found: {classes}")

model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

for param in model.parameters():
    param.requires_grad = True

num_features = model.fc.in_features
num_classes = len(classes)
model.fc = nn.Linear(num_features, num_classes)


loss_fn = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=1e-4)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(
    optimizer, mode='min', patience=3, factor=0.5)


acc_fn = Accuracy(task='multiclass', num_classes=num_classes)
epoch = 25
for i in tqdm(range(epoch)):
    model.train()
    train_loss, train_acc = 0, 0

    for batch_idx, (images, targets) in enumerate(train_dataloader):
        y_logits = model(images)
        loss = loss_fn(y_logits, targets)
        train_loss += loss.item()
        y_pred = torch.argmax(y_logits, dim=1)
        train_acc += (y_pred == targets).float().mean().item()
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    train_loss /= len(train_dataloader)
    train_acc /= len(train_dataloader)

    model.eval()
    with torch.inference_mode():
        test_loss, test_acc = 0, 0
        for batch_idx, (image, targets) in enumerate(test_dataLoader):

            y_test_logits = model(image)
            loss = loss_fn(y_test_logits, targets)
            test_loss += loss.item()

            y_test_pred = torch.argmax(y_test_logits, dim=1)
            test_acc += (y_test_pred == targets).float().mean().item()

        test_loss /= len(test_dataLoader)
        test_acc /= len(test_dataLoader)
        scheduler.step(test_loss)

    if i % 2 == 0 or epoch == epoch - 1:
        print(f"\nEpoch {i+1:02d}")
        print(
            f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc*100:.2f}%")
        print(f"Test Loss:  {test_loss:.4f} | Test Acc:  {test_acc*100:.2f}%")

torch.save(model.state_dict(), "arknight_character_recognization_model.pth")
print("\nModel saved successfully!")
