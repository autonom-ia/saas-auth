const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const defineUser = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    access_type: {
      type: DataTypes.ENUM('A', 'U'),
      allowNull: false,
      defaultValue: 'U'
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    last_access: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'saas_user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  User.prototype.checkPassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};

module.exports = {
  defineUser
};