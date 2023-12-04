import cors from "cors";
import express, { json } from "express";
import registerRouter from "./src/components/registerRouter.js";
import connectDb from "./src/connectDb.js";
import { dbURL, port } from "./src/constant.js";
// // import connectDb from "./src/connectdb/connectMOngo.js";
// import { dbURL, port } from "./src/constant.js";
// import connectDb from "./src/connectDb.js";
// maake expressApp
let expressApp = express();
expressApp.use(cors());
expressApp.use(json());

connectDb();
expressApp.listen(port, () => {
  console.log(`Express app is running on port ${dbURL}`);
  console.log(`port running at ${port}`);
});

expressApp.use("/register", registerRouter);
