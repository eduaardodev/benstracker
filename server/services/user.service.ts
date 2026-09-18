import { db, initializeDatabase } from '../db/database';
import { users, UserSelect } from '../db/schema';
import { eq, or, sql } from 'drizzle-orm';
import { User, SafeUser, RegisterDTO } from '../types/auth.types';
import { hashPassword } from '../utils/password.utils';

// Inicialização das tabelas mapeadas pelo ORM
initializeDatabase();

function mapEntityToUser(entity: UserSelect): User {
  return {
    id: entity.id,
    name: entity.name,
    matricula: entity.matricula,
    email: entity.email,
    department: entity.department,
    jobTitle: entity.jobTitle,
    role: entity.role,
    passwordHash: entity.passwordHash,
    createdAt: entity.createdAt,
    lastLoginAt: entity.lastLoginAt || undefined,
  };
}

class UserService {
  /**
   * Consulta usuário pelo identificador (e-mail ou matrícula funcional) via ORM.
   */
  public async findByIdentifier(identifier: string): Promise<User | undefined> {
    const clean = identifier.trim().toLowerCase();
    const rows = await db
      .select()
      .from(users)
      .where(
        or(
          eq(sql`LOWER(${users.email})`, clean),
          eq(sql`LOWER(${users.matricula})`, clean)
        )
      )
      .limit(1);

    return rows.length > 0 ? mapEntityToUser(rows[0]) : undefined;
  }

  /**
   * Consulta usuário pela chave primária via ORM.
   */
  public async findById(id: string): Promise<User | undefined> {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return rows.length > 0 ? mapEntityToUser(rows[0]) : undefined;
  }

  /**
   * Cadastra novo usuário utilizando método de persistência do ORM.
   */
  public async createUser(data: RegisterDTO): Promise<SafeUser> {
    const existing = (await this.findByIdentifier(data.email)) || (await this.findByIdentifier(data.matricula));
    if (existing) {
      throw new Error('Já existe um usuário cadastrado com este e-mail ou matrícula.');
    }

    const passwordHash = await hashPassword(data.password);
    const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const createdAt = new Date().toISOString();

    await db.insert(users).values({
      id,
      name: data.name.trim(),
      matricula: data.matricula.trim().toUpperCase(),
      email: data.email.trim().toLowerCase(),
      department: data.department.trim(),
      jobTitle: data.jobTitle.trim(),
      role: data.role || 'TECHNICIAN',
      passwordHash,
      createdAt,
    });

    return {
      id,
      name: data.name.trim(),
      matricula: data.matricula.trim().toUpperCase(),
      email: data.email.trim().toLowerCase(),
      department: data.department.trim(),
      jobTitle: data.jobTitle.trim(),
      role: data.role || 'TECHNICIAN',
      createdAt,
    };
  }

  /**
   * Atualização de timestamp de último acesso via ORM.
   */
  public async updateLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date().toISOString() })
      .where(eq(users.id, id));
  }

  /**
   * Atualização de senha via ORM.
   */
  public async updatePassword(id: string, newPasswordHash: string): Promise<void> {
    await db
      .update(users)
      .set({ passwordHash: newPasswordHash })
      .where(eq(users.id, id));
  }

  /**
   * Redefine a senha de um usuário através do ORM.
   */
  public async resetPassword(userId: string, newPassword = 'SenhaSimples2026'): Promise<SafeUser> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    const newHash = await hashPassword(newPassword);
    await this.updatePassword(userId, newHash);
    return this.toSafeUser(user);
  }

  /**
   * Consulta todos os usuários através do ORM.
   */
  public async getAllUsers(): Promise<SafeUser[]> {
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        matricula: users.matricula,
        email: users.email,
        department: users.department,
        jobTitle: users.jobTitle,
        role: users.role,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .orderBy(users.name);

    return rows.map((r) => ({
      ...r,
      lastLoginAt: r.lastLoginAt || undefined,
    }));
  }

  public toSafeUser(user: User): SafeUser {
    const { passwordHash: _hash, ...safeUser } = user;
    return safeUser;
  }
}

export const userService = new UserService();
