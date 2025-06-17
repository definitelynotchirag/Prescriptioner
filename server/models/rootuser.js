const mongoose = require("mongoose");

const rootUserSchema = new mongoose.Schema(
    {
        gmail: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: false, // Make phone optional for Google OAuth users
        },
        password: {
            type: String,
            required: true,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // Allow null values but enforce uniqueness when present
        },
        name: {
            type: String,
            required: false,
        },
        picture: {
            type: String,
            required: false,
        },
        calendarConnected: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const RootUser = mongoose.model("RootUser", rootUserSchema);

module.exports = RootUser;
