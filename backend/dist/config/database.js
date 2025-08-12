"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDatabase = connectDatabase;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
async function connectDatabase() {
    try {
        await prisma.$connect();
        console.log('✅ Database connection established');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
}
//# sourceMappingURL=database.js.map