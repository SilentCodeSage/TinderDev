const validateUserSignup = (req) => {
  const requiredFields = ["firstName", "lastName", "emailId", "password"];

  const isrequiredFeilds = Object.keys(req).every((k) => {
    return requiredFields.includes(k);
  });

  if (!isrequiredFeilds) {
    throw new Error("req format error");
  }
};

const validateUserUpdate = (data) => {
  const allowedUpdateFields = [
    "profileUrl",
    "about",
    "age",
    "skills",
    "password",
  ];

  const isUpdateAllowed = Object.keys(data).every((k) => {
    return allowedUpdateFields.includes(k);
  });

  if (!isUpdateAllowed) {
    throw new Error("Cannot Update the provided fields.");
  }
};

module.exports = {validateUserSignup,validateUserUpdate};
