const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user'); 

const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  authorId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Establish relationship
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });

module.exports = Post;
