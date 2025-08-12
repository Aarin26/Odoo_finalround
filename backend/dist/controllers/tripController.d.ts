import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const tripController: {
    getUserTrips(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    createTrip(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getTripById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateTrip(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteTrip(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    searchPublicTrips(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=tripController.d.ts.map