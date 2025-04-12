const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

class AuthController {
  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Validate input
      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ message: "Please provide username, email, and password" });
      }

      // Check if user already exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      // Create user
      const user = await userModel.create({ username, email, password });

      // Generate JWT token
      const token = this.generateToken(user);

      // Set token as HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Login a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Please provide email and password" });
      }

      // Find user by email
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(401).json({ message: "Account is inactive" });
      }

      // Check password
      const isMatch = await userModel.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update last login
      await userModel.updateLastLogin(user.id);

      // Generate JWT token
      const token = this.generateToken(user);

      // Set token as HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Logout a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  logout(req, res) {
    // Clear token cookie
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  }

  /**
   * Get current user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCurrentUser(req, res) {
    try {
      // User is already attached to req by the auth middleware
      const user = await userModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          is_active: user.is_active,
        },
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Generate JWT token
   * @param {Object} user - User object
   * @returns {string} - JWT token
   */
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    );
  }
}

module.exports = new AuthController();
