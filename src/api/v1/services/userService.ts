import { userModel } from "../models/userModel";
import * as usersRepository from "../repository/firestoreRepository";

export const getAllUsers = (): Promise<userModel[]> => {
  return usersRepository.getAllUsers();
};

export const createUsers = (data: userModel) => {
  return usersRepository.createUsers(data);
};