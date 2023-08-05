const asyncHandler = require("express-async-handler")
const Exam = require("../models/examModel")
const Tag = require("../models/tagModel")
const Question = require("../models/questionModel")
const Result = require("../models/resultModel")
const User = require("../models/userModel")
const mongoose = require("mongoose");

// Add Tag
const addTag = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(500)
        throw new Error("Name field required")
    }

    const exists = await Tag.findOne({ name })

    if (exists) {
        res.status(500)
        throw new Error("Tag with this name already exists")
    }

    await Tag.create({ name })
    res.status(200).json({ name })
})

// Get Tags
const getTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find().populate("exams")

    if (!tags) {
        res.status(404)
        throw new Error("No tags found")
    }

    res.status(200).json(tags)
})

// Get Tags
const getTag = asyncHandler(async (req, res) => {
    const { id } = req.params
    const tag = await Tag.findById(id)

    if (!tag) {
        res.status(404)
        throw new Error("No tag found")
    }

    res.status(200).json(tag)
})

// Add Exam
const addExam = asyncHandler(async (req, res) => {
    const { name, duration, dedline, totalMarks, passingMarks, tags } = req.body

    if (!name || !duration || !totalMarks || !passingMarks || !tags) {
        res.status(500)
        throw new Error("All fields are required")
    }

    const examExists = await Exam.findOne({ name })

    if (examExists) {
        res.status(500)
        throw new Error("Exam with this name already exists")
    }
    const tagIds = tags.map(tag => new mongoose.Types.ObjectId(tag.id));


    const newExam = await Exam.create({
        name, duration, dedline,
        totalMarks, passingMarks,
        tags: tagIds
    })

    for (const tagId of tagIds) {
        const tag = await Tag.findById(tagId);
        if (tag) {
            tag.exams.push(newExam._id);
            await tag.save();
        }
    }

    res.status(200).json({ name, duration, totalMarks, passingMarks, tags })
})

const getExamsByTag = asyncHandler(async (req, res) => {
    const { tagId } = req.params;
    if (!tagId) {
        res.status(404)
        throw new Error("Tag is not defined")
    }

    const exists = await Tag.findById(tagId)

    if (!exists) {
        res.status(404)
        throw new Error("No tag Found")
    }

    const objectId = new mongoose.Types.ObjectId(tagId);

    const exams = await Exam.find({ tags: objectId }).populate("tags")

    if (!exams) {
        res.status(500)
        throw new Error("No Exams Added yet")
    }

    res.status(200).json(exams)
})

const getExam = asyncHandler(async (req, res) => {
    const { id } = req.params

    const exam = await Exam.findById(id).populate("tags")

    if (!exam) {
        res.status(404)
        throw new Error("No exams found")
    }

    res.status(200).json(exam)
})

const addQuestion = asyncHandler(async (req, res) => {
    const { examId } = req.params
    const { name, options } = req.body

    if (!name || !options || !examId) {
        res.status(500)
        throw new Error("All fields are required")
    }

    const exam = new mongoose.Types.ObjectId(examId)

    const newQuestion = await Question.create({
        name, options, exam
    })

    const examExists = await Exam.findById(examId);
    if (examExists) {
        examExists.questions.push(newQuestion._id);
        await examExists.save();
    }

    res.status(200).json({ name, options, exam })
})

const addResult = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    const { attempts, earnPoints, isPassed, userAnswers } = req.body
    const { examId } = req.params


    if (!user) {
        res.status(404)
        throw new Error('User not found!')
    }

    if (!examId) {
        res.status(404)
        throw new Error("No Exam found")
    }

    const newResult = await Result.create({
        userId: user._id, examId, attempts, earnPoints, isPassed, userAnswers
    })

    if (!newResult) {
        res.status(500);
        throw new Error("Result couldn't be saved");
    }

    const exam = await Exam.findById(examId)

    if (!exam) {
        res.status(404)
        throw new Error("No Exam found")
    }

    exam.results.push(newResult._id);
    await exam.save();

    user.results.push(newResult._id)
    await user.save();

    if (newResult) {
        res.status(200).json({ message: "Result has been saved" })
    } else {
        res.status(500)
        throw new Error("Result couldn't be saved")
    }
})

const getResultsByUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }

    const results = await Result.find({ userId: user._id }).populate("examId")

    if (!results) {
        res.status(404)
        throw new Error("No results found")
    }

    res.status(200).json(results)
})

const getResultsByUserByExam = asyncHandler(async (req, res) => {
    const { examId } = req.params
    const exam = await Exam.findById(examId)

    if (!exam) {
        res.status(404)
        throw new Error("No Exam Found!")
    }
    const user = await User.findById(req.user._id)

    if (!user) {
        res.status(404)
        throw new Error("User not found!")
    }

    const results = await Result.find({ userId: user._id, examId }).populate("examId").populate("userId")

    if (!results) {
        res.status(404)
        throw new Error("No results found!")
    }

    res.status(200).json(results)
})

const reviewByResult = asyncHandler(async (req, res) => {
    const { resultId } = req.params

    const user = await User.findById(req.user._id)
    const result = await Result.findById(resultId).populate({
        path: 'examId',
        populate: {
            path: 'questions'
        }
    })

    if (!result) {
        res.status(404)
        throw new Error("No Result Found!")
    }
    if (!user) {
        res.status(404)
        throw new Error("User not found!")
    }

    res.status(200).json(result)
})

