# app.py
import os
from flask import Flask, request, jsonify, render_template, send_from_directory
from chatbot import analyze_image, process_text
from inventory import add_to_inventory, get_inventory

app = Flask(__name__, static_folder="static", template_folder="templates")
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload():
    # Expect multiple images with the form key "images"
    files = request.files.getlist("images")
    if not files:
        return jsonify({"response": "No image files provided."}), 400

    # Save each image
    image_paths = []
    image_names = []
    for file in files:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        image_paths.append(file_path)
        image_names.append(file.filename)

    # Analyze all images at once (one combined prompt/response)
    analysis_result = analyze_image(image_paths)

    # Store one record that contains all filenames & one combined diagnosis
    add_to_inventory(image_names, analysis_result)

    return jsonify({"response": analysis_result})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    if not message:
        return jsonify({"response": "No message received."}), 400

    result = process_text(message)
    return jsonify({"response": result})

@app.route("/inventory")
def show_inventory():
    """
    Display the inventory page showing each upload (with multiple images) on one row.
    """
    data = get_inventory()
    return render_template("inventory.html", data=data)

@app.route("/uploads/<path:filename>")
def serve_uploads(filename):
    """
    Serve uploaded images from the 'uploads' folder.
    """
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    app.run(debug=True, port=5002)
