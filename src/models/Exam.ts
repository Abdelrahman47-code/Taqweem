import mongoose, { Schema, model, models } from 'mongoose';

const ExamSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    code: { type: String, unique: true }, // Short Exam Code

    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],

    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 0 }, // In minutes, 0 = unlimited
    createdAt: { type: Date, default: Date.now },
});

const Exam = models.Exam || model('Exam', ExamSchema);

export default Exam;
