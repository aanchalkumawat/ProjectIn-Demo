const bcrypt = require("bcryptjs");

const storedPassword = "$2a$10$NwMA1L/3LhLBV9SdvYYWtu5nXup/3nrfN5AG/cGG2zrpo5JiQkhV6";
const enteredPassword = "Astha"; // Replace with the password you entered

bcrypt.compare(enteredPassword, storedPassword, (err, isMatch) => {
  if (err) {
    console.error("Error comparing passwords:", err);
  } else {
    console.log("Password Match Result:", isMatch);
  }
});
