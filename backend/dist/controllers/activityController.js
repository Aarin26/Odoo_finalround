"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityController = void 0;
const database_1 = require("../config/database");
exports.activityController = {
    async getTripActivities(req, res) {
        try {
            const { tripId } = req.params;
            const userId = req.user.id;
            const trip = await database_1.prisma.trip.findFirst({
                where: {
                    id: tripId,
                    OR: [
                        { userId },
                        { isPublic: true }
                    ]
                }
            });
            if (!trip) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Trip not found' }
                });
            }
            const activities = await database_1.prisma.activity.findMany({
                where: { tripId },
                orderBy: { startTime: 'asc' }
            });
            return res.json({
                success: true,
                data: activities
            });
        }
        catch (error) {
            console.error('Get trip activities error:', error);
            return res.status(500).json({
                success: false,
                error: { message: 'Failed to get activities' }
            });
        }
    },
    async createActivity(req, res) {
        try {
            const userId = req.user.id;
            const { name, description, type, cost, location, startTime, endTime, tripId } = req.body;
            const trip = await database_1.prisma.trip.findFirst({
                where: { id: tripId, userId }
            });
            if (!trip) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Trip not found' }
                });
            }
            const activity = await database_1.prisma.activity.create({
                data: {
                    name,
                    description,
                    type,
                    cost,
                    location,
                    startTime: startTime ? new Date(startTime) : null,
                    endTime: endTime ? new Date(endTime) : null,
                    tripId
                }
            });
            return res.status(201).json({
                success: true,
                data: activity
            });
        }
        catch (error) {
            console.error('Create activity error:', error);
            return res.status(500).json({
                success: false,
                error: { message: 'Failed to create activity' }
            });
        }
    },
    async getActivityById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const activity = await database_1.prisma.activity.findFirst({
                where: {
                    id,
                    trip: {
                        OR: [
                            { userId },
                            { isPublic: true }
                        ]
                    }
                },
                include: {
                    trip: {
                        select: {
                            id: true,
                            name: true,
                            isPublic: true
                        }
                    }
                }
            });
            if (!activity) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Activity not found' }
                });
            }
            return res.json({
                success: true,
                data: activity
            });
        }
        catch (error) {
            console.error('Get activity error:', error);
            return res.status(500).json({
                success: false,
                error: { message: 'Failed to get activity' }
            });
        }
    },
    async updateActivity(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const updateData = req.body;
            const existingActivity = await database_1.prisma.activity.findFirst({
                where: {
                    id,
                    trip: {
                        userId
                    }
                }
            });
            if (!existingActivity) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Activity not found' }
                });
            }
            const updatedActivity = await database_1.prisma.activity.update({
                where: { id },
                data: {
                    ...updateData,
                    startTime: updateData.startTime ? new Date(updateData.startTime) : undefined,
                    endTime: updateData.endTime ? new Date(updateData.endTime) : undefined
                }
            });
            return res.json({
                success: true,
                data: updatedActivity
            });
        }
        catch (error) {
            console.error('Update activity error:', error);
            return res.status(500).json({
                success: false,
                error: { message: 'Failed to update activity' }
            });
        }
    },
    async deleteActivity(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const existingActivity = await database_1.prisma.activity.findFirst({
                where: {
                    id,
                    trip: {
                        userId
                    }
                }
            });
            if (!existingActivity) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Activity not found' }
                });
            }
            await database_1.prisma.activity.delete({
                where: { id }
            });
            return res.json({
                success: true,
                message: 'Activity deleted successfully'
            });
        }
        catch (error) {
            console.error('Delete activity error:', error);
            return res.status(500).json({
                success: false,
                error: { message: 'Failed to delete activity' }
            });
        }
    }
};
//# sourceMappingURL=activityController.js.map