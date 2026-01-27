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
    aiAnalysis: { type: String }, // Plain text or JSON string analysis
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    remedialPlan: { type: String }, // Markdown content for worksheet

    createdAt: { type: Date, default: Date.now },
});

const Result = models.Result || model('Result', ResultSchema);

export default Result;
