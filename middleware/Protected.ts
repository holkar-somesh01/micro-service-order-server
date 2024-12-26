import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: string;
}

export const userProtected = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {

    console.log(req.cookies, "DDDDDDDDDDDDDDDDD");

    // if (!req.cookies) {
    //     return res.status(400).json({ message: "cookies not founddd" })
    // }
    const { user } = req.cookies;
    console.log(user);


    if (!user) {
        return res.status(401).json({ message: 'Authorization token is missing. Please login first.  message from shareable protected' });
    }

    jwt.verify(user, process.env.JWT_KEY as string, async (error: VerifyErrors | null, decoded: any) => {
        if (error) {
            let errorMessage = 'Invalid Token';
            if (error.name === 'TokenExpiredError') {
                errorMessage = 'Token has expired. Please login again.';
            }

            return res.status(401).json({ message: errorMessage });
        }

        // Attach decoded user information to the request object
        req.user = decoded.userId;
        console.log(req.user, "from proctedddd");

        // Proceed to the next middleware or route handler
        next();
    });
};
