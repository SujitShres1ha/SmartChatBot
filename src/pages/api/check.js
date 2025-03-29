import gemini from "@/lib/gemini";

export default async function handle(req,res){
  await gemini();
}