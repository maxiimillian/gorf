import { NextFunction, Response, Request } from 'express';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { badRequest } from './response';

export interface TokenRequest extends Request {
  token: string | JwtPayload;
}

function verifyToken(potentialToken: string): Promise<string | JwtPayload | null> {
  return new Promise(resolve => {
    jwt.verify(potentialToken, process.env.JWT_KEY, (err, decoded) => {
      if (err) resolve(null);
      else resolve(decoded);
    });
  });
}

// Decode the JWT and add the decoded information to the request
export async function parseJWT(req: TokenRequest, res: Response, next: NextFunction) {
  console.log(1);
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send({ error: 'Missing token' });

  const tokenData = await verifyToken(token);
  if (!tokenData) return badRequest(res, { message: 'Invalid Token' });

  req.token = tokenData;
  next();
}
