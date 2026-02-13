import { io } from "socket.io-client";
import { API_BASE_URL } from "../config/api";

const SOCKET_URL = API_BASE_URL.replace('/api', '');

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        if (this.socket) return;

        this.socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
        });

        this.socket.on("connect", () => {
            console.log("[SOCKET] Connected to real-time server");
        });

        this.socket.on("connect_error", (error) => {
            console.error("[SOCKET] Connection error:", error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    on(event, callback) {
        if (!this.socket) this.connect();
        this.socket.on(event, callback);
    }

    off(event) {
        if (this.socket) {
            this.socket.off(event);
        }
    }

    emit(event, data) {
        if (!this.socket) this.connect();
        this.socket.emit(event, data);
    }
}

const socketService = new SocketService();
export default socketService;
