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

export const createUsers = async (users: userModel): Promise<userModel> => {
  // Get all existing events to determine next ID
  const snapshot = await collection.get();
  const count = snapshot.size + 1;

  // Generate ID like event_00001, event_00002, etc.
  let userId = `user${String(count).padStart(5, "0")}`;

  await collection.doc(userId).set({
    ...users,
    createdAt: new Date().toISOString(),
  });

  return {
    ...users,
    userId
  };
};