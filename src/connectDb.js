import mongoose from "mongoose";
import { dbURL } from "./constant.js";
// import { dbURL } from "../constant.js";
let connectDb = async () => {
  try {
    await mongoose.connect(`${dbURL}`);
    console.log("SuccessFul");
  } catch (error) {
    console.log(error.message);
  }
};
export default connectDb;
