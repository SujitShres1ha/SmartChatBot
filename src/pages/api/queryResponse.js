import gemini from "@/lib/gemini";

export default async function handle(req,res){
  if (req.method === 'POST'){
    const {query} = req.body;
    const output = await gemini(query)
    res.send(output);
  }
}