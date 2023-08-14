const express = require('express')
const { addAchivement, getAchivements } = require("../controllers/achivementController")
const { teacherOnly, protect } = require("../middleware/authMiddleware")
const router = express.Router()

// Achivement
router.post('/addAchivement', protect, teacherOnly, addAchivement)
router.get('/getAchivements', getAchivements)

module.exports = router
