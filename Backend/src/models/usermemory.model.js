import mongoose from 'mongoose';

const userMemorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        preferences: {
            fullName: { type: String, default: '' },
            profession: { type: String, default: '' },
            location: { type: String, default: '' },
            language: {
                type: String,
                enum: ['english', 'hindi', 'hinglish'],
                default: 'english',
            },
            responseStyle: {
                type: String,
                enum: ['concise', 'detailed', 'friendly'],
                default: 'friendly',
            },
            interests: [{ type: String }],
        },
        facts: [
            {
                key: { type: String, required: true },
                value: { type: String, required: true },
                updatedAt: { type: Date, default: Date.now },
            }
        ],
        lastExtractedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

userMemorySchema.methods.toPromptString = function () {
    const p = this.preferences;
    const lines = [];

    if (p.fullName)   lines.push(`User's name: ${p.fullName}`);
    if (p.profession) lines.push(`Profession: ${p.profession}`);
    if (p.location)   lines.push(`Location: ${p.location}`);
    if (p.language)   lines.push(`Preferred language: ${p.language}`);
    if (p.responseStyle) lines.push(`Preferred response style: ${p.responseStyle}`);
    if (p.interests?.length) lines.push(`Interests: ${p.interests.join(', ')}`);

    this.facts.forEach(f => lines.push(`${f.key}: ${f.value}`));

    return lines.join('\n');
};

const userMemoryModel = mongoose.model('UserMemory', userMemorySchema);
export default userMemoryModel;