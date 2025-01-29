const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../data/mockDatabase');
const { Op } = require('sequelize');

class AuthService {
  constructor() {
    this.useDatabase = process.env.USE_DATABASE === 'true';
    this.User = null;
  }

  async setUser(User) {
    this.User = User;
  }

  async findUserByEmail(email) {
    console.log('Finding user by email:', email);
    console.log('Using database:', this.useDatabase);

    if (this.useDatabase) {
      if (!this.User) {
        throw new Error('Database model not initialized');
      }
      const user = await this.User.findOne({
        where: {
          email: {
            [Op.eq]: email
          }
        }
      });
      console.log('Found user:', user ? 'yes' : 'no');
      if (user) {
        console.log('User access_type:', user.access_type);
      }
      return user;
    }

    // Use mock database
    return UserModel.findOne({ email });
  }

  async updateLastAccess(user) {
    if (this.useDatabase) {
      if (!this.User) {
        throw new Error('User model not initialized');
      }
      user.last_access = new Date();
      await user.save();
    }
  }

  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        access_type: user.access_type
      },
      process.env.JWT_SECRET || 'test-secret-key',
      { expiresIn: '1d' }
    );
  }

  formatUserResponse(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      access_type: user.access_type,
      created_at: user.created_at,
      last_access: user.last_access
    };
  }

  async login(email, password) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    console.log('Checking password for user:', email);
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password is valid:', isValidPassword);

    if (!isValidPassword) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    await this.updateLastAccess(user);

    return {
      token: this.generateToken(user),
      user: this.formatUserResponse(user)
    };
  }
}

const authService = new AuthService();
module.exports = { authService };
