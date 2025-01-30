const bcrypt = require("bcryptjs");

const password = "Astha"; // Replace with the password you want to test
const storedPassword = "$2a$10$mJECYj/we1LuV.mSgEo6n.cAsd5P1/CxnS48WOdq7qwGV2YIlrT2q"; // Copy the hashed password from the database

// Hash the password
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed Password:", hash);

    // Compare the entered password with the stored password
    bcrypt.compare(password, storedPassword, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
      } else {
        console.log("Password Match Result:", isMatch);
      }
    });
  }
});
