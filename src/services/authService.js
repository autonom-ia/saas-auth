const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { mockedUsers } = require('../data/mockData');
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
        throw new Error('User model not initialized');
      }
      return await this.User.findOne({ where: { email } });
    } else {
      console.log('Using mocked data');
      return mockedUsers.find(user => user.email === email);
    }
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
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
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
