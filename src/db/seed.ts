// src/db/seed.ts
import { db } from './index';
import { categorias, paises } from './schema';

async function seed() {
  console.log('🌱 Iniciando seed...');

  // ─── CATEGORÍAS ───────────────────────────────────────────
  console.log('📂 Insertando categorías...');
  await db.insert(categorias).values([
    { nombre: 'Criptomonedas',      slug: 'cripto'              },
    { nombre: 'Trading',            slug: 'trading'             },
    { nombre: 'Bolsa de Valores',   slug: 'bolsa'               },
    { nombre: 'Economía',           slug: 'economia'            },
    { nombre: 'Forex',              slug: 'forex'               },
    { nombre: 'Finanzas Personales',slug: 'finanzas-personales' },
    { nombre: 'Fintech',            slug: 'fintech'             },
    { nombre: 'Impuestos',          slug: 'impuestos'           },
    { nombre: 'Inversiones',        slug: 'inversiones'         },
  ]).onConflictDoNothing();

  // ─── TODOS LOS PAÍSES DE HABLA HISPANA ────────────────────
  console.log('🌎 Insertando países...');
  await db.insert(paises).values([

    { nombre: 'Global',               codigo: 'global' },

    // América del Sur
    { nombre: 'Argentina',            codigo: 'ar' },
    { nombre: 'Bolivia',              codigo: 'bo' },
    { nombre: 'Brasil',               codigo: 'br' },
    { nombre: 'Chile',                codigo: 'cl' },
    { nombre: 'Colombia',             codigo: 'co' },
    { nombre: 'Ecuador',              codigo: 'ec' },
    { nombre: 'Paraguay',             codigo: 'py' },
    { nombre: 'Perú',                 codigo: 'pe' },
    { nombre: 'Uruguay',              codigo: 'uy' },
    { nombre: 'Venezuela',            codigo: 've' },

    // América Central
    { nombre: 'Belice',               codigo: 'bz' },
    { nombre: 'Costa Rica',           codigo: 'cr' },
    { nombre: 'El Salvador',          codigo: 'sv' },
    { nombre: 'Guatemala',            codigo: 'gt' },
    { nombre: 'Honduras',             codigo: 'hn' },
    { nombre: 'Nicaragua',            codigo: 'ni' },
    { nombre: 'Panamá',               codigo: 'pa' },

    // América del Norte
    { nombre: 'México',               codigo: 'mx' },
    { nombre: 'Cuba',                 codigo: 'cu' },

    // Caribe
    { nombre: 'República Dominicana', codigo: 'do' },
    { nombre: 'Puerto Rico',          codigo: 'pr' },

    // Norteamérica
    { nombre: 'Estados Unidos',       codigo: 'us' },
    { nombre: 'Canadá',               codigo: 'ca' },

    // Europa
    { nombre: 'España',               codigo: 'es' },
    { nombre: 'Andorra',              codigo: 'ad' },
    { nombre: 'Francia',              codigo: 'fr' },
    { nombre: 'Alemania',             codigo: 'de' },
    { nombre: 'Italia',               codigo: 'it' },
    { nombre: 'Reino Unido',          codigo: 'gb' },
    { nombre: 'Países Bajos',         codigo: 'nl' },
    { nombre: 'Suiza',                codigo: 'ch' },
    { nombre: 'Portugal',             codigo: 'pt' },

    // África
    { nombre: 'Guinea Ecuatorial',    codigo: 'gq' },
    { nombre: 'Marruecos',            codigo: 'ma' },

    // Oceanía / Asia
    { nombre: 'Filipinas',            codigo: 'ph' },
    { nombre: 'Australia',            codigo: 'au' },

  ]).onConflictDoNothing();

  console.log('✅ Seed completado');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});

