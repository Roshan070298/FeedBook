const express = require('express');
require('dotenv').config();

const User = require('./models/user');
const Post = require('./models/post');

const app = express();

const port = 3000;
const cors = require('cors');

const sequelize = require('./db');

const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const loginRouter = require('./routes/login');

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/login', loginRouter);

// Sync all models
sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
  });


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });


