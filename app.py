import os
import cv2
import pytesseract
import numpy as np
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

# Configure Tesseract path for Windows
if os.name == 'nt':
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# 📦 Hugging Face Setup
model_name = "google/flan-t5-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
generator = pipeline("text2text-generation", model=model, tokenizer=tokenizer)

# 📁 Flask App Setup
app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp'}
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

from flask import send_from_directory

# ✅ Only one definition needed
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# ✅ Helper Functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    img = cv2.imread(image_path)
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray_path = image_path.replace('.', '_gray.')
    cv2.imwrite(gray_path, gray)
    
    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    blur_path = image_path.replace('.', '_blur.')
    cv2.imwrite(blur_path, blurred)
    
    # Edge detection
    canny = cv2.Canny(blurred, 100, 200)
    edge_path = image_path.replace('.', '_edge.')
    cv2.imwrite(edge_path, canny)
    
    # Thresholding
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 11, 2
    )
    thresh_path = image_path.replace('.', '_thresh.')
    cv2.imwrite(thresh_path, thresh)
    
    return {
        'gray': gray_path,
        'blur': blur_path,
        'edge': edge_path,
        'thresh': thresh_path
    }, img.shape, thresh

def extract_text_from_image(img_np):
    return pytesseract.image_to_string(img_np)

def refine_text_with_ai(text):
    if not text.strip():
        return "No text detected."
    prompt = f"Correct the spelling and grammar: {text}"
    result = generator(prompt, max_length=300, temperature=0.3)
    return result[0]['generated_text']

# 🖼️ Routes
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
            preprocessed_path, dimensions, thresh_img = preprocess_image(filepath)
            raw_text = extract_text_from_image(thresh_img)
            refined_text = refine_text_with_ai(raw_text)

            return render_template('result.html',
                raw_text=raw_text,
                refined_text=refined_text,
                original_image=filepath,
                preprocessed_image=preprocessed_path,
                width=dimensions[1],
                height=dimensions[0]
            )
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
            processed_paths, dimensions, thresh_img = preprocess_image(filepath)
            raw_text = extract_text_from_image(thresh_img)
            refined_text = refine_text_with_ai(raw_text)

            # Convert file paths to relative URLs for frontend access
            original_image_url = '/uploads/' + os.path.basename(filepath)
            processed_urls = {
                'gray': '/uploads/' + os.path.basename(processed_paths['gray']),
                'blur': '/uploads/' + os.path.basename(processed_paths['blur']),
                'edge': '/uploads/' + os.path.basename(processed_paths['edge']),
                'thresh': '/uploads/' + os.path.basename(processed_paths['thresh'])
            }
            
            return jsonify({
                'raw_text': raw_text,
                'refined_text': refined_text,
                'original_image': original_image_url,
                'processed_images': processed_urls,
                'dimensions': {'width': dimensions[1], 'height': dimensions[0]}
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'Invalid file format'}), 400

if __name__ == '__main__':
    app.run(debug=True)