import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  // accept user as a parameter and return thr generated token.
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};
