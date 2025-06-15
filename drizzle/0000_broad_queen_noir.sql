CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_categories" (
	"activity_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "activity_categories_activity_id_category_id_pk" PRIMARY KEY("activity_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "activity_media" (
	"activity_id" integer NOT NULL,
	"media_id" integer NOT NULL,
	CONSTRAINT "activity_media_activity_id_media_id_pk" PRIMARY KEY("activity_id","media_id")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category_media" (
	"category_id" integer NOT NULL,
	"media_id" integer NOT NULL,
	CONSTRAINT "category_media_category_id_media_id_pk" PRIMARY KEY("category_id","media_id")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"link" varchar(2048) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_categories" ADD CONSTRAINT "activity_categories_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_categories" ADD CONSTRAINT "activity_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_media" ADD CONSTRAINT "activity_media_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_media" ADD CONSTRAINT "activity_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_media" ADD CONSTRAINT "category_media_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_media" ADD CONSTRAINT "category_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;