CREATE TABLE "articulos" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"resumen" text,
	"contenido" text NOT NULL,
	"imagen" text,
	"categoria_id" integer,
	"pais_id" integer,
	"destacado" boolean DEFAULT false,
	"publicado" boolean DEFAULT false,
	"creado_en" timestamp DEFAULT now(),
	"actualizado_en" timestamp DEFAULT now(),
	CONSTRAINT "articulos_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categorias" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	CONSTRAINT "categorias_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "paises" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"codigo" varchar(10) NOT NULL,
	CONSTRAINT "paises_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"pais" text,
	"created_at" timestamp DEFAULT now(),
	"active" boolean DEFAULT true,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "articulos" ADD CONSTRAINT "articulos_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articulos" ADD CONSTRAINT "articulos_pais_id_paises_id_fk" FOREIGN KEY ("pais_id") REFERENCES "public"."paises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "articulos_slug_idx" ON "articulos" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "articulos_publicado_idx" ON "articulos" USING btree ("publicado");--> statement-breakpoint
CREATE INDEX "articulos_categoria_id_idx" ON "articulos" USING btree ("categoria_id");--> statement-breakpoint
CREATE INDEX "articulos_pais_id_idx" ON "articulos" USING btree ("pais_id");--> statement-breakpoint
CREATE INDEX "articulos_creado_en_idx" ON "articulos" USING btree ("creado_en");--> statement-breakpoint
CREATE INDEX "articulos_destacado_publicado_idx" ON "articulos" USING btree ("destacado","publicado");