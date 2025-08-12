"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripSchemas = void 0;
const joi_1 = __importDefault(require("joi"));
exports.tripSchemas = {
    createTrip: joi_1.default.object({
        name: joi_1.default.string().min(1).max(100).required(),
        description: joi_1.default.string().max(500).optional(),
        startDate: joi_1.default.date().iso().required(),
        endDate: joi_1.default.date().iso().min(joi_1.default.ref('startDate')).required(),
        budget: joi_1.default.number().positive().optional(),
        isPublic: joi_1.default.boolean().optional()
    }),
    updateTrip: joi_1.default.object({
        name: joi_1.default.string().min(1).max(100).optional(),
        description: joi_1.default.string().max(500).optional(),
        startDate: joi_1.default.date().iso().optional(),
        endDate: joi_1.default.date().iso().optional(),
        budget: joi_1.default.number().positive().optional(),
        isPublic: joi_1.default.boolean().optional()
    }),
    getTripById: joi_1.default.object({
        id: joi_1.default.string().required()
    }),
    exploreTrips: joi_1.default.object({
        country: joi_1.default.string().optional(),
        limit: joi_1.default.number().integer().min(1).max(50).optional(),
        page: joi_1.default.number().integer().min(1).optional()
    })
};
//# sourceMappingURL=tripSchemas.js.map