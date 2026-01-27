import mongoose, { Schema, model, models } from 'mongoose';

const QuestionSchema = new Schema({
    text: { type: String, required: true },
    type: {
        type: String,
        enum: ['multiple_choice', 'true_false', 'text'],
        default: 'multiple_choice'
    },
    options: [{ type: String }], // For MCQ
    correctAnswer: { type: String, required: true },

    // Categorization
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    skill: { type: String, required: true }, // The specific skill being tested
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },

    teacherId: { type: Schema.Types.ObjectId, ref: 'User' }, // Creator
    createdAt: { type: Date, default: Date.now },
});

const Question = models.Question || model('Question', QuestionSchema);

export default Question;
