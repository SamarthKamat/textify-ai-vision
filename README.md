
# TextifyAI - Image to Text Conversion

This application uses OpenCV for image preprocessing and Tesseract OCR for text extraction, with a Flask backend and React frontend.

## Setup Instructions

### Backend Setup

1. Install Python dependencies:
```
pip install -r requirements.txt
```

2. Install Tesseract OCR:
   - **Windows**: Download and install from https://github.com/UB-Mannheim/tesseract/wiki
   - **Mac**: `brew install tesseract`
   - **Linux**: `sudo apt-get install tesseract-ocr`

3. Run the Flask backend:
```
python app.py
```

### Frontend Setup

1. Install Node.js dependencies:
```
npm install
```

2. Start the development server:
```
npm start
```

## Usage

1. Open the application in your browser
2. Upload an image containing text
3. View the preprocessing steps and extracted text
4. Copy or download the extracted text

## Technologies Used

- **Backend**: Flask, OpenCV, Tesseract OCR
- **Frontend**: React, Tailwind CSS
