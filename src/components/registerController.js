import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { Register } from "../connectdb/model.js";
import { secretKey } from "../constant.js";
import { sendMail } from "../utils/sendMail.js";
import { Register } from "../model.js";

export const registerCreate = async (req, res) => {
  try {
    let data = req.body;
    let hashPassword = await bcrypt.hash(data.password, 10);

    data = {
      ...data,
      isVerifiedEmail: false,
      password: hashPassword,
    };

    let result = await Register.create(data);

    //send email with link
    //generate tokon
    let infoObj = {
      _id: result._id,
    };

    let expiryInfo = {
      expiresIn: "5d",
    };

    let token = await jwt.sign(infoObj, secretKey, expiryInfo);

    // send mail
    await sendMail({
      from: "'Houseobjob'<uniquekc425@gmail.com>",
      to: data.email,
      subject: "account create",
      html: `
      <h1> your account has been created successfully</h1>
      <a href="http://localhost:3000/verify-email?token=${token}">
       http://localhost:3000/verify-email?token=${token}
      </a>
      `,
    });

    res.json({
      success: true,
      message: "user created successfully.",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
  // let data = req.body;

  // try {
  //   let result = await Register.create(data);
  //   await sendMail({
  //     from: "'NepalRentals'<dharelkristan@gmail.com>",
  //     to: [req.body.email],
  //     subject: "To create account",
  //     html: `<h1>Account has been created</h1>`,
  //   });
  //   res.json({
  //     success: true,
  //     message: "Created successfully",
  //     // data: result,
  //   });
  // } catch (error) {
  //   res.json({
  //     success: false,
  //     message: error.message,
  //     data: result,
  //   });
  // }
};
// code to verify email
export const verifyEmail = async (req, res) => {
  try {
    let tokenString = req.headers.authorization;
    let tokenArray = tokenString.split(" ");
    let token = tokenArray[1];
    console.log(token);
    let infoObj = await jwt.verify(token, secretKey);
    let userId = infoObj._id;
    let result = await Register.findByIdAndUpdate(
      userId,
      {
        isVerifiedEmail: true,
      },
      {
        new: true,
      }
    );
    res.json({
      success: true,
      message: "User verified successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const loginUser = async (req, res, next) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let user = await Register.findOne({ email: email });

    if (user) {
      if (user.isVerifiedEmail) {
        let isValidpassword = await bcrypt.compare(password, user.password);
        if (isValidpassword) {
          let infoObj = {
            _id: user._id,
          };
          let expiryInfo = {
            expiresIn: "365d",
          };
          let token = await jwt.sign(infoObj, secretKey, expiryInfo);

          res.json({
            success: true,
            message: "user login successful.",
            data: user,
            token: token,
          });
        } else {
          let error = new Error("credential does not match");
          throw error;
        }
      } else {
        let error = new Error("credential does not match");
        throw error;
      }
    } else {
      let error = new Error("credential does not match.");
      throw error;
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const myProfile = async (req, res, next) => {
  let userId = req._id;
  try {
    let result = await Register.findById(userId);
    res.json({
      success: true,
      message: "register read successfully",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "unable to read profile",
    });
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    let _id = req._id;
    let data = req.body;
    delete data.email;
    delete data.password;
    let result = await Register.findByIdAndUpdate(_id, data, { new: true });
    res.json({
      success: true,
      message: "profile updated successfully",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const updatePassword = async (req, res, next) => {
  try {
    let _id = req._id;
    // let data = req.body;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    // // let { oldPassword, newPassword } = req.body;
    let data = await Register.findById(_id); //find data of this id
    let hashPassword = data.password;
    let isValidPassword = await bcrypt.compare(oldPassword, hashPassword);
    if (isValidPassword) {
      let newHashPassword = await bcrypt.hash(newPassword, 10);
      let result = await Register.findByIdAndUpdate(
        _id,
        {
          password: newHashPassword,
        },
        { new: true }
      );
      res.json({
        success: true,
        message: "passowrd updated successfully",
        data: result,
      });
    } else {
      let error = new Error("Credintial does not match");
      throw error;
    }

    // console.log(data);

    // let hasCode = await bcrypt.hash(password, 10);
    // let isValidPAss = await bcrypt.compare(password, hasCode);
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// export const readAllUser = async (req, res, next) => {
//   try {
//     let result = await Register.find({});
//     res.json({
//       success: true,
//       message: "Read all users",
//       data: result,
//     });
//   } catch (error) {
//     res.json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// export const readAllUser = async (req, res,next) => {
//   let result = await Register.find({});

//   try {
//     res.json({
//       success: true,
//       message: "success",
//       data: result,
//     });
//   } catch (error) {
//     res.json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
export const readAllUser = async (req, res, next) => {
  try {
    let results = await Register.find({});
    res.status(200).json({
      success: true,
      message: "data read successfully",
      data: results,
    });
  } catch (error) {
    res.json({
      success: true,
      message: error.message,
    });
  }
};
export const readUserById = async (req, res, next) => {
  try {
    let id = req.params.id; //to read id through params

    let result = await Register.findById(id);
    res.json({
      success: true,
      message: "Read all users",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const updateSpecificUser = async (req, res, next) => {
  try {
    let id = req.params.id;
    let data = req.body;
    delete data.email;
    delete data.password;
    let result = await Register.findByIdAndUpdate(id, data, { new: true });
    res.json({
      success: true,
      message: "Updated succcessfully",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const forgotPassword = async (req, res, next) => {
  try {
    let email = req.body.email;
    let result = await Register.findOne({ email: email });
    if (result) {
      //generate tokon
      let infoObj = {
        _id: result._id,
      };

      let expiryInfo = {
        expiresIn: "5d",
      };

      let token = await jwt.sign(infoObj, secretKey, expiryInfo);

      // send mail
      await sendMail({
        from: "'Houseobjob'<fbelly11@gmail.com>",
        to: email,
        subject: "Reset Password",
        html: `
      <h1> Click in the link to reset password</h1>
      <a href="http://localhost:3000/reset-password?token=${token}">
       http://localhost:3000/reset-password?token=${token}
      </a>
      `,
      });

      res.status(200).json({
        success: true,
        message: "Link has been changed",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const resetPassword = async (req, res, next) => {
  try {
    let _id = req._id;
    let hashPassword = await bcrypt.hash(req.body.password, 10);
    let result = await Register.findByIdAndUpdate(
      _id,
      {
        password: hashPassword,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "password reset successfully",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    let id = req.params.id;
    let data = req.body;

    let result = await Register.findByIdAndDelete(id, data, { new: true });
    res.json({
      success: true,
      message: "deleted succcessfully",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// export const registerRead = async (req, res) => {
//   let result = await Register.find({});

//   try {
//     res.json({
//       success: true,
//       message: "success",
//       data: result,
//     });
//   } catch (error) {
//     res.json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// export const registerGetById = async (req, res) => {
//   let registerId = req.params.registerId;
//   try {
//     let result = await Register.findById(registerId);
//     res.json({
//       success: true,
//       message: "successfulllll",
//       data: result,
//     });
//   } catch (error) {
//     res.json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const registerUpdate = async (req, res) => {
//   let registerId = req.params.registerId;
//   let data = req.body;
//   try {
//     let result = await Register.findByIdAndUpdate(registerId, data, {
//       new: true,
//     });
//     res.json({
//       success: true,
//       message: "updated successfully",
//       data: result,
//     });
//   } catch (error) {
//     res.json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// export const registerDelete = async (req, res) => {
//   let registerId = req.params.registerId;
//   try {
//     let result = await Register.findByIdAndDelete(registerId);
//     res.json({
//       success: true,
//       message: "deleted successfully",
//       data: result,
//     });
//   } catch (error) {
//     res.json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
