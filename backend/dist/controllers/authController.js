"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
exports.authController = {
    async register(req, res) {
        try {
            const { firstName, lastName, email, password } = req.body;
            const existingUser = await database_1.prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                return res.status(400).json({
                    error: {
                        message: 'User with this email already exists'
                    }
                });
            }
            const saltRounds = 10;
            const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
            const user = await database_1.prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role: 'USER'
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            });
            const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '24h' });
            return res.status(201).json({
                data: {
                    user,
                    token
                }
            });
        }
        catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({
                error: {
                    message: 'Internal server error'
                }
            });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await database_1.prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                return res.status(401).json({
                    error: {
                        message: 'Invalid email or password'
                    }
                });
            }
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    error: {
                        message: 'Invalid email or password'
                    }
                });
            }
            const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '24h' });
            const userData = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            };
            return res.status(200).json({
                data: {
                    user: userData,
                    token
                }
            });
        }
        catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({
                error: {
                    message: 'Internal server error'
                }
            });
        }
    },
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({
                    error: {
                        message: 'Refresh token is required'
                    }
                });
            }
            const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
            const decoded = jsonwebtoken_1.default.verify(refreshToken, jwtSecret);
            const user = await database_1.prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            });
            if (!user) {
                return res.status(401).json({
                    error: {
                        message: 'Invalid refresh token'
                    }
                });
            }
            const newToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '24h' });
            return res.status(200).json({
                data: {
                    user,
                    token: newToken
                }
            });
        }
        catch (error) {
            console.error('Token refresh error:', error);
            return res.status(401).json({
                error: {
                    message: 'Invalid refresh token'
                }
            });
        }
    }
};
//# sourceMappingURL=authController.js.map