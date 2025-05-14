import os
import cv2
import numpy as np
import easyocr
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

# 🧠 Load Hugging Face model
model_name = "google/flan-t5-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
generator = pipeline("text2text-generation", model=model, tokenizer=tokenizer)

# 📖 EasyOCR setup
reader = easyocr.Reader(['en'])

# ⚙️ Flask Setup
app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp'}
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ✅ Helpers
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Resize (Upscale)
    upscale = cv2.resize(gray, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_LINEAR)

    # Denoising
    denoised = cv2.fastNlMeansDenoising(upscale, h=10)

    # CLAHE (Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    enhanced = clahe.apply(denoised)

    # Sharpening
    kernel = np.array([[0, -1, 0], [-1, 5,-1], [0, -1, 0]])
    sharpened = cv2.filter2D(enhanced, -1, kernel)

    # Gaussian Blur
    blurred = cv2.GaussianBlur(sharpened, (5, 5), 0)

    # Edge Detection
    canny = cv2.Canny(blurred, 100, 200)

    # Thresholding
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 11, 2
    )

    # Save all intermediate images
    base, ext = os.path.splitext(image_path)
    paths = {
        'gray': f'{base}_gray{ext}',
        'upscale': f'{base}_upscale{ext}',
        'denoise': f'{base}_denoise{ext}',
        'clahe': f'{base}_clahe{ext}',
        'sharpen': f'{base}_sharpen{ext}',
        'blur': f'{base}_blur{ext}',
        'edge': f'{base}_edge{ext}',
        'thresh': f'{base}_thresh{ext}'
    }

    cv2.imwrite(paths['gray'], gray)
    cv2.imwrite(paths['upscale'], upscale)
    cv2.imwrite(paths['denoise'], denoised)
    cv2.imwrite(paths['clahe'], enhanced)
    cv2.imwrite(paths['sharpen'], sharpened)
    cv2.imwrite(paths['blur'], blurred)
    cv2.imwrite(paths['edge'], canny)
    cv2.imwrite(paths['thresh'], thresh)

    return paths, img.shape, thresh

def extract_text_from_image(img_np):
    results = reader.readtext(img_np)
    return " ".join([text for _, text, _ in results])

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

    files = request.files.getlist('file')
    if not files or files[0].filename == '':
        return render_template('index.html', error='No selected file')
    
    results = []
    
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            try:
                processed_paths, dimensions, thresh_img = preprocess_image(filepath)
                raw_text = extract_text_from_image(thresh_img)
                refined_text = refine_text_with_ai(raw_text)
                
                results.append({
                    'filename': filename,
                    'raw_text': raw_text,
                    'refined_text': refined_text,
                    'original_image': filepath,
                    'preprocessed_image': processed_paths,
                    'width': dimensions[1],
                    'height': dimensions[0]
                })
            except Exception as e:
                return render_template('index.html', error=f'Error processing {filename}: {str(e)}')
        else:
            return render_template('index.html', error=f'Invalid file format: {file.filename}')

    return render_template('result.html', results=results)

@app.route('/api/upload', methods=['POST'])
def api_upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    files = request.files.getlist('file')
    if not files or files[0].filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    results = []
    
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            try:
                processed_paths, dimensions, thresh_img = preprocess_image(filepath)
                raw_text = extract_text_from_image(thresh_img)
                refined_text = refine_text_with_ai(raw_text)

                processed_urls = {k: '/uploads/' + os.path.basename(v) for k, v in processed_paths.items()}

                results.append({
                    'filename': filename,
                    'raw_text': raw_text,
                    'refined_text': refined_text,
                    'original_image': '/uploads/' + filename,
                    'processed_images': processed_urls,
                    'dimensions': {'width': dimensions[1], 'height': dimensions[0]}
                })
            except Exception as e:
                return jsonify({'error': f'Error processing {filename}: {str(e)}'}), 500
        else:
            return jsonify({'error': f'Invalid file format: {file.filename}'}), 400

    return jsonify({'results': results})

if __name__ == '__main__':
    app.run(debug=True)
