# ⚔️ Arknights Character Recognition System

> **Rhodes Island Operator Identification Terminal**  
> An AI-powered full-stack web application designed to recognize Arknights game operators from artwork, display their personnel files, and continuously learn through an active user feedback system.

---

## 🌟 Highlights & Features

- 🎯 **High Accuracy Classification**: Powered by a fine-tuned **ConvNeXt-Tiny** architecture achieving **92.17% validation accuracy** across 20 distinct Arknights operator classes.
- 💻 **Rhodes Island Terminal Interface**: Responsive, sci-fi themed UI built with React 18, Vite, and Tailwind CSS.
- ⚡ **FastAPI PyTorch Microservice**: Asynchronous ML inference engine optimized for fast CPU/GPU predictions.
- 🗄️ **PostgreSQL + Prisma Database**: Real-time retrieval of character stats, operator classes, and personnel lore hosted on Neon DB.
- 🔄 **Human-in-the-Loop Feedback Loop**: 
  - If prediction is correct: Click **"Yes, it is [Operator]"**.
  - If prediction is incorrect: Click **"No, it's wrong"** and select the actual operator name from a dropdown.
  - Feedback images and ground-truth labels are automatically saved to PostgreSQL so the dataset can expand for future training runs!

---

## 👥 Supported Operators (20 Classes Gallery)

<table align="center">
  <tr>
    <td align="center" width="20%"><img src="assets/operators/amiya.jpg" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>🐰 Amiya</b></td>
    <td align="center" width="20%"><img src="assets/operators/ch'en.jpg" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>⚔️ Ch'en</b></td>
    <td align="center" width="20%"><img src="assets/operators/exusiai.png" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>👼 Exusiai</b></td>
    <td align="center" width="20%"><img src="assets/operators/eyjafjalla.png" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>🌋 Eyjafjalla</b></td>
  </tr>
  <tr>
    <td align="center" width="20%"><img src="assets/operators/hoshiguma.png" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>🛡️ Hoshiguma</b></td>
    <td align="center" width="20%"><img src="assets/operators/ifrit.png" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>🔥 Ifrit</b></td>
    <td align="center" width="20%"><img src="assets/operators/kal'tsit.png" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>🩺 Kal'tsit</b></td>
    <td align="center" width="20%"><img src="assets/operators/lappland.jpg" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>🗡️ Lappland</b></td>
  </tr>
  <tr>
    <td align="center" width="20%"><img src="assets/operators/logos.jpg" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>📜 Logos</b></td>
    <td align="center" width="20%"><img src="assets/operators/mudrock.png" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>🪨 Mudrock</b></td>
    <td align="center" width="20%"><img src="assets/operators/myrtle.png" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>🚩 Myrtle</b></td>
    <td align="center" width="20%"><img src="assets/operators/nian.png" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>🐉 Nian</b></td>
  </tr>
  <tr>
    <td align="center" width="20%"><img src="assets/operators/phantom.jpg" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>🎭 Phantom</b></td>
    <td align="center" width="20%"><img src="assets/operators/saria.png" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>🛡️ Saria</b></td>
    <td align="center" width="20%"><img src="assets/operators/silverash.jpg" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>❄️ SilverAsh</b></td>
    <td align="center" width="20%"><img src="assets/operators/skadi.png" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>🗡️ Skadi</b></td>
  </tr>
  <tr>
    <td align="center" width="20%"><img src="assets/operators/surtr.png" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>🔥 Surtr</b></td>
    <td align="center" width="20%"><img src="assets/operators/texas.png" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>⚔️ Texas</b></td>
    <td align="center" width="20%"><img src="assets/operators/thorns.png" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>⚡ Thorns</b></td>
    <td align="center" width="20%"><img src="assets/operators/w.png" width="100" height="100" style="object-fit:cover; border-radius:10px;"/><br/><b>💥 W</b></td>
  </tr>
</table>

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **HTTP Client**: Axios

### **Backend API**
- **Runtime**: Node.js, Express, TypeScript
- **ORM & Database**: Prisma ORM, PostgreSQL (Neon Cloud DB)
- **Validation & File Upload**: Zod, Multer, Form-Data

### **ML Microservice & Training**
- **Framework**: PyTorch, Torchvision, FastAPI, Uvicorn
- **Architecture**: ConvNeXt-Tiny (Transfer Learning with ImageNet normalization & OneCycleLR scheduling)

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([User]) -->|Upload Image| Frontend[React Vite Frontend]
    Frontend -->|POST /api/upload| Backend[Node.js / Express Backend]
    Backend -->|Multipart Stream| MLService[FastAPI ML Service]
    MLService -->|ConvNeXt Inference| MLService
    MLService -->|Return Predicted Class| Backend
    Backend -->|Query Character Details| DB[(PostgreSQL Database)]
    DB -->|Return Personnel File| Backend
    Backend -->|JSON Response| Frontend
    Frontend -->|Show Operator File| User

    User -->|Submit Correction / Feedback| Frontend
    Frontend -->|POST /api/feedback| Backend
    Backend -->|Save Feedback & Base64 Image| DB
```

---

## 📁 Repository Structure

```
Arknights_character_recognization_model/
├── assets/                   # README images & operator avatars
├── backend/                  # Node.js + Express API server
│   ├── prisma/               # Database schema & migrations
│   └── src/                  # Routes (/api/upload, /api/feedback) & seed data
├── frontend/                 # React + Vite web frontend
│   └── src/                  # Components (UploadZone, ResultCard) & styling
├── ml_service/               # FastAPI Python ML inference service
│   ├── main.py               # FastAPI server & PyTorch model loading
│   ├── arknight_character_recognization_model.pth # Pretrained model weights
│   └── Dockerfile            # Microservice container setup
└── projects/
    └── arknights_character_recognization_model/
        ├── model_train.py    # PyTorch training pipeline with weighted sampling
        └── model_testing.py  # Model evaluation & visual prediction testing
```

---

## 🚀 Quick Start & Installation Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **PostgreSQL Database** (e.g., Neon DB)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/saidurrahman018722-maker/NN__.git
cd NN__/Arknights_character_recognization_model
```

---

### Step 2: Set Up the ML Microservice
```bash
cd ml_service

# Create and activate Python virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start the FastAPI service (runs on http://localhost:8000)
python main.py
```

---

### Step 3: Set Up the Backend Server
```bash
cd ../backend

# Install dependencies
npm install

# Create environment file (.env) with your PostgreSQL connection:
# DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
# PORT=3000

# Push Prisma schema and seed database
npx prisma db push
npx tsx src/seed.ts

# Start the development server (runs on http://localhost:3000)
npm run dev
```

---

### Step 4: Set Up the Frontend Application
```bash
cd ../frontend

# Install dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

Open your browser at `http://localhost:5173` to launch the **Rhodes Island Terminal**! 🎮

---

## 📄 License & Disclaimer

This project is open-source under the MIT License.  
*Disclaimer: Arknights and all character assets, artwork, and character names belong to Hypergryph / Yostar. This project is built purely for educational and non-commercial machine learning demonstration purposes.*