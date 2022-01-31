import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface IPayload {
  id: string;
  email: string;
  created: Date;
  iat: number;
}

const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json({ message: 'Para acessar esse endpoint é preciso estar logado' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { id: usuarioId }: { id: String } = jwt
      .verify(token, String(process.env.JWT_SECRET)) as IPayload;
    req.usuario = String(usuarioId);

    return next();
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
};

export default ensureAuthenticated;
