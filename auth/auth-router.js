const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
  // Pull the user's credentials from the body of the request.
  const user = req.body;
  
  // Hash the user's password, and set the hashed password as the
  // user's password in the request.
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then((newUser) => {
      const token = generateToken(newUser);
      res
        .status(201)
        .json({ created_user: newUser, token: token, user_id: newUser.id });
    })
    .catch((err) => {
      res.status(500).json({
        message: "There was an error adding a user to the database",
        err,
      });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          avatar_img: user.avatar_img,
          address: user.address,
          address2: user.address2,
          city: user.city,
          state: user.state,
          zip: user.zip,
          location: user.location,
          bio: user.bio,
          subscribers: user.subscribers,
          website: user.website_url,
          header_img: user.header_img,
          token: token,
          user_id: user.id,
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// router.post("/forgotPassword", (req, res) => {
//   const email = req.body.email;
//   if (req.body.email === "") {
//     res.status(400).json({ message: "Please provide a valid email address" });
//   }

//   Users.findBy({ email })
//     .first()
//     .then((userRecord) => {
//       console.log("found userRecord", userRecord);
//       const token = crypto.randomBytes(20).toString("hex");
//       Users.updateResetPasswordToken(userRecord.id, {
//         reset_password_token: token,
//         reset_password_expires: parseInt(new Date().getTime() / 1000) + 3600000,
//       })
//         .then((userRecordWithToken) => {
//           console.log(userRecordWithToken);

//           const transport = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 465,
//             secure: true,
//             auth: {
//               type: "OAuth2",
//               email: process.env.EMAIL_ADDRESS,
//             },
//           });
//           res.status(201).json(userRecordWithToken);
//         })
//         .catch((err) => {
//           console.error(err);
//           res.status(500).json({
//             message: "There was an error adding a password reset token.",
//           });
//         });
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(403).json({
//         message: "Could not find a user with that email in the database",
//       });
//     });
// });

function generateToken(user) {
  const payload = {
    userid: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1h",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);

  return token;
}

module.exports = router;