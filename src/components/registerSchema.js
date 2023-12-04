// define content of object is called schema

import { Schema } from "mongoose";

let registerSchema = Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    conPassword: {
      type: String,
    },
    role: {
      type: String,
    },

    isVerifiedEmail: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
export default registerSchema;
