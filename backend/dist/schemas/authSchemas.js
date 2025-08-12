"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchemas = void 0;
const joi_1 = __importDefault(require("joi"));
exports.authSchemas = {
    register: joi_1.default.object({
        firstName: joi_1.default.string().min(1).max(50).required(),
        lastName: joi_1.default.string().min(1).max(50).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required()
    }),
    login: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required()
    }),
    refreshToken: joi_1.default.object({
        refreshToken: joi_1.default.string().required()
    })
};
//# sourceMappingURL=authSchemas.js.map