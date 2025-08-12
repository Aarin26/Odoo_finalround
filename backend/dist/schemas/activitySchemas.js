"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activitySchemas = void 0;
const joi_1 = __importDefault(require("joi"));
exports.activitySchemas = {
    createActivity: joi_1.default.object({
        name: joi_1.default.string().min(1).max(100).required(),
        description: joi_1.default.string().max(500).optional(),
        type: joi_1.default.string().valid('SIGHTSEEING', 'FOOD', 'SHOPPING', 'ADVENTURE', 'CULTURE', 'RELAXATION', 'TRANSPORT', 'ACCOMMODATION').required(),
        cost: joi_1.default.number().positive().optional(),
        location: joi_1.default.string().max(200).optional(),
        startTime: joi_1.default.date().iso().optional(),
        endTime: joi_1.default.date().iso().optional(),
        tripId: joi_1.default.string().required()
    }),
    updateActivity: joi_1.default.object({
        name: joi_1.default.string().min(1).max(100).optional(),
        description: joi_1.default.string().max(500).optional(),
        type: joi_1.default.string().valid('SIGHTSEEING', 'FOOD', 'SHOPPING', 'ADVENTURE', 'CULTURE', 'RELAXATION', 'TRANSPORT', 'ACCOMMODATION').optional(),
        cost: joi_1.default.number().positive().optional(),
        location: joi_1.default.string().max(200).optional(),
        startTime: joi_1.default.date().iso().optional(),
        endTime: joi_1.default.date().iso().optional()
    }),
    getById: joi_1.default.object({
        id: joi_1.default.string().required()
    }),
    getByTripId: joi_1.default.object({
        tripId: joi_1.default.string().required()
    })
};
//# sourceMappingURL=activitySchemas.js.map