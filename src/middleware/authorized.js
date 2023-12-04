// import { Register } from "../connectdb/model.js";

import { Register } from "../model.js";

let authorized = (roles) => {
  return async (req, res, next) => {
    try {
      let _id = req._id;
      let result = await Register.findById(_id);
      let tokenRole = result.role;
      if (roles.includes(tokenRole)) {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }
    } catch (error) {
      res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }
  };
};
export default authorized;
