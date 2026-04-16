import { db } from "../../../../config/firebaseConfig";
import { userModel } from "../models/userModel";

const collection = db.collection("users");

export const getAllUsers = async (): Promise<userModel[]> => {
  const snapshot = await collection.get();
  return snapshot.docs.map((doc) => ({
    ...(doc.data() as userModel),
  }));
};

export const getUserById = async (uid: string): Promise<userModel> => {
  const doc = await collection.doc(uid).get();
  const data = doc.data()!;

  return { 
    userId: data.userId,
    username: data.username,
    DOB: data.DOB.toDate().toISOString().split("T")[0],
    subscription: data.subscription,
    platform: data.platform,
    createdAt: data.createdAt
  };
};

export const createUsers = async (
  user_id: string,
  users: userModel
): Promise<userModel> => {

  const userId = user_id;
  const userRef = collection.doc(userId);

  const newUser = {
    userId,
    ...users,
    DOB: users.DOB,
    createdAt: new Date().toISOString().split("T")[0],
  };

  await userRef.set(newUser);

  return newUser;
};

export const updateUser = async (
  userId: string,
  data: Partial<userModel>
): Promise<userModel> => {
  const docRef = collection.doc(userId);
  await docRef.get();

  // Remove id 
  const updateData = Object.fromEntries(
    Object.entries(data).filter(
      ([key, value]) => key !== "userId" && value !== undefined
    )
  );

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields provided for update");
  }

  await docRef.update(updateData);

  const updatedDoc = await docRef.get();
  return { userId, ...(updatedDoc.data() as userModel) };
};


export const deleteUser = async (userId: string): Promise<boolean> => {
  const docRef = collection.doc(userId);
  const doc = await docRef.get();

  if (!doc.exists) return false;

  await docRef.delete();
  return true;
};