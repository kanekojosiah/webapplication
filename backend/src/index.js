const express = require("express")
const cors = require("cors")
const rateLimit = require("express-rate-limit")

const mathRoutes = require("./routes/mathRoutes")

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: "Too many requests. Please try again later."
  }
})

app.use(limiter)

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    message: "AI Math Solver Backend is running."
  })
})

app.use("/api/math", mathRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})