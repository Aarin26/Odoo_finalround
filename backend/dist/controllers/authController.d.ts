import { Request, Response } from 'express';
export declare const authController: {
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    refreshToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=authController.d.ts.map