import { userModel } from "../models/userModel";
import * as usersRepository from "../repository/userFirestoreRepository";

export const getAllUsers = (): Promise<userModel[]> => {
  return usersRepository.getAllUsers();
};

export const getUserById = async (id: string): Promise<userModel> => {
  return usersRepository.getUserById(id);
};

export const createUsers = (user_id: string, data: userModel) => {
  return usersRepository.createUsers(user_id, data);
};

export const updateUser = (id: string, data: Partial<userModel>): Promise<userModel> => {
  return usersRepository.updateUser(id, data);
};

export const deleteUser = (id: string) => {
  return usersRepository.deleteUser(id);
};