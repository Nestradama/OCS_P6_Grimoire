const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => jwt.sign(
  { userId },
  process.env.JWT_SECRET,
  { expiresIn: '24h' },
);

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    // Duplicate email = MongoDB error 11000
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await user.comparePassword(req.body.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // (if all good) SignIn.jsx line 37 -> Requires userId and token
    return res.status(200).json({
      userId: user._id,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
