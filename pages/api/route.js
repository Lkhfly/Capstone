import fs from "fs";
import path from "path";

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return new Response(JSON.stringify({ message: "Email is required" }), { status: 400 });
        }

        // Path to the JSON file
        const filePath = path.join(process.cwd(), "plantcoordinators.json");

        // Read existing JSON data
        const fileData = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(fileData);

        // Check if email already exists
        if (data.plant_coordinators.includes(email)) {
            return new Response(JSON.stringify({ message: "Email is already a coordinator" }), { status: 400 });
        }

        // Add new email
        data.plant_coordinators.push(email);

        // Write updated data back to JSON
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return new Response(JSON.stringify({ message: "Coordinator added successfully!" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error updating file", error: error.message }), { status: 500 });
    }
}