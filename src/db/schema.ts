// src/db/schema.ts
import { pgTable, serial, text, timestamp, boolean, integer, varchar } from 'drizzle-orm/pg-core';

// ─── CATEGORÍAS ───────────────────────────────────────────────
export const categorias = pgTable('categorias', {
  id:     serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(), // "Cripto", "Trading", etc.
  slug:   varchar('slug',   { length: 100 }).notNull().unique(), // "cripto", "trading"
});

// ─── PAÍSES ───────────────────────────────────────────────────
export const paises = pgTable('paises', {
  id:     serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(), // "México"
  codigo: varchar('codigo', { length: 10 }).notNull().unique(), // "mx", "global"
});

// ─── ARTÍCULOS ────────────────────────────────────────────────
export const articulos = pgTable('articulos', {
  id:          serial('id').primaryKey(),
  titulo:      text('titulo').notNull(),
  slug:        varchar('slug', { length: 255 }).notNull().unique(),
  resumen:     text('resumen'),                  // texto corto para cards
  contenido:   text('contenido').notNull(),      // HTML o Markdown del artículo
  imagen:      text('imagen'),                   // URL de imagen (Bunny.net)
  categoriaId: integer('categoria_id').references(() => categorias.id),
  paisId:      integer('pais_id').references(() => paises.id), // null = Global
  destacado:   boolean('destacado').default(false),
  publicado:   boolean('publicado').default(false),
  creadoEn:    timestamp('creado_en').defaultNow(),
  actualizadoEn: timestamp('actualizado_en').defaultNow(),
});

// ─── TIPOS TYPESCRIPT ─────────────────────────────────────────
export type Articulo    = typeof articulos.$inferSelect;
export type NuevoArticulo = typeof articulos.$inferInsert;
export type Categoria   = typeof categorias.$inferSelect;
export type Pais        = typeof paises.$inferSelect;

