import { verify } from 'jsonwebtoken';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  verify(token, process.env.TOKEN || '1', (err, email) => {
    if (err) return res.sendStatus(403); 
    req.email = email;
    next();
  });
}

export default authenticateToken;