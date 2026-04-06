import { db } from "../../../../config/firebaseConfig";
import { userModel } from "../models/userModel";

const collection = db.collection("users");

export const getAllUsers = async (): Promise<userModel[]> => {
  const snapshot = await collection.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as userModel),
  }));
};

export const getUserById = async (userId: string): Promise<userModel | null> => {
  const doc = await collection.doc(userId).get();
  if (!doc.exists) return null;
  return { userId: doc.id, ...(doc.data() as userModel) };
};

export const createUsers = async (users: userModel): Promise<userModel> => {
  // Get all existing events to determine next ID
  const snapshot = await collection.get();
  const count = snapshot.size + 1;

  // Generate ID like user00001, user00002, etc.
  let userId = `user${String(count).padStart(5, "0")}`;

  await collection.doc(userId).set({
    ...users,
    DOB: new Date(users.DOB).toISOString().split("T")[0],
    createdAt: new Date().toISOString().split("T")[0],
  });

  return {
    ...users,
    userId
  };
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