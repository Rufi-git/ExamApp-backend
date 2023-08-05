const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    exams: [{
        type: Schema.Types.ObjectId,
        ref: 'Exam'
    }]
},
    {
        timestamps: true,
        minimize: false,
    });

const TagModel = mongoose.model('Tag', tagSchema);

module.exports = TagModel;