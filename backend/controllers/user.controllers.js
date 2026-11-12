const bcrypt = require("bcryptjs");
const User = require("../models/User");

const withoutPassword = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

// GET /api/users/me
const getProfile = async (req, res) => {
  res.status(200).json(withoutPassword(req.user));
};

// PUT /api/users/me  { name, phone, address }
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user._id);

    if (name !== undefined) {
      if (!String(name).trim()) {
        res.status(400);
        throw new Error("Name can not be empty");
      }
      user.name = name;
    }
    if (phone !== undefined) user.phone = phone;
    if (address && typeof address === "object") {
      const fields = ["fullName", "phone", "street", "city", "state", "postalCode", "country"];
      fields.forEach((f) => {
        if (address[f] !== undefined) user.address[f] = address[f];
      });
    }

    await user.save();
    res.status(200).json(withoutPassword(user));
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/me/password  { currentPassword, newPassword }
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }
    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("New password must be at least 6 characters");
    }

    const user = await User.findById(req.user._id);
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      res.status(400);
      throw new Error("Current password is incorrect");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, changePassword };
