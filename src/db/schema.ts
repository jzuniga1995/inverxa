// src/db/schema.ts
import { pgTable, serial, text, timestamp, boolean, integer, varchar, index, uniqueIndex } from 'drizzle-orm/pg-core';

// ─── CATEGORÍAS ───────────────────────────────────────────────
export const categorias = pgTable('categorias', {
  id:     serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  slug:   varchar('slug',   { length: 100 }).notNull().unique(),
});

// ─── PAÍSES ───────────────────────────────────────────────────
export const paises = pgTable('paises', {
  id:     serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  codigo: varchar('codigo', { length: 10 }).notNull().unique(),
});

// ─── ARTÍCULOS ────────────────────────────────────────────────
export const articulos = pgTable('articulos', {
  id:           serial('id').primaryKey(),
  titulo:       text('titulo').notNull(),
  slug:         varchar('slug', { length: 255 }).notNull().unique(),
  resumen:      text('resumen'),
  contenido:    text('contenido').notNull(),
  imagen:       text('imagen'),
  categoriaId:  integer('categoria_id').references(() => categorias.id),
  paisId:       integer('pais_id').references(() => paises.id),
  destacado:    boolean('destacado').default(false),
  publicado:    boolean('publicado').default(false),
  creadoEn:     timestamp('creado_en').defaultNow(),
  actualizadoEn: timestamp('actualizado_en').defaultNow(),
}, (table) => ({
  slugIdx:               uniqueIndex('articulos_slug_idx').on(table.slug),
  publicadoIdx:          index('articulos_publicado_idx').on(table.publicado),
  categoriaIdIdx:        index('articulos_categoria_id_idx').on(table.categoriaId),
  paisIdIdx:             index('articulos_pais_id_idx').on(table.paisId),
  creadoEnIdx:           index('articulos_creado_en_idx').on(table.creadoEn),
  destacadoPublicadoIdx: index('articulos_destacado_publicado_idx').on(table.destacado, table.publicado),
}));

// ─── TIPOS TYPESCRIPT ─────────────────────────────────────────
export type Articulo      = typeof articulos.$inferSelect;
export type NuevoArticulo = typeof articulos.$inferInsert;
export type Categoria     = typeof categorias.$inferSelect;
export type Pais          = typeof paises.$inferSelect;

