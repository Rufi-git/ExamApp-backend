const mongoose = require('mongoose');
const { Schema } = mongoose;

const examSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true
    },
    dedline: {
        type: Date
    },
    totalMarks: {
        type: Number,
        required: true
    },
    passingMarks: {
        type: Number,
        required: true
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    results: [{
        type: Schema.Types.ObjectId,
        ref: "Result"
    }]
},
    {
        timestamps: true,
        minimize: false,
    });

const ExamModel = mongoose.model('Exam', examSchema);

module.exports = ExamModel;
