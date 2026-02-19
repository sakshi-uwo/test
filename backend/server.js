import 'dotenv/config';
import dns from 'dns';

// Force DNS to use Google's servers to resolve MongoDB SRV records
// This fixes the ECONNREFUSED error common on some ISPs like Reliance Jio
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import leadRoutes from "./routes/leadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import milestoneRoutes from "./routes/milestoneRoutes.js";
import siteVisitRoutes from "./routes/siteVisitRoutes.js";
import redirectRoutes from "./routes/redirectRoutes.js";
import siteOperationsRoutes from './routes/siteOperationsRoutes.js';


const app = express();
const server = http.createServer(app);

/* -------------------- MIDDLEWARES -------------------- */
app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);

/* -------------------- MONGODB -------------------- */
mongoose
    .connect(process.env.MONGODB_ATLAS_URI)
    .then(() => console.log("✅ MongoDB Atlas connected"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

/* -------------------- SOCKET.IO -------------------- */
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PATCH"],
    },
});

io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // Join role-based room
    socket.on("joinRole", (role) => {
        if (role) {
            socket.join(role);
            console.log(`🔐 Socket ${socket.id} joined role: ${role}`);
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
    });
});

/* -------------------- MAKE IO AVAILABLE TO ROUTES -------------------- */
app.set("io", io);

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/signup", userRoutes); // Signup route

app.use("/api/lead", leadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/site-visits", siteVisitRoutes);
app.use("/api/redirect", redirectRoutes);
app.use("/api/site-ops", siteOperationsRoutes);


/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
    res.send("Builder OS Backend is running 🚀");
});

/* -------------------- START SERVER -------------------- */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
