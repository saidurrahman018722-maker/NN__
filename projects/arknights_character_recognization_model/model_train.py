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
import multiprocessing

mean = (0.485, 0.456, 0.406)
std = (0.229, 0.224, 0.225)

train_transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.RandomCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.TrivialAugmentWide(),
    # transforms.RandomRotation(15),
    transforms.ToTensor(),
    transforms.Normalize(mean=mean, std=std),
    transforms.RandomErasing(p=0.1)
])

val_transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=mean, std=std)
])


SCRIPT_DIR = Path(__file__).resolve().parent

TRAIN_DIR = SCRIPT_DIR / "arknights_dataset" / "train"
VAL_DIR = SCRIPT_DIR / "arknights_dataset" / "val"


epoch = 35

best_val_acc = 0.0


def train_and_validate(epoch, current_optimizer, current_scheduler, phase_name):
    global best_val_acc
    for i in range(epoch):
        model.train()
        train_loss, train_acc = 0, 0
        loop = tqdm(train_dataloader,
                    desc=f"[{phase_name}] Epoch {i+1}/{epoch} [Train]")
        for images, targets in loop:
            current_optimizer.zero_grad()
            y_logits = model(images)
            loss = loss_fn(y_logits, targets)
            loss.backward()
            current_optimizer.step()
            if current_scheduler:
                current_scheduler.step()
            train_loss += loss.item()
            y_pred = torch.argmax(y_logits, dim=1)
            train_acc += (y_pred == targets).float().mean().item()
            loop.set_postfix(loss=loss.item())

        train_loss /= len(train_dataloader)
        train_acc /= len(train_dataloader)

        model.eval()
        with torch.inference_mode():
            test_loss, test_acc = 0, 0
            for image, targets in tqdm(test_dataloader, desc=f"[{phase_name}] Epoch {i+1}/{epoch} [Val]"):

                y_test_logits = model(image)
                loss = loss_fn(y_test_logits, targets)
                test_loss += loss.item()

                y_test_pred = torch.argmax(y_test_logits, dim=1)
                test_acc += (y_test_pred == targets).float().mean().item()

        test_loss /= len(test_dataloader)
        test_acc /= len(test_dataloader)

        print(f"\n[{phase_name}] Epoch {epoch+1:02d} Summary:")
        print(
            f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc*100:.2f}%")
        print(
            f"Test Loss:  {test_loss:.4f} | Test Acc:  {test_acc*100:.2f}%")

        if test_acc > best_val_acc:
            best_val_acc = test_acc
            torch.save(model.state_dict(),
                       "arknight_character_recognization_model.pth")
            print(
                f"--> New best model saved with {best_val_acc*100:.2f}% accuracy!")


if __name__ == '__main__':
    train_dataset = datasets.ImageFolder(
        root=str(TRAIN_DIR), transform=train_transform)
    test_dataset = datasets.ImageFolder(
        root=str(VAL_DIR), transform=val_transform)

    num_worker = min(multiprocessing.cpu_count(), 8)

    train_dataloader = DataLoader(
        dataset=train_dataset, batch_size=32,
        num_workers=num_worker, shuffle=True)
    test_dataloader = DataLoader(
        dataset=test_dataset, batch_size=32,
        num_workers=num_worker, shuffle=False)

    classes = train_dataset.classes
    print(f"Classes found: {classes}")

    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

    for param in model.parameters():
        param.requires_grad = False
    num_features = model.fc.in_features
    num_classes = len(classes)
    model.fc = nn.Sequential(
        nn.Dropout(0.4),
        nn.Linear(num_features, num_classes)
    )

    loss_fn = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-2)

    acc_fn = Accuracy(task='multiclass', num_classes=num_classes)
    print("\n Starting phase ->> 1")
    phase1_epochs = 5
    optimizer_stage_1 = optim.AdamW(
        model.parameters(), lr=1e-3, weight_decay=1e-2)
    train_and_validate(phase1_epochs, optimizer_stage_1, None, "Phase 1")

    print("\n Starting phase ->> 2")
    for param in model.parameters():
        param.requires_grad = True
    phase2_epochs = 30
    optimizer_stage_2 = optim.AdamW(
        model.parameters(), lr=5e-5, weight_decay=1e-2)
    step_per_epoch = len(train_dataloader)
    scheduler = optim.lr_scheduler.OneCycleLR(
        optimizer_stage_2, max_lr=5e-5, steps_per_epoch=step_per_epoch, epochs=phase2_epochs)
    train_and_validate(phase2_epochs, optimizer_stage_2, scheduler, "Phase 2")
    print("\nTraining Complete! Best model saved as 'arknight_character_recognization_model.pth'.")
