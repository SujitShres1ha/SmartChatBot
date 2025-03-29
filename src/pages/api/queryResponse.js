import gemini from "@/lib/gemini";

export default async function handle(req, res) {
  if (req.method === "POST") {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).send("Invalid input format.");
    }

    try {
      const output = await gemini(messages);
      res.status(200).send(output);
    } catch (error) {
      console.error("Error in queryResponse:", error);
      res.status(500).send("Failed to process query.");
    }
  } else {
    res.status(405).send("Method not allowed.");
  }
}
