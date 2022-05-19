import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
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

export const isAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const token = authorization.slice(7);
    jwt.verify(token, process.env.JWT_SECRET, function (err, decode) {
      if (err) {
        res.status(403).send('Unauthorised');
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(403).send('Forbidden, No Token');
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Token' });
  }
};