const editQuestion = asyncHandler(async (req, res) => {
    const { questionId, name, options, exam } = req.body
    const questionExists = await Question.findById(questionId);
    const examId = new mongoose.Types.ObjectId(exam);
    const examExists = await Exam.findById(examId)

    if (questionExists) {
        if (!examExists) {
            res.status(404)
            throw new Error('Exam not found!')
        }
        await Question.findByIdAndUpdate(questionId, { name, options, exam: examId })

        res.status(200).json({
            message: "Question updated successfully"
        })
    } else {
        res.status(404)
        throw new Error('Question not found!')
    }
})

const editExam = asyncHandler(async (req, res) => {
    const { examId } = req.params
    const { name, duration, totalMarks, passingMarks, tags } = req.body
    const examExists = await Exam.findById(examId);
    const tagIds = tags.map(tagId => new mongoose.Types.ObjectId(tagId));
    if (examExists) {
        await Exam.findByIdAndUpdate(examId, { examId, name, duration, totalMarks, passingMarks, tags: tagIds })

        res.status(200).json({
            message: "Exam updated successfully"
        })
    } else {
        res.status(404)
        throw new Error('Exam not found!')
    }
})

const editTag = asyncHandler(async (req, res) => {
    const { tagId } = req.params
    const { name } = req.body
    const tagExists = await Tag.findById(tagId);
    if (tagExists) {
        await Tag.findByIdAndUpdate(tagId, { name })

        res.status(200).json({
            message: "Tag updated successfully"
        })
    } else {
        res.status(404)
        throw new Error('Tag not found!')
    }
})

const deleteQuestion = asyncHandler(async (req, res) => {
    const { id } = req.body

    const question = await Question.findById(id)
    if (!question) {
        res.status(404)
        throw new Error('Question not found!')
    }
    const exam = await Exam.findOne({ questions: question._id })

    if (exam) {
        exam.questions.remove(question._id);
        await exam.save();
    } else {
        res.status(404)
        throw new Error('Exam not found!')
    }

    await question.deleteOne()
    res.status(200).json("Question deleted succesfully")
})

const deleteExam = asyncHandler(async (req, res) => {
    const { examId } = req.params

    const exam = await Exam.findById(examId)
    if (!exam) {
        res.status(404)
        throw new Error('Exam not found!')
    }
    const questions = await Question.find({ exam: exam._id })

    if (questions && questions.length > 0) {
        for (const question of questions) {
            await question.deleteOne();
        }
    }

    await exam.deleteOne()
    res.status(200).json({ message: "Exam deleted succesfully" })
})

const deleteMyExam = asyncHandler(async (req, res) => {
    const { examId } = req.params
    const user = await User.findById(req.user._id)

    if (!user) {
        res.status(404)
        throw new Error('User not found!')
    }

    const exam = await Exam.findById(examId)
    if (!exam) {
        res.status(404)
        throw new Error('Exam not found!')
    }

    user.exams.pull(examId);
    await user.save();

    exam.users.pull(user._id);
    await exam.save();

    res.status(200).json({ message: "My Exam deleted succesfully" })
})

const getQuestionsByExam = asyncHandler(async (req, res) => {
    const { examId } = req.params;

    if (!examId) {
        res.status(404)
        throw new Error('Exam is not defined!')
    }
    const exam = await Exam.findById(examId)

    if (!exam) {
        res.status(404)
        throw new Error('Exam not found!')
    }

    const questions = await Question.find({ exam: examId })

    if (!questions) {
        res.status(500)
        throw new Error("No Questions Added yet")
    }

    res.status(200).json(questions)
})

const addExamToUser = asyncHandler(async (req, res) => {
    const { examId } = req.params
    const user = await User.findById(req.user._id)

    if (!user) {
        res.status(404)
        throw new Error('User not found!')
    }
    if (!examId) {
        res.status(404)
        throw new Error("No Exam found")
    }

    const isExamExist = user.exams.includes(examId);

    const exam = await Exam.findById(examId)

    if (!exam) {
        res.status(404)
        throw new Error("No Exam found")
    }

    if (isExamExist) {
        res.status(500)
        throw new Error("Exam has already been added!")
    } else {
        user.exams.push(examId);
        await user.save()

        exam.users.push(user._id)
        await exam.save()

        res.status(200).json(exam)
    }
})

const getExamsByUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("exams")

    if (!user) {
        res.status(404)
        throw new Error('User not found!')
    }

    if (user.exams.length > 0) {
        res.status(200).json(user.exams)
    } else {
        res.status(200).json([]);
    }
})

module.exports = {
    addExam,
    getExamsByTag,
    addTag,
    getTags,
    addQuestion,
    getQuestionsByExam,
    editQuestion,
    deleteQuestion,
    getExam,
    getTag,
    editExam,
    deleteExam,
    editTag,
    addResult,
    getResultsByUser,
    getResultsByUserByExam,
    addExamToUser,
    getExamsByUser,
    reviewByResult,
    deleteMyExam
}