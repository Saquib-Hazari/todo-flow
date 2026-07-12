import { auth } from "@clerk/tanstack-react-start/server";
import { firestore } from "../../lib/firebase.server";

export async function createTodoRecord(data: {
	title: string;
	description?: string;
	tag: "work" | "today" | "personal" | "workout";
}) {
		const { isAuthenticated, userId } = await auth();

		if (!isAuthenticated || !userId) {
			throw new Error("Unauthorized");
		}

		const todoRef = firestore
			.collection("users")
			.doc(userId)
			.collection("todos")
			.doc();

		await todoRef.set({
			id: todoRef.id,
			title: data.title,
			description: data.description ?? "",
			tag: data.tag,
			completed: false,
			position: Date.now(),
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return {
			id: todoRef.id,
			...data,
			completed: false,
		};
}

export async function listTodoRecords() {
	const { isAuthenticated, userId } = await auth();
	if (!isAuthenticated || !userId) throw new Error("Unauthorized");

	const snapshot = await firestore
		.collection("users")
		.doc(userId)
		.collection("todos")
		.orderBy("position", "asc")
		.get();

	return snapshot.docs.map((doc) => {
		const data = doc.data();
		return {
			id: doc.id,
			title: String(data.title ?? ""),
			description: data.description ? String(data.description) : undefined,
			tag: data.tag as "work" | "today" | "personal" | "workout",
			completed: Boolean(data.completed),
		};
	});
}

async function userTodosRef() {
	const { isAuthenticated, userId } = await auth();
	if (!isAuthenticated || !userId) throw new Error("Unauthorized");
	return firestore.collection("users").doc(userId).collection("todos");
}

export async function deleteTodoRecord(todoId: string) {
	await (await userTodosRef()).doc(todoId).delete();
}

export async function clearTodoRecords() {
	const snapshot = await (await userTodosRef()).get();
	const batch = firestore.batch();
	snapshot.docs.forEach((doc) => {
		batch.delete(doc.ref);
	});
	await batch.commit();
}
