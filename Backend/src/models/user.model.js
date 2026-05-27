import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        tokensUsed: {
            type: Number,
            default: 0,
        },
        tokenLimit: {
            type: Number,
            default: 5000,
        },
        lastTokenReset: {
            type: Date,
            default: Date.now,
        },
        plan: {
            type: String,
            enum: ["free", "pro"],
            default: "free",
        },
        profileCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.checkAndResetDailyTokens = function () {
    const now = new Date();
    const lastReset = new Date(this.lastTokenReset);
    const hoursSinceReset = (now - lastReset) / (1000 * 60 * 60);
    if (hoursSinceReset >= 24) {
        this.tokensUsed = 0;
        this.lastTokenReset = now;
    }
};

const userModel = mongoose.model('User', userSchema);

export default userModel;
