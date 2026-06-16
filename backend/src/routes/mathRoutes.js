const express = require("express")

const router = express.Router()

router.post("/solve", async (req, res) => {
  try {
    const equation = req.body.equation || ""

    res.json({
      result: "AI demo available in local environment",
      steps: [
        `Question received: ${equation}`,
        "The complete AI solver using Flask and Ollama is demonstrated in the presentation video.",
        "The deployed version showcases the application's interface, architecture, and supporting features."
      ]
    })

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: "Failed to process request",
      result: "Error",
      steps: ["An unexpected error occurred."]
    })
  }
})

router.post("/generate", async (req, res) => {

  const type = req.body.type || "random"

  const questions = {

    algebra: [
      "Solve: x^2 - 9 = 0",
      "Find x: 2*x + 5 = 15",
      "Solve: x^2 + 4x + 4 = 0",
      "Find x: 3*x - 12 = 0"
    ],

    arithmetic: [
      "What is 25 × 4?",
      "What is 144 ÷ 12?",
      "What is 18 + 27?",
      "What is 50 - 17?"
    ],

    wordProblem: [
      "A basket contains 8 apples and 5 more are added. How many apples are there?",
      "A train travels 60 km in one hour. How far in 3 hours?",
      "John has 12 candies and gives away 4. How many remain?",
      "There are 7 birds on a tree and 3 more arrive. How many birds are there?"
    ]
  }

  let selectedQuestions

  if (type === "random") {

    const allQuestions = [
      ...questions.algebra,
      ...questions.arithmetic,
      ...questions.wordProblem
    ]

    selectedQuestions = allQuestions

  } else {

    selectedQuestions = questions[type] || questions.algebra

  }

  const randomQuestion =
    selectedQuestions[
      Math.floor(Math.random() * selectedQuestions.length)
    ]

  res.json({
    question: randomQuestion
  })
})

module.exports = router