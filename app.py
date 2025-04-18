import os
import cv2
import numpy as np
import pytesseract
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Set Tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe'

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    # Read image
    img = cv2.imread(image_path)
    if img is None:
        raise Exception("Image loading failed during preprocessing.")

    # Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Gaussian blur
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Adaptive thresholding
    thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY, 11, 2)

    # Save preprocessed image with a safe name
    name, ext = os.path.splitext(image_path)
    preprocessed_path = f"{name}_processed{ext}"
    cv2.imwrite(preprocessed_path, thresh)

    return preprocessed_path, img.shape

def extract_text(image_path):
    try:
        img = cv2.imread(image_path)
        if img is None:
            raise Exception("Image loading failed during text extraction.")
        
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Improve OCR with config
        text = pytesseract.image_to_string(img_rgb, config='--psm 6')

        print(f"Extracted Text: {text}")  # For debug

        return text.strip() if text.strip() else "No text extracted."
    except Exception as e:
        print(f"Error in text extraction: {str(e)}")
        return f"Error extracting text: {str(e)}"

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return render_template('index.html', error='No file part')

    file = request.files['file']

    if file.filename == '':
        return render_template('index.html', error='No selected file')

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            preprocessed_path, original_dimensions = preprocess_image(filepath)
            raw_text = extract_text(preprocessed_path)

            return render_template('result.html',
                                   raw_text=raw_text,
                                   original_image=filepath,
                                   preprocessed_image=preprocessed_path,
                                   width=original_dimensions[1],
                                   height=original_dimensions[0])
        except Exception as e:
            return render_template('index.html', error=str(e))

    return render_template('index.html', error='Invalid file format')

@app.route('/api/upload', methods=['POST'])
def api_upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            preprocessed_path, original_dimensions = preprocess_image(filepath)
            raw_text = extract_text(preprocessed_path)

            return jsonify({
                'raw_text': raw_text,
                'original_image': filepath,
                'preprocessed_image': preprocessed_path,
                'dimensions': {
                    'width': original_dimensions[1],
                    'height': original_dimensions[0]
                }
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'Invalid file format'}), 400

if __name__ == '__main__':
    app.run(debug=True)
