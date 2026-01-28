import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // Required for teachers
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['teacher', 'student', 'admin'],
        default: 'teacher'
    },
    school: { type: String },
    grade: { type: String }, // For students
    defaultDuration: { type: Number, default: 30 },
    defaultGrade: { type: String },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const User = models.User || model('User', UserSchema);

export default User;
