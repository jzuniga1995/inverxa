// src/db/seed-articulo.ts
import { db } from './index';
import { articulos } from './schema';

async function seedArticulo() {
  console.log('📝 Insertando artículo de muestra...');

  await db.insert(articulos).values({
    titulo: 'Bitcoin supera los $100,000 por primera vez en su historia',
    slug: 'bitcoin-supera-100000-primera-vez-historia',
    resumen: 'El activo digital más grande del mundo alcanzó un nuevo máximo histórico impulsado por la aprobación de los ETFs spot en Estados Unidos y la creciente adopción institucional.',
    contenido: `
      <p>Bitcoin escribió un nuevo capítulo en su historia este miércoles al superar por primera vez la barrera psicológica de los <strong>$100,000 dólares</strong>, consolidando su posición como el activo de mayor rendimiento de la última década.</p>

      <h2>¿Qué impulsó el precio?</h2>

      <p>Varios factores convergieron para llevar a BTC a este hito histórico. En primer lugar, la aprobación de los <strong>ETFs de Bitcoin al contado</strong> por parte de la SEC estadounidense abrió las puertas a billones de dólares en capital institucional que antes no podía acceder directamente al mercado cripto.</p>

      <p>Por otro lado, el reciente <strong>halving de abril de 2024</strong> redujo la emisión de nuevos bitcoins a la mitad, disminuyendo la presión vendedora de los mineros mientras la demanda seguía en aumento.</p>

      <h2>Reacción del mercado latinoamericano</h2>

      <p>En países como Argentina y Venezuela, donde la inflación ha erosionado el poder adquisitivo de las monedas locales, Bitcoin ya era visto como una reserva de valor antes de este hito. Con el cruce de los $100K, el interés se disparó aún más.</p>

      <blockquote>
        "Para muchos latinoamericanos, Bitcoin no es especulación — es una herramienta de supervivencia financiera." — Analista de mercados cripto
      </blockquote>

      <p>En México, Colombia y Chile, los exchanges reportaron un aumento de hasta un <strong>40% en nuevos registros</strong> durante las 48 horas previas al hito.</p>

      <h2>¿Qué sigue para Bitcoin?</h2>

      <p>Los analistas técnicos apuntan a varios escenarios posibles:</p>

      <ul>
        <li>Consolidación entre $95,000 y $105,000 en el corto plazo</li>
        <li>Posible corrección del 15-20% antes de continuar al alza</li>
        <li>Objetivo de $150,000 para finales de 2025 según modelos Stock-to-Flow</li>
      </ul>

      <p>Lo que sí es claro es que el cruce de los seis dígitos representa un cambio de narrativa: Bitcoin dejó de ser un experimento tecnológico para convertirse en un <strong>activo de reserva global</strong>.</p>

      <h2>¿Debo comprar ahora?</h2>

      <p>Esta es la pregunta que más se repite en foros y redes sociales. La respuesta corta es: <strong>depende de tu perfil de riesgo y horizonte temporal</strong>. Invertir en máximos históricos puede ser rentable si tienes visión de largo plazo, pero también conlleva el riesgo de una corrección significativa en el corto plazo.</p>

      <p>Como siempre, recuerda que este artículo es informativo y no constituye asesoría financiera. Consulta con un profesional antes de tomar decisiones de inversión.</p>
    `,
    imagen: null,        // cuando tengas Bunny.net pones la URL aquí
    categoriaId: 1,      // 1 = Criptomonedas (según el seed de categorías)
    paisId: 1,           // 1 = Global
    destacado: true,
    publicado: true,
  }).onConflictDoNothing();

  console.log('✅ Artículo insertado');
  process.exit(0);
}

seedArticulo().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
