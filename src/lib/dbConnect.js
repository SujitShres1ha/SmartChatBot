import mongoose from "mongoose";


export default function dbConnect(){
  if (!mongoose.connection.readyState){
    const uri = process.env.MONGODB_URI
    return mongoose.connect(uri)
  }
  return mongoose.connection.asPromise()
}
