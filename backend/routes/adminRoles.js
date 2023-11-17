const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const AdminRoles = require("../models/AdminRoles");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

// Secret key for JWT (replace with your own secret key)
const JWT_SECRET = "iamamirowaisy";

router.post("/emailVarification", async (req, res) => {
  let success = false;
  try {
    let { email } = req.body;

    //Generate a random 6 digit OTP and send it to email using nodemailer
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create a Nodemailer transporter to send the OTP
    const transporter = nodemailer.createTransport({
      service: "Gmail", // e.g., 'Gmail'
      auth: {
        user: "amirowaisy72@gmail.com", // Replace with your email address
        pass: "hyyl fhtx lrij uvjs", // Replace with your email password
      },
    });

    // Define the email message
    const mailOptions = {
      from: "amirowaisy72@gmail.com", // Sender's email address
      to: email, // Recipient's email address
      subject: "Email Verification OTP",
      text: `Your verification OTP is: ${otp}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
        success = true;
      }

      // Send the response indicating success or failure
      res.send({ success, otp: otp });
    });
  } catch (error) {
    res.send({ success, error: error.message });
  }
});

router.post("/emailVarificationLogin", async (req, res) => {
  try {
    let { email, firmId } = req.body;

    // Check if the email already exists in the database
    const existingUser = await AdminRoles.findOne({ email, firmId });

    if (!existingUser) {
      return res.json({
        success: false,
        message: "یہ ای میل پہلے سے موجود نہیں ہے",
      });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create a Nodemailer transporter to send the OTP
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "amirowaisy72@gmail.com", // Replace with your email address
        pass: "hyyl fhtx lrij uvjs", // Replace with your email password
      },
    });

    // Define the email message
    const mailOptions = {
      from: "amirowaisy72@gmail.com", // Sender's email address
      to: email, // Recipient's email address
      subject: "Email Verification OTP",
      text: `Your verification OTP is: ${otp}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.json({
          success: false,
          message: "OTP بھیجنے میں مشکل پیش آئی",
        });
      }

      console.log("Email sent: " + info.response);

      // Send the response indicating success and the OTP
      res.json({ success: true, otp: otp });
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "سرور میں خرابی" });
  }
});

router.post("/createAccountant", async (req, res) => {
  try {
    const { firmId, username, password } = req.body;

    // Check if the firm ID exists
    const existingFirm = await AdminRoles.findOne({ firmId });

    if (existingFirm) {
      // If the firm ID exists, retrieve the password
      const existingPassword = existingFirm.password;

      // Compare the existing password with the provided password
      if (existingPassword === password) {
        // Passwords match, send an error response
        return res.status(400).json({
          success: false,
          message: "اپنے اکاؤنٹنٹ کے لئے مختلف پاس ورڈ استعمال کریں",
        });
      }
    } else {
      // If the firm ID does not exist, send an error response
      return res.status(400).json({
        success: false,
        message: "فرم آئی ڈی موجود نہیں ہے",
      });
    }

    // Create a new document for the accountant
    const newAccountantData = {
      username,
      email: existingFirm.email,
      password: password,
      role: "Accountant",
      allowedByAdmin: true,
      active: false,
      firmId,
    };

    // Create a new accountant
    const newAccountant = new AdminRoles(newAccountantData);

    // Save the new accountant to the database
    await newAccountant.save();

    return res.status(201).json({
      success: true,
      message: "آپ کے نے اکاؤنٹنٹ کا اکاؤنٹ کامیابی سے بنا دیا گیا ہے",
      accountant: newAccountant,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/createAdmin", async (req, res) => {
  try {
    const { email } = req.body;
    let emailParts = email.split("@");
    const firmId = emailParts[0];

    // Check if the email already exists in the AdminRoles model with a specific firmId
    const existingAdmin = await AdminRoles.findOne({ email, firmId });

    if (existingAdmin) {
      // Case 1: Email already exists
      return res
        .status(400)
        .json({ success: false, message: "آپ نے غلط ای میل کا اندراج کیا ہے" });
    }

    // Create a new admin or accountant
    const newAdminData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: "Admin",
      firmId,
    };

    // Create a new admin
    const newAdmin = new AdminRoles(newAdminData);

    // Save the new admin to the database
    await newAdmin.save();

    // Create and sign a JWT token
    const token = jwt.sign(
      {
        email: newAdmin.email,
        role: newAdmin.role,
        username: newAdmin.username,
      },
      JWT_SECRET
    );

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: newAdmin,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Define a login endpoint
router.post("/loginAdmin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the provided email exists in your database (AdminRoles model)
    const user = await AdminRoles.findOne({ email, password });

    if (!user) {
      // Case 1: User not found
      return res
        .status(401)
        .json({ success: false, message: "کوئی ایسا اکاؤنٹ نہیں ملا" });
    }

    // If both email and password are correct, generate a JWT token
    const token = jwt.sign(
      { email: user.email, role: user.role, username: user.username },
      JWT_SECRET
    );

    // Return a success message and the token
    return res.status(200).json({
      success: true,
      message: "لاگ ان ہو گیا",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "سرور میں خرابی" });
  }
});

router.post("/changePassword", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await AdminRoles.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "یہ ای میل پہلے سے موجود نہیں ہے",
      });
    }

    // Update the user's password
    user.password = password;

    // Save the updated user to the database
    await user.save();

    return res.json({ success: true, message: "پاس ورڈ تبدیل کر دیا گیا ہے" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "سرور میں خرابی" });
  }
});

