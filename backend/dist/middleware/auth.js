"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                error: { message: 'Access token required' }
            });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = await database_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true
            }
        });
        if (!user) {
            res.status(401).json({
                success: false,
                error: { message: 'Invalid token' }
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({
            success: false,
            error: { message: 'Invalid token' }
        });
        return;
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: { message: 'Authentication required' }
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: { message: 'Insufficient permissions' }
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map