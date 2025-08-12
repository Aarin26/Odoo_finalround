"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemas = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchemas = {
    updateProfile: joi_1.default.object({
        firstName: joi_1.default.string().min(1).max(50).optional(),
        lastName: joi_1.default.string().min(1).max(50).optional(),
        bio: joi_1.default.string().max(500).optional()
    }),
    getUserById: joi_1.default.object({
        id: joi_1.default.string().required()
    }),
    followUser: joi_1.default.object({
        id: joi_1.default.string().required()
    })
};
//# sourceMappingURL=userSchemas.js.map