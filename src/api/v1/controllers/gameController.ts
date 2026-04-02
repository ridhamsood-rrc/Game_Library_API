import { NextFunction, Request, Response } from "express";
import * as gameService from "../services/gameService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { gameModel } from "../models/gameModel";
import { errorResponse } from "../models/responseModel";

// Controller to handle get all game request
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

// Controller to handle get game by game_id request
export const getGameById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = (req.params.id as string)

        const game: gameModel | null = await gameService.getGameById(id);

        // Throws error if game information id not found
        if (!game) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse(
                "Game Information not found",
                "GAME_NOT_FOUND"
            ));
            return;
        };

        res.status(HTTP_STATUS.OK).json({
            message: "Game information retrieved successfully",
            data: game,
        });
    } catch (error) {
        next(error)
    }
};

// Controller to handle create game request
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

// Controller to handle update game information request
export const updateGame = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = String(req.params.id);

        const game: gameModel | null = await gameService.getGameById(id);
        
        // Throws error if game information id not found
        if (!game) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse(
                "Game Information not found",
                "GAME_NOT_FOUND"
            ));
            return;
        };

        const updatedGame: gameModel = await gameService.updateGame(id, req.body);
        res.status(HTTP_STATUS.OK).json({
            message: `Game Information updated`,
            data: updatedGame
        });

    } catch (error) {
        next(error);
    }
};

// Controller to handle delete game request
export const deleteGame = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = String(req.params.id);

        const game: gameModel | null = await gameService.getGameById(id);

        // Throws error if game information id not found
        if (!game) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse(
                "Game Information not found",
                "GAME_NOT_FOUND"
            ));
            return;
        };

        await gameService.deleteGame(id);

        res.status(HTTP_STATUS.OK).json({
            message: `Game with id: "${id}" deleted successfully`
        });
    } catch (error) {
        next(error);
    }
};