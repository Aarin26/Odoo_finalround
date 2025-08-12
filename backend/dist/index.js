"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 5000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'GlobeTrotter API is running' });
});
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});
app.get('/api/db-test', async (req, res) => {
    try {
        await prisma.$connect();
        res.json({ message: 'Database connected successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});
async function startServer() {
    try {
        await prisma.$connect();
        console.log('✅ Database connection established');
        app.listen(PORT, () => {
            console.log('🚀 Server running on port', PORT);
            console.log('📱 Frontend: http://localhost:3000');
            console.log('🔌 API: http://localhost:5000/api');
            console.log('🌍 Environment: development');
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=index.js.map