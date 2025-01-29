const { mockedUsers } = require('./mockData.js');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.access_type = data.access_type;
    this.created_at = data.created_at;
    this.last_access = data.last_access;
  }

  async checkPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  async save() {
    if (this.id) {
      // Update
      const index = mockedUsers.findIndex(user => user.id === this.id);
      if (index !== -1) {
        mockedUsers[index] = {
          ...mockedUsers[index],
          ...this
        };
      }
    } else {
      // Create
      this.id = generateId();
      this.created_at = new Date().toISOString();
      this.last_access = new Date().toISOString();
      mockedUsers.push(this);
    }
    return this;
  }
}

class UserModel {
  static async findOne(where = {}) {
    if (where.email) {
      const user = mockedUsers.find(u => u.email === where.email);
      return user ? new User(user) : null;
    }
    return null;
  }

  static async create(data) {
    const user = {
      ...data,
      password: bcrypt.hashSync(data.password, 10)
    };
    const savedUser = new User(user).save();
    return savedUser;
  }
}

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = {
  User,
  UserModel
};
