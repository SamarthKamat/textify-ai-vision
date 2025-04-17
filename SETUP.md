
# TextifyAI - Image to Text Conversion App

## Setup Instructions

### Backend Setup (Flask)

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Install Tesseract OCR:
   - **Windows**: Download and install from https://github.com/UB-Mannheim/tesseract/wiki
   - **Mac**: `brew install tesseract`
   - **Linux**: `sudo apt-get install tesseract-ocr`

3. Run the Flask backend:
```bash
python app.py
```
This will start the server at http://localhost:5000

### Frontend Setup

The frontend is built with React. Run the development server according to your package manager:

```bash
npm start
```

### Using Docker (Optional)

If you prefer to use Docker:

```bash
docker build -t textifyai .
docker run -p 5000:5000 textifyai
```

## Usage Flow

1. Upload an image containing text through the interface
2. The system will process the image through several stages:
   - Grayscale conversion
   - Noise reduction
   - Adaptive thresholding
   - OCR processing
3. View the extracted text, which can be copied or downloaded as a text file

## Technologies Used

- **Backend**: Flask, OpenCV, Tesseract OCR
- **Frontend**: React with modern UI components
- **Image Processing**: OpenCV for preprocessing and enhancement
- **Text Extraction**: Tesseract OCR engine
