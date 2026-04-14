import { Schema, model } from "mongoose";
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        index: true,
    },
    passwordHash: {
        type: String,
        required: true,
        select: false, // Don't return passwordHash by default
    },
    lastLoginAt: {
        type: Date,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
});
// Remove passwordHash from JSON output by default
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.passwordHash;
    return obj;
};
export const User = model("User", userSchema);
//# sourceMappingURL=User.js.map