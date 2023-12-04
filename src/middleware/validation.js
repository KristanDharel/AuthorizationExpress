let validation = (randomValidation) => {
  return (req, res, next) => {
    let data = randomValidation.validate(req.body);
    let error = data.error;
    // console.log("***************", error.details[0].message); // only gives message

    if (error) {
      res.json({
        success: false,
        message: error.details[0].message,
      });
    } else {
      next();
    }
  };
};
export default validation;
