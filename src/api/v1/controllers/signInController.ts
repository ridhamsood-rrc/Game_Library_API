// External library imports
import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

// Internal module imports
import { getAuth } from "firebase-admin/auth";
import { HTTP_STATUS } from "../../../constants/httpConstants";

const axios = require("axios");

export const signIn = async(
    req: Request,
    res: Response,
    _next: NextFunction
): Promise<void> => {
    try {
    const { email, password }:{
        email: string,
        password: string
    } = req.body;

    if (!email || !password) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Email and password are required"
        });
    }

    // Firebase Admin SDK does NOT allow signing in with email/password directly.
    // So we need the client to sign in via Firebase Auth client SDK (web, mobile)
    // or you can use Firebase REST API to verify credentials

    // Example using Firebase REST API
    const FIREBASE_API_KEY: string = process.env.FIREBASE_API_KEY as string;

    const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
            email,
            password,
            returnSecureToken: true
        }
    );

    const idToken: string = response.data.idToken;
    const refreshToken: string = response.data.refreshToken

    // Decode token using Firebase Admin SDK
    const decodedToken: DecodedIdToken = await getAuth().verifyIdToken(idToken);

    const userInfo: {uid: string,
        role: string,
        email: string | undefined
    } = {
        uid: decodedToken.uid,
        role: decodedToken.role || null,
        email: decodedToken.email
    };

    res.status(HTTP_STATUS.OK).json({
        idToken,
        email: userInfo.email,
        localid: userInfo.uid,
        expiresIn: decodedToken.exp,
        refreshToken
    });
    } catch (err: any) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: err.response?.data?.error?.message || "Invalid credentials" });
    };
};