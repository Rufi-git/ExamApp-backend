const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    options: [{
        text: {
            type: String,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            required: true,
            default: false
        }
    }],
    exam: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
        required: true
    },
},
    {
        timestamps: true,
        minimize: false,
    });

const QuestionModel = mongoose.model('Question', questionSchema);

module.exports = QuestionModel;
