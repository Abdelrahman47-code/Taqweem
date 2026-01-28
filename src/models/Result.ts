import mongoose, { Schema, model, models } from 'mongoose';

const ResultSchema = new Schema({
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },

    // Student Info (can be linked to User or just raw data if guest)
    studentName: { type: String, required: true },
    studentGrade: { type: String },
    studentId: { type: String }, // Now optional (Legacy or specific needs)
    studentEmail: { type: String, required: true }, // Primary Identifier

    // Comparison
    improvement: { type: Number }, // Improvement % or score diff from last exam

    answers: [{
        questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
        selectedAnswer: { type: String },
        isCorrect: { type: Boolean },
    }],

    totalScore: { type: Number, required: true },
    maxScore: { type: Number, required: true },

    // AI Analysis
    aiAnalysis: { type: String },
    classification: { type: String }, // 'Excellent', 'Very Good', 'Good', 'Acceptable', 'Weak'
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestedPlan: {
        type: { type: String, enum: ['remedial', 'enrichment'] },
        title: { type: String },
        content: { type: String }, // The main text
        exercises: [{
            text: { type: String },
            options: [{ type: String }],
            correctAnswer: { type: String }
        }]
    },

    createdAt: { type: Date, default: Date.now },
});

const Result = models.Result || model('Result', ResultSchema);

export default Result;
