# 🛡️ AI Fraud Detection for Food Delivery

A full-stack B2B SaaS MVP designed to detect AI-generated images used in food delivery refund fraud. This system analyzes uploaded evidence photos for metadata inconsistencies and AI generation artifacts to assign a risk score.

![Dashboard Screenshot](screenshot.png)
*(Add a screenshot of your dashboard here and name it screenshot.png)*

## 🚀 Features

*   **Multi-Layer Analysis**:
    *   **Metadata Scan**: Checks for stripped EXIF data (common in AI/edited images).
    *   **AI Probability**: Uses a Hugging Face Transformer model (`umm-maybe/AI-image-detector`) to detect digital generation patterns.
    *   **Resolution Check**: Flags suspicious standard resolutions (e.g., 1024x1024) often used by generative AI.
*   **Risk Scoring**: Calculates a 0-100 fraud score with clear verdicts (APPROVE, REVIEW, REJECT).
*   **Real-time Dashboard**: React-based UI for agents to upload images and view history.
*   **History Tracking**: SQLite database stores all scan results for audit trails.

## 🛠️ Tech Stack

### Backend
*   **Framework**: FastAPI (Python)
*   **ML/AI**: PyTorch, Transformers (Hugging Face)
*   **Image Processing**: Pillow (PIL), Piexif
*   **Database**: SQLite

### Frontend
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React

## ⚡ Quick Start

### Prerequisites
*   Python 3.8+
*   Node.js 16+

### Automatic Setup (Windows)
1.  Run the setup script to install dependencies:
    ```powershell
    .\setup.bat
    ```
2.  Start the servers:
    ```powershell
    .\start_servers.bat
    ```

### Manual Setup

**1. Backend**
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

**2. Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 🔍 How It Works

1.  **Upload**: The user uploads an image via the dashboard.
2.  **Analyze**: The backend processes the image:
    *   Extracts EXIF metadata.
    *   Runs the image through the AI classification model.
    *   Checks image dimensions.
3.  **Score**: A weighted algorithm calculates the risk:
    *   `+50` if AI Confidence > 80%
    *   `+30` if Metadata is missing
    *   `+10` for suspicious resolutions
4.  **Result**: The frontend displays the Score, Verdict, and specific "Red Flags".

## 📄 License

This project is an MVP prototype. The AI model used is subject to its own license (CC-BY-ND 4.0).
