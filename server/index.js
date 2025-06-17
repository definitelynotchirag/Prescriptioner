const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const calendarRoutes = require("./routes/calendarRoutes");
const authRoutes = require("./routes/auth");
const googleAuthRoutes = require("./routes/googleAuth");
// const priscriptionRoutes = require('./routes/prescriptionRoutes');
const llmRoutes = require("./routes/llmRoutes");
const medicinesRoutes = require("./routes/medications");
const rootuser = require("./routes/rootuser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.CORS_ORIGINS?.split(',') || ['https://your-domain.com']
        : ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use("/api/calendar", calendarRoutes);
app.use("/api/auth", googleAuthRoutes);
const userRoutes = require("./routes/rootuser");
const priscriptionRoutes = require("./routes/prescriptionRoutes");
app.use("/api/users", rootuser);
app.use("/api/users/:userId", priscriptionRoutes);
app.use("/api/rootuser", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/users/p", priscriptionRoutes);
app.use("/api/extractimg", llmRoutes);
app.use("/api/medicines", medicinesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
