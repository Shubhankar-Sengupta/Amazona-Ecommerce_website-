import express from 'express';
import User from '../models/User.js';
import bcyrpt from 'bcryptjs';
import { generateToken, isAdmin } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../utils.js';
import bcrypt from 'bcryptjs';

const userRouter = express.Router();

// route for fetching all users from
userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});

    if (users) {
      res.send(users);
    } else {
      res.send({ message: 'No users found' });
    }
  })
);

// route for getting the user by /:id
userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

// to update the user profile.
userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const { id } = req.user;
    const user = await User.findOne({ id });

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;

      // code stops here to execute.
      if (password) {
        user.password = bcrypt.hashSync(password, 8);
      }

      const updatedUser = await user.save();

      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'Failed to update try again.' });
    }
  })
);

// route for updating the user by /:id
userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, isAdmin } = req.body;

    const user = await User.findById(id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.isAdmin = Boolean(isAdmin);
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

// route for sign-in.
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      if (bcyrpt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });

        return;
      }
      // finished with the job and we return from here.
    }

    res.status(401).send({ message: 'Invalid email or password' });
  })
);

// route for signup.
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = new User({
      name,
      email,
      password: bcyrpt.hashSync(password),
    });

    await user.save();

    // send it to the frontend of amazona
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

export default userRouter;
