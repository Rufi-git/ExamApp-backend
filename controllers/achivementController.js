const asyncHandler = require("express-async-handler")
const Achivement = require("../models/achivementModel")

const addAchivement = asyncHandler(async (req, res) => {
    const { title, about, photo } = req.body

    if (!title, !about, !photo) {
        res.status(400)
        throw new Error("All fields are required")
    }
    const achivement = await Achivement.create({
        title, about, photo
    })

    if (!achivement) {
        res.status(500)
        throw new Error("Couldn't add achivement")
    }

    res.status(200).json({ message: "Achivement successfully added!" })
})

const getAchivements = asyncHandler(async (req, res) => {
    const achivements = await Achivement.find({})

    if (!achivements) {
        res.status(404)
        throw new Error("Couldn't fetch any achivement")
    }

    res.status(200).json(achivements)
})

module.exports = {
    addAchivement,
    getAchivements
}