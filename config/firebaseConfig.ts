import {
    initializeApp,
    cert,
    AppOptions,
    ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";


const getFirebaseConfig = (): AppOptions => {
    // Extract Firebase credentials from environment variables
    const FIREBASE_PROJECT = JSON.parse(process.env.FIREBASE_PROJECT_ID!);

    // Validate that all required configuration values are present
    if (
        !FIREBASE_PROJECT
    ) {
        // You could definitely create a custom error to use here
        throw new Error(
            "Missing Firebase configuration. Please check your environment variables."
        );
    }

    // Create a service account object with the provided credentials
    const serviceAccount: ServiceAccount = {
        projectId: FIREBASE_PROJECT.project_id,
        clientEmail: FIREBASE_PROJECT.client_email,
        // Replace escaped newlines in the private key string with actual newlines
        privateKey: FIREBASE_PROJECT.private_key.replace(/\\n/g, "\n"),
    };

    // Return the app configuration with credentials
    return {
        credential: cert(serviceAccount),
    };
};

// Initialize the Firebase app with the service account credentials
// This step is necessary before you can use any Firebase services
initializeApp(getFirebaseConfig());

const db: Firestore = getFirestore();

const auth: Auth = getAuth();

export { db, auth };