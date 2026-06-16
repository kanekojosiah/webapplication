from flask import Flask, request, jsonify
from sympy import symbols, solve, sympify, simplify
from datetime import datetime
import ollama

app = Flask(__name__)
print("APP.PY LOADED")


def log_request(question, status):
    with open("activity.log", "a", encoding="utf-8") as f:
        f.write(
            f"{datetime.now()} | {status} | {question}\n"
        )


@app.route("/")
def home():
    return "Python AI Service Running"


@app.route("/solve", methods=["POST"])
def solve_math():

    data = request.json
    user_input = data["equation"]

    # Input Validation
    if not user_input.strip():
        return jsonify({
            "result": "Error",
            "steps": ["Input cannot be empty."]
        })

    if len(user_input) > 500:
        return jsonify({
            "result": "Error",
            "steps": ["Input is too long."]
        })

    blocked_words = [
        "ignore previous instructions",
        "system prompt",
        "<script",
        "</script>"
    ]

    for word in blocked_words:
        if word.lower() in user_input.lower():
            log_request(user_input, "BLOCKED")

            return jsonify({
                "result": "Error",
                "steps": ["Invalid input detected."]
            })

    x = symbols("x")

    try:

        # Convert natural language into math
        convert_response = ollama.chat(
            model="phi3",
            messages=[
                {
                    "role": "system",
                    "content": """
Convert the user's math question into a valid mathematical expression.

Examples:

what is two plus two
2+2

three apples plus five apples
3+5

solve x squared minus 5x plus 6
x**2 - 5*x + 6

Return ONLY the expression.
"""
                },
                {
                    "role": "user",
                    "content": user_input
                }
            ]
        )

        expression = (
            convert_response["message"]["content"]
            .strip()
            .split("\n")[0]
        )

        if "=" in expression:
            expression = expression.split("=")[0].strip()

        expression = expression.replace("\\(", "")
        expression = expression.replace("\\)", "")
        expression = expression.replace("^", "**")

        expr = sympify(expression)

        if expr.has(x):
            result = solve(expr, x)
        else:
            result = simplify(expr)

        # Ask Ollama to explain the answer
        explanation_response = ollama.chat(
            model="phi3",
            messages=[
                {
                    "role": "system",
                    "content":
                    "You are a math tutor. Explain the answer simply and clearly."
                },
                {
                    "role": "user",
                    "content":
                    f"""
Question: {user_input}

Math expression: {expression}

Answer: {result}

Explain the answer.
"""
                }
            ]
        )

        explanation = explanation_response["message"]["content"]

        log_request(user_input, "SUCCESS")

        return jsonify({
            "result": str(result),
            "steps": [
                f"AI Interpretation: {expression}",
                explanation
            ]
        })

    except Exception as e:

        log_request(user_input, "FAILED")

        return jsonify({
            "error": str(e),
            "result": "Error",
            "steps": [str(e)]
        })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)