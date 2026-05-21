import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'blogsphere_super_secret_jwt_key_2026_x93f', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export default generateToken;
