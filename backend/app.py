"""
Educational UI demo backend (Flask).
Demo-only: no credential capture, no credential storage, no password handling.
Provides demo news and anonymous counters only.
"""

import os
import logging
from datetime import datetime
from flask import Flask, jsonify, render_template

app = Flask(__name__, template_folder=os.path.join(os.path.dirname(__file__), "templates"))
app.secret_key = os.environ.get("SECRET_KEY", "demo-only-change-me")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.route("/")
def index():
    return render_template("home.html", demo=True, now=datetime.utcnow().isoformat())


@app.route("/api/news", methods=["GET"])
def api_news():
    return jsonify({
        "demo": True,
        "news": [
            {"id": 1, "title": "Demo zpráva 1", "summary": "Ukázkový obsah bez externích dat.", "date": "2026-09-15"},
            {"id": 2, "title": "Demo zpráva 2", "summary": "Ukázkový obsah bez externích dat.", "date": "2026-09-14"},
            {"id": 3, "title": "Demo zpráva 3", "summary": "Ukázkový obsah bez externích dat.", "date": "2026-09-13"},
        ],
    })


@app.route("/api/track", methods=["POST"])
def api_track():
    # Intentionally stateless demo endpoint.
    return ("", 204)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "demo": True})


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Stránka nebyla nalezena", "demo": True}), 404


if __name__ == "__main__":
    logger.info("Starting educational demo backend...")
    app.run(host="127.0.0.1", port=5000, debug=False)
