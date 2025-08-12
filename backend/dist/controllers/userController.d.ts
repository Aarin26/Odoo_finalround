import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const userController: {
    getProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getUserById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllUsers(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteUser(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=userController.d.ts.map