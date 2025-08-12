"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripController = void 0;
const database_1 = require("../config/database");
exports.tripController = {
    async getUserTrips(req, res) {
        try {
            const userId = req.user.id;
            const trips = await database_1.prisma.trip.findMany({
                where: { userId },
                include: {
                    stops: {
                        orderBy: { order: 'asc' }
                    },
                    activities: true,
                    _count: {
                        select: {
                            stops: true,
                            activities: true,
                            likes: true,
                            comments: true
                        }
                    }
                },
                orderBy: { startDate: 'desc' }
            });
            return res.json({
                success: true,
                data: trips
            });
        }
        catch (error) {
            console.error('Get user trips error:', error);
            return res.status(500).json({
                success: false,
                error: { message: 'Failed to get trips' }
            });
        }
    },
    async createTrip(req, res) {
        try {
            const userId = req.user.id;
            const { name, description, startDate, endDate, budget, isPublic } = req.body;
            const trip = await database_1.prisma.trip.create({
                data: {
                    name,
                    description,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    budget,
                    isPublic: isPublic || false,
                    userId
                },
                include: {
                    stops: true,
                    activities: true,
                    _count: {
                        select: {
                            stops: true,
                            activities: true,
                            likes: true,
                            comments: true
                        }
                    }
                }
            });
            return res.status(201).json({
                success: true,
                data: trip
            });
        }
        catch (error) {
            console.error('Create trip error:', error);
            return res.status(500).json({
                success: false,
                error: { message: 'Failed to create trip' }
            });
        }
    },
    async getTripById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const trip = await database_1.prisma.trip.findFirst({
                where: {
                    id,
                    OR: [
                        { userId },
                        { isPublic: true }
                    ]
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    stops: {
                        orderBy: { order: 'asc' }
                    },
                    _count: {
                        select: {
                            stops: true,
                            activities: true,
                            likes: true,
                            comments: true
                        }
                    }
                }
            });
            if (!trip) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Trip not found' }
                });
            }
            return res.json({
                success: true,
                data: trip
            });
        }
        catch (error) {
            console.error('Get trip error:', error);
            return res.status(500).json({
                success: false,
                error: { message: 'Failed to get trip' }
            });
        }
    },
    async updateTrip(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const updateData = req.body;
            const existingTrip = await database_1.prisma.trip.findFirst({
                where: { id, userId }
            });
            if (!existingTrip) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Trip not found' }
                });
            }
            const updatedTrip = await database_1.prisma.trip.update({
                where: { id },
                data: {
                    ...updateData,
                    startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
                    endDate: updateData.endDate ? new Date(updateData.endDate) : undefined
                },
                include: {
                    stops: {
                        orderBy: { order: 'asc' }
                    },
                    activities: true,
                    _count: {
                        select: {
                            stops: true,
                            activities: true,
                            likes: true,
                            comments: true
                        }
                    }
                }
            });
            return res.json({
                success: true,
                data: updatedTrip
            });
        }
        catch (error) {
            console.error('Update trip error:', error);
            return res.status(500).json({
                success: false,
                error: { message: 'Failed to update trip' }
            });
        }
    },
    async deleteTrip(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const existingTrip = await database_1.prisma.trip.findFirst({
                where: { id, userId }
            });
            if (!existingTrip) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Trip not found' }
                });
            }
            await database_1.prisma.trip.delete({
                where: { id }
            });
            return res.json({
                success: true,
                message: 'Trip deleted successfully'
            });
        }
        catch (error) {
            console.error('Delete trip error:', error);
            return res.status(500).json({
                success: false,
                error: { message: 'Failed to delete trip' }
            });
        }
    },
    async searchPublicTrips(req, res) {
        try {
            const { q, page = 1, limit = 10 } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const where = {
                isPublic: true,
                ...(q && {
                    OR: [
                        { name: { contains: String(q), mode: 'insensitive' } },
                        { description: { contains: String(q), mode: 'insensitive' } }
                    ]
                })
            };
            const [trips, total] = await Promise.all([
                database_1.prisma.trip.findMany({
                    where,
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true
                            }
                        },
                        stops: {
                            orderBy: { order: 'asc' },
                            take: 3
                        },
                        _count: {
                            select: {
                                stops: true,
                                activities: true,
                                likes: true,
                                comments: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: Number(limit)
                }),
                database_1.prisma.trip.count({ where })
            ]);
            return res.json({
                success: true,
                data: {
                    trips,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        pages: Math.ceil(total / Number(limit))
                    }
                }
            });
        }
        catch (error) {
            console.error('Search public trips error:', error);
            return res.status(500).json({
                success: false,
                error: { message: 'Failed to search trips' }
            });
        }
    }
};
//# sourceMappingURL=tripController.js.map