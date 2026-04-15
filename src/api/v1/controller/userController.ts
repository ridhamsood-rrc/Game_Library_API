import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as userService from "../services/userService";

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();

    res.status(HTTP_STATUS.OK).json({
      message: "Users retrieved successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getUserById(req.params.id as string);

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "User not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const createUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const users = await userService.createUsers(req.body)

    res.status(HTTP_STATUS.CREATED).json({
      message: "User created successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const user = await userService.updateUser(req.params.id as string, req.body)

    if (!user) {
       res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "User not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      message: "User information updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleted = await userService.deleteUser(req.params.id as string);

    if (!deleted) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "User not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
