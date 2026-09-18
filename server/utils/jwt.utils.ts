import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '../types/auth.types';
import { ENV } from '../config/env.config';

/**
 * Gera um token JWT assinado com os dados e perfil de autorização do usuário.
 */
export function generateToken(payload: AuthTokenPayload, expiresIn: string = ENV.JWT_EXPIRES_IN): string {
  return jwt.sign({ ...payload }, ENV.JWT_SECRET, {
    expiresIn,
  } as jwt.SignOptions);
}

/**
 * Decodifica e valida a assinatura criptográfica do token JWT.
 */
export function verifyToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, ENV.JWT_SECRET) as jwt.JwtPayload & AuthTokenPayload;
  return {
    userId: decoded.userId,
    email: decoded.email,
    matricula: decoded.matricula,
    name: decoded.name,
    role: decoded.role,
  };
}
