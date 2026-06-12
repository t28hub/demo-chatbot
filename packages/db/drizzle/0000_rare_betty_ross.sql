CREATE TABLE "chat" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" uuid PRIMARY KEY NOT NULL,
	"chat_id" uuid NOT NULL,
	"ordinal" integer NOT NULL,
	"role" varchar NOT NULL,
	"parts" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "message_chat_id_ordinal_unique" UNIQUE("chat_id","ordinal")
);
--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;