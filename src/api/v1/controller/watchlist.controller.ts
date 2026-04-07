import { NextFunction, Request, Response } from "express";
import { watchlistService } from "../services/watchlist.service";

export const createWatchlist = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = res.locals.user.uid;
        const result = await watchlistService.createWatchlist(userId, req.body);

        res.status(201).json({
            success: true,
            message: "Game added to watchlist successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getUserWatchlist = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = res.locals.user.uid;
        const result = await watchlistService.getUserWatchlist(userId);

        res.status(200).json({
            success: true,
            message: "Watchlist retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const updateWatchlist = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = res.locals.user.uid;
        const id = req.params.id as string;

        const result = await watchlistService.updateWatchlist(id, userId, req.body);

        res.status(200).json({
            success: true,
            message: "Watchlist item updated successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const deleteWatchlist = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = res.locals.user.uid;
        const id = req.params.id as string;

        await watchlistService.deleteWatchlist(id, userId);

        res.status(200).json({
            success: true,
            message: "Watchlist item deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};