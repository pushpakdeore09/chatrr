from flask import Blueprint, request, jsonify
from .model import load_model

main = Blueprint('main', __name__)
model, vectorizer, svd = load_model()

@main.route("/check-message", methods=["POST"])
def check_message():
    data = request.get_json()
    message = data.get("message", "")

    if not message.strip():
        return jsonify({"error": "Empty message"}), 400
    
    vec = vectorizer.transform([message])
    reduced = svd.transform(vec)
    prob = model.predict(reduced)

    is_toxic = bool(prob >= 0.8)
    return jsonify({"toxic": is_toxic})