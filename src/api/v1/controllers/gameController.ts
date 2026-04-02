import { NextFunction, Request, Response } from "express";
import * as gameService from "../services/gameService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { gameModel } from "../models/gameModel";

// Controller to handle get all event request
export const getGames = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const game: gameModel[] = await gameService.getGames();
        res.status(HTTP_STATUS.OK).json({
            message: "Games retrieved",
            count: game.length,
            data: game
        });
    } catch (error) {
        next(error)
    }
};

// Controller to handle create event request
export const createGame = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void>=> {
    try {
        const game: gameModel = await gameService.createGame(req.body);
        res.status(HTTP_STATUS.CREATED).json({
            message: "Game Information created",
            data: game
        });
    } catch (error) {
        next(error)
    }
};