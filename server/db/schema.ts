import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Definições dos modelos de entidades gerenciados pelo ORM (Drizzle ORM).
 * Acesso e integridade tipada em tempo de compilação e execução.
 */

// Tabela de Usuários e Perfis de Acesso
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  matricula: text('matricula').notNull().unique(),
  email: text('email').notNull().unique(),
  department: text('department').notNull(),
  jobTitle: text('job_title').notNull(),
  role: text('role', { enum: ['ADMIN', 'TECHNICIAN'] }).notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').notNull(),
  lastLoginAt: text('last_login_at'),
});

// Tabela de Bens Patrimoniais e Equipamentos
export const equipments = sqliteTable('equipments', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  tag: text('tag').notNull().unique(),
  serialNumber: text('serial_number').notNull(),
  brandModel: text('brand_model').notNull(),
  accessories: text('accessories').notNull(),
  conditionNotes: text('condition_notes'),
  checkoutDate: text('checkout_date').notNull(),
  responsibilityTermAccepted: integer('responsibility_term_accepted').notNull().default(1),
  status: text('status', { enum: ['Disponível', 'Em Uso', 'Recolhido', 'Em Manutenção'] }).notNull(),
  assignedToUser: text('assigned_to_user'),
  assignedLocation: text('assigned_location'),
  createdAt: text('created_at').notNull(),
});

// Tabela de Histórico de Movimentações e Substituições
export const movements = sqliteTable('movements', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  oldTag: text('old_tag').notNull(),
  oldSerialNumber: text('old_serial_number').notNull(),
  oldCondition: text('old_condition').notNull(),
  oldDestination: text('old_destination').notNull(),
  newTag: text('new_tag').notNull(),
  newSerialNumber: text('new_serial_number').notNull(),
  newBrandModel: text('new_brand_model').notNull(),
  newHostname: text('new_hostname'),
  userName: text('user_name').notNull(),
  userRegistration: text('user_registration').notNull(),
  sectorLocation: text('sector_location').notNull(),
  techResponsible: text('tech_responsible').notNull(),
  techName: text('tech_name').notNull(),
  signatureData: text('signature_data'),
  observation: text('observation'),
  createdAt: text('created_at').notNull(),
});

export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export type EquipmentSelect = typeof equipments.$inferSelect;
export type EquipmentInsert = typeof equipments.$inferInsert;

export type MovementSelect = typeof movements.$inferSelect;
export type MovementInsert = typeof movements.$inferInsert;
