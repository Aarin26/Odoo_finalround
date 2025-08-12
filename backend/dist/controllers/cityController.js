"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cityController = void 0;
const database_1 = require("../config/database");
exports.cityController = {
    async getAllCities(req, res) {
        try {
            const { country, category, minCost, maxCost, search } = req.query;
            const where = {};
            if (country) {
                where.country = { contains: String(country), mode: 'insensitive' };
            }
            if (category) {
                where.category = { contains: String(category), mode: 'insensitive' };
            }
            if (minCost || maxCost) {
                where.avgCost = {};
                if (minCost)
                    where.avgCost.gte = Number(minCost);
                if (maxCost)
                    where.avgCost.lte = Number(maxCost);
            }
            if (search) {
                where.OR = [
                    { name: { contains: String(search), mode: 'insensitive' } },
                    { country: { contains: String(search), mode: 'insensitive' } },
                    { description: { contains: String(search), mode: 'insensitive' } }
                ];
            }
            const cities = await database_1.prisma.city.findMany({
                where,
                orderBy: { name: 'asc' }
            });
            return res.json({
                success: true,
                data: cities
            });
        }
        catch (error) {
            console.error('Get cities error:', error);
            return res.status(500).json({
                success: false,
                error: { message: 'Failed to get cities' }
            });
        }
    },
    async getCityById(req, res) {
        try {
            const { id } = req.params;
            const city = await database_1.prisma.city.findUnique({
                where: { id },
                include: {
                    stops: {
                        include: {
                            trip: {
                                select: {
                                    id: true,
                                    name: true,
                                    isPublic: true
                                }
                            }
                        }
                    }
                }
            });
            if (!city) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'City not found' }
                });
            }
            return res.json({
                success: true,
                data: city
            });
        }
        catch (error) {
            console.error('Get city error:', error);
            return res.status(500).json({
                success: false,
                error: { message: 'Failed to get city' }
            });
        }
    }
};
//# sourceMappingURL=cityController.js.map