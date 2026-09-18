import bcrypt from 'bcryptjs';
import { ENV } from '../config/env.config';

/**
 * Gera um hash criptográfico seguro para a senha informada utilizando bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(ENV.BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Compara uma senha em texto plano com o hash criptografado armazenado.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
