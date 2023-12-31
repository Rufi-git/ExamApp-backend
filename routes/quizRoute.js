const express = require('express')
const { protect, adminOnly, teacherOnly, verifiedOnly } = require('../middleware/authMiddleware')
const { addExam, getExamsByTag, addTag, getTags, addQuestion, deleteExam, editQuestion, deleteQuestion, getQuestionsByExam, getExam, getTag, editExam, editTag, addResult, getResultsByUser, getResultsByUserByExam, addExamToUser, getExamsByUser, reviewByResult, deleteMyExam, addExamToUserById, getExams } = require('../controllers/quizController')
const router = express.Router()

router.post("/addTag", protect, teacherOnly, addTag)
router.get("/getTags", getTags)
router.post("/addExam", protect, teacherOnly, addExam)
router.get("/getExamsByTag/:tagId", getExamsByTag)
router.post("/addQuestion/:examId", protect, teacherOnly, addQuestion)
router.patch("/editQuestion/:questionId", protect, teacherOnly, editQuestion)
router.delete("/deleteQuestion/:questionId", protect, teacherOnly, deleteQuestion)
router.get("/getQuestionsByExam/:examId", protect, getQuestionsByExam)
router.get("/getExam/:id", getExam)
router.get("/getTag/:id", getTag)
router.patch("/editExam/:examId", protect, teacherOnly, editExam)
router.delete("/deleteExam/:examId", protect, teacherOnly, deleteExam)
router.patch("/editTag/:tagId", protect, teacherOnly, editTag)
router.post("/addResult/:examId", protect, verifiedOnly, addResult)
router.get("/getResultsByUser", protect, verifiedOnly, getResultsByUser)
router.get("/getResultsByUserByExam/:examId", protect, verifiedOnly, getResultsByUserByExam)
router.post("/addExamToUser/:examId", protect, verifiedOnly, addExamToUser)
router.post("/addExamToUserById/:userId", protect, teacherOnly, addExamToUserById)
router.get("/getExamsByUser", protect, verifiedOnly, getExamsByUser)
router.get("/getExams", protect, teacherOnly, getExams)
router.get("/reviewByResult/:resultId", protect, verifiedOnly, reviewByResult)
router.delete("/deleteMyExam/:examId", protect, verifiedOnly, deleteMyExam)

module.exports = router