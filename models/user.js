const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = require('../db');
const { ROLE_TYPES } = require('../config/enums');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { 
    type: DataTypes.ENUM, 
    values: Object.values(ROLE_TYPES), 
    allowNull: false 
  },
}, { timestamps: true, 
  hooks: {
    beforeCreate: async (user) => {
      if (user.password)  {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt)
    }
  },
  beforeUpdate: async (user) => {
    if (user.password)  {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)
  }
}
  },
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: {
      attributes: {}
    }
  },
   toJSON: {
    exclude: ['password']
   }
}, 
  );

// Instance method to compare password
User.prototype.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = User;
