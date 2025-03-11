import db from "../../app/firebase/initFirestore"
import path from "path";
import fs from "fs";

export default async function handler(req, res) {
  try {
    // Fetch data from Firestore
    const collectionRef = db.collection("pfc"); // Replace with your collection name
    const snapshot = await collectionRef.get();

    const data = [];
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    res.status(500).json({ error: "Failed to fetch data from Firestore" });
  }
}

