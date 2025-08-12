import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const activityController: {
    getTripActivities(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    createActivity(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getActivityById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateActivity(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteActivity(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=activityController.d.ts.map