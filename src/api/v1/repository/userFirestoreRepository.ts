import { randomUUID } from "crypto";

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

export const getUserByUid = async (uid: string) => {
  const snapshot = await collection
    .where("uid", "==", uid)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];

  return {
    userId: doc.id,
    ...(doc.data() as userModel),
  };
};

export const createUsers = async (
  users: userModel
): Promise<userModel> => {

  const uid = randomUUID(); 
  const counterRef = db.collection("counters").doc("users");
  const newUser = await db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    let newCount = 1;
    if (!counterDoc.exists) {
      transaction.set(counterRef, { currentId: 1 });
    } else {
      newCount = counterDoc.data()!.currentId + 1;
      transaction.update(counterRef, { currentId: newCount });
    }
    const userId = `user${String(newCount).padStart(5, "0")}`;
    const userRef = collection.doc(userId);
    const message = "Copy the UID and paste it in the Header access the library endpoints as user otherwise you will be treated as a guest."

    transaction.set(userRef, {
      ...users,
      userId,
      uid: uid,
      DOB: new Date(users.DOB).toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
    });
    return {
      uid,
      userId,
      ...users,
      message
    };
  });
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