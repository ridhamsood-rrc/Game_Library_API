import { userModel } from "../models/userModel";
import * as usersRepository from "../repository/userFirestoreRepository";

export const getAllUsers = (): Promise<userModel[]> => {
  return usersRepository.getAllUsers();
};

export const getUserById = (id: string) => {
  return usersRepository.getUserById(id);
};

export const createUsers = (data: userModel) => {
  return usersRepository.createUsers(data);
};

export const updateUser = (id: string, data: Partial<userModel>): Promise<userModel> => {
  return usersRepository.updateUser(id, data);
};

export const deleteUser = (id: string) => {
  return usersRepository.deleteUser(id);
};