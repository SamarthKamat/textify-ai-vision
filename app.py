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
    # Read image and resize if too large
    img = cv2.imread(image_path)
    max_dimension = 3000
    height, width = img.shape[:2]
    if max(height, width) > max_dimension:
        scale = max_dimension / max(height, width)
        img = cv2.resize(img, None, fx=scale, fy=scale)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray_path = image_path.replace('.', '_gray.')
    cv2.imwrite(gray_path, gray)
    
    # Denoise image
    denoised = cv2.fastNlMeansDenoising(gray)
    
    # Apply adaptive histogram equalization
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    enhanced = clahe.apply(denoised)
    
    # Apply bilateral filter for edge preservation
    bilateral = cv2.bilateralFilter(enhanced, 9, 75, 75)
    blur_path = image_path.replace('.', '_blur.')
    cv2.imwrite(blur_path, bilateral)
    
    # Edge detection with Canny
    canny = cv2.Canny(bilateral, 50, 150)
    edge_path = image_path.replace('.', '_edge.')
    cv2.imwrite(edge_path, canny)
    
    # Deskew image if needed
    coords = np.column_stack(np.where(canny > 0))
    if len(coords) > 0:
        angle = cv2.minAreaRect(coords)[-1]
        if angle < -45:
            angle = 90 + angle
        if abs(angle) > 0.5:
            (h, w) = enhanced.shape[:2]
            center = (w // 2, h // 2)
            M = cv2.getRotationMatrix2D(center, angle, 1.0)
            enhanced = cv2.warpAffine(enhanced, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    
    # Advanced adaptive thresholding
    block_size = 35
    C = 10
    thresh = cv2.adaptiveThreshold(enhanced, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, block_size, C)
    thresh_path = image_path.replace('.', '_thresh.')
    cv2.imwrite(thresh_path, thresh)
    
    # Morphological operations
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
    # Remove noise
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    # Connect text components
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    # Remove small noise
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    
    return {
        'gray': gray_path,
        'blur': blur_path,
        'edge': edge_path,
        'thresh': thresh_path
    }, img.shape, thresh

def extract_text_from_image(img_np):
    # Configure Tesseract parameters for maximum accuracy
    custom_config = r'--oem 3 --psm 6 '
    custom_config += r'-c tessedit_char_blacklist=§|¦ '
    custom_config += r'-c textord_heavy_nr=1 '
    custom_config += r'-c textord_min_linesize=3 '
    custom_config += r'-c tessedit_enable_dict_correction=1 '
    custom_config += r'-c tessedit_enable_bigram_correction=1 '
    custom_config += r'-c tessedit_write_images=true '
    
    # Try multiple page segmentation modes
    psm_modes = [6, 3, 4, 1]
    text_results = []
    
    for psm in psm_modes:
        config = custom_config + f' --psm {psm}'
        text = pytesseract.image_to_string(img_np, config=config)
        if text.strip():
            text_results.append(text)
    
    # Return the longest result or empty string
    return max(text_results, key=len, default='').strip() if text_results else ''

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