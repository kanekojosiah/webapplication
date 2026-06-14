# API Documentation

## Base URL

```
http://localhost:5000/api/math
```

---

## 1. Solve Mathematical Problem

Converts natural language or mathematical expressions into a solution and returns an explanation.

### Endpoint

```http
POST /solve
```

### Request Body

```json
{
    "equation": "What is two plus two?"
}
```

### Example Request

```json
{
    "equation": "x^2 - 9 = 0"
}
```

### Example Response

```json
{
    "result": "[-3, 3]",
    "steps": [
        "AI Interpretation: x**2 - 9",
        "The equation x² - 9 = 0 can be solved by finding the values of x that satisfy the equation."
    ]
}
```

### Possible Error Response

```json
{
    "error": "Invalid mathematical expression",
    "result": "Error",
    "steps": [
        "Unable to process the input."
    ]
}
```

---

## 2. Generate Practice Question

Generates a random mathematics practice question for the user.

### Endpoint

```http
POST /generate
```

### Request Body

```json
{
    "difficulty": "easy"
}
```

### Example Response

```json
{
    "question": "Solve: x^2 - 9 = 0"
}
```

---

# Technologies Used

- Express.js
- Flask
- SymPy
- Ollama (Phi-3)

# Notes

- The `/solve` endpoint supports both mathematical expressions and natural language input.
- AI explanations are generated using Ollama with the Phi-3 model.
- The application includes input validation, sanitization, activity logging, and rate limiting for security purposes.
