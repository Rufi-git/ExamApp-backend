const mongoose = require('mongoose');
const { Schema } = mongoose;

const resultSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    examId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Exam'
    },
    attempts: {
        type: Number,
        required: true,
        default: 1
    },
    earnPoints: {
        type: Number,
        required: true
    },
    isPassed: {
        type: Boolean,
        default: false,
        required: true
    },
    userAnswers: [
        {
            questionId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            selectedOptionIndex: {
                type: Number,
                default: null
            }
        }
    ]
},
    {
        timestamps: true,
        minimize: false,
    });

const ResultModel = mongoose.model('Result', resultSchema);

module.exports = ResultModel;