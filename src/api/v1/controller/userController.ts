import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as userService from "../services/userService";
import bcrypt from "bcrypt";


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

const saltRounds = 10

export const createUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { password, ...rest } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const users = await userService.createUsers({
        ...rest,
        password: hashedPassword
    });

    res.status(HTTP_STATUS.CREATED).json({
      message: "User created successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