router.get("/getAccountants/:firmId", async (req, res) => {
  let success = false;
  try {
    // Use your AdminRoles model to query the database for users with the 'Accountant' role and allowedByAdmin set to false
    const accountants = await AdminRoles.find({
      role: "Accountant",
      allowedByAdmin: false,
      firmId: req.params.firmId,
    });

    res.status(200).json({
      success: true,
      accountants: accountants,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      accountants: [],
    });
  }
});

router.put("/updateAccountant/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Find the AdminRoles record by its id and update allowedByAdmin to true
    const updatedAdminRoles = await AdminRoles.findByIdAndUpdate(
      id,
      { allowedByAdmin: true },
      { new: true }
    );

    if (!updatedAdminRoles) {
      // If no record was found with the given id, return a 404 Not Found response
      return res.status(404).json({
        success: false,
        error: "AdminRoles not found",
      });
    }

    // If the update was successful, return the updated record
    res.status(200).json({
      success: true,
      data: updatedAdminRoles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.put("/updateAccountantStatus/:id", async (req, res) => {
  try {
    let success = false;
    const id = req.params.id;
    const status = req.body.status;

    // Calculate the new value for the active field based on the status
    const newActiveValue = !status; // This will toggle the value

    // Find the AdminRoles record by its id and update allowedByAdmin to true
    const updatedAdminRoles = await AdminRoles.findByIdAndUpdate(
      id,
      { active: newActiveValue },
      { new: true }
    );

    if (!updatedAdminRoles) {
      // If no record was found with the given id, return a 404 Not Found response
      return res.status(404).json({
        success: false,
        error: "AdminRoles not found",
      });
    }

    // If the update was successful, return the updated record
    res.status(200).json({
      success: true,
      data: updatedAdminRoles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.delete("/deleteAccountant/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Use Mongoose to find and remove the document by its ID
    const deletedAccountant = await AdminRoles.findByIdAndRemove(id);

    if (!deletedAccountant) {
      return res
        .status(200)
        .json({ success: false, message: "Accountant not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Accountant deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.get("/getAdmins/:firmId", async (req, res) => {
  try {
    const admins = await AdminRoles.find({
      role: "Accountant",
      firmId: req.params.firmId,
    });
    res.json({ admins });
  } catch (error) {
    // Handle the error appropriately (e.g., return an error response)
    res.status(500).json({ error: error.message });
  }
});

router.get("/getStatusUpdate/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const accountant = await AdminRoles.findOne({
      email: email,
      role: "Accountant",
    });
    res.json({ active: accountant.active });
  } catch (error) {
    // Handle the error appropriately (e.g., return an error response)
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
