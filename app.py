
import os
import cv2
import numpy as np
import pytesseract
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='build', static_url_path='/')
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    # Read the image with OpenCV
    img = cv2.imread(image_path)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur to reduce noise
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                  cv2.THRESH_BINARY, 11, 2)
    
    # Deskew if needed
    # This is simplified; a more robust deskew would analyze text angles
    
    # Save the preprocessed image
    preprocessed_path = image_path.replace('.', '_processed.')
    cv2.imwrite(preprocessed_path, thresh)
    
    return preprocessed_path, img.shape

def extract_text(image_path):
    # Use pytesseract to extract text from the preprocessed image
    text = pytesseract.image_to_string(image_path)
    return text

@app.route('/api/upload', methods=['POST'])
def upload_file():
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
            # Process the image
            preprocessed_path, original_dimensions = preprocess_image(filepath)
            
            # Extract text
            raw_text = extract_text(preprocessed_path)
            
            # Return results
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

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)
