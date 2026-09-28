CREATE TABLE "department" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"faculty_id" uuid NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(180) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "resource" ADD COLUMN "department_id" uuid;
--> statement-breakpoint
ALTER TABLE "department" ADD CONSTRAINT "department_faculty_id_faculty_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "resource" ADD CONSTRAINT "resource_department_id_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "department_faculty_slug_idx" ON "department" USING btree ("faculty_id","slug");
--> statement-breakpoint
CREATE INDEX "department_faculty_order_idx" ON "department" USING btree ("faculty_id","sort_order");
--> statement-breakpoint
CREATE INDEX "resource_department_status_idx" ON "resource" USING btree ("department_id","status");
