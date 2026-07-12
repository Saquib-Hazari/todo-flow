import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function envValue(name: string) {
	return process.env[name]?.trim().replace(/^['"]|['"]$/g, "");
}

const projectId = envValue("FIREBASE_PROJECT_ID");
const clientEmail = envValue("FIREBASE_CLIENT_EMAIL");
const privateKey = envValue("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
	throw new Error(
		"Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
	);
}

const firebaseApp =
	getApps()[0] ??
	initializeApp({
		credential: cert({
			projectId,
			clientEmail,
			privateKey,
		}),
	});

export const firestore = getFirestore(firebaseApp);
