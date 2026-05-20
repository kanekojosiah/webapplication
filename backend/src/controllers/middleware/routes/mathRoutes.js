const express = require("express")
const axios = require("axios")

const router = express.Router()

router.post("/solve", async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/solve",
      {
        equation: req.body.equation
      }
    )

    res.json(response.data)
  } catch (error) {
    res.status(500).json({
      error: "AI solver failed"
    })
  }
})

router.post("/generate", async (req, res) => {
  const difficulty = req.body.difficulty

  let question = ""

  if (difficulty === "easy") {
    question = "Solve: x^2 - 5x + 6 = 0"
  } else if (difficulty === "medium") {
    question = "Integrate: x^2 + 4x"
  } else {
    question = "Differentiate: sin(x) * cos(x)"
  }

  res.json({
    question
  })
})

module.exports = router