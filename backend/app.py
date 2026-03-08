import math
import psycopg2
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# -------------------------------
# PostgreSQL connection function
# -------------------------------
def get_db_connection():
    # Use the Neon string you just copied as the default value here
    url = os.environ.get("DATABASE_URL", "postgresql://neondb_owner:npg_brV79mtITdEZ@ep-soft-breeze-a1ozxrmx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")
    return psycopg2.connect(url)

# -------------------------------
# EXISTING CALCULATOR API (UNCHANGED)
# -------------------------------
@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json()
    expression = data.get("expression", "")

    try:
        # scientific replacements
        safe_expression = expression.replace("√", "math.sqrt")
        safe_expression = safe_expression.replace("^2", "**2")

        result = eval(safe_expression)

        # 🔹 SAVE TO DATABASE (NEW)
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO calculation_history (expression, result) VALUES (%s, %s)",
            (expression, str(result))
        )
        conn.commit()
        cur.close()
        conn.close()

    except Exception:
        result = "Error"

    return jsonify({"result": result})

# -------------------------------
# NEW: FETCH LAST 10 CALCULATIONS
# -------------------------------
@app.route("/history", methods=["GET"])
def get_history():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT expression, result, created_at
        FROM calculation_history
        ORDER BY created_at DESC
        LIMIT 10
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    history = []
    for row in rows:
        history.append({
            "expression": row[0],
            "result": row[1],
            "created_at": row[2]
        })

    return jsonify(history)

# -------------------------------
# RUN SERVER
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)