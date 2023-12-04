import Joi from "joi";

let registerValidation = Joi.object()
  .keys({
    firstName: Joi.string().required().messages({
      "any.required": "name is required",
    }),
    lastName: Joi.string().required().messages({
      "any.required": "name is required",
    }),

    email: Joi.string()
      .required()
      .custom((value, msg) => {
        let validemail = value.match(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        );

        if (validemail) {
          return true;
        } else {
          return msg.message("mail wrong format");
        }
      }),
    password: Joi.string()
      .required()
      .custom((value, msg) => {
        let validpassword = value.match(/^(?=.*[A-Z]).+$/);
        if (validpassword) {
          return true;
        } else {
          return msg.message("Wrong password format");
        }
      }),
    conPassword: Joi.string()
      .required()
      .custom((value, msg) => {
        let validpassword = value.match(/^(?=.*[A-Z]).+$/);
        if (validpassword) {
          return true;
        } else {
          return msg.message("Wrong password format");
        }
      }),
    role: Joi.string().required().valid("superadmin", "admin", "customer"),
  })
  .unknown(true);
export default registerValidation;
