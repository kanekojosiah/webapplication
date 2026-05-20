const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

const authRoutes = require("./src/routes/authRoutes")
const mathRoutes = require("./src/routes/mathRoutes")

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(helmet())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

app.use(limiter)

app.use("/api/auth", authRoutes)
app.use("/api/math", mathRoutes)

app.get("/", (req, res) => {
  res.json({ message: "Backend Running" })
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})