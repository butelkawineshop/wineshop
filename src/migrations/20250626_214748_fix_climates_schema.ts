import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_stock_reservations_status" AS ENUM('active', 'expired', 'completed');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');
  CREATE TYPE "public"."enum_orders_payment_method" AS ENUM('credit_card', 'paypal', 'bank_transfer', 'pay_in_store');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');
  CREATE TYPE "public"."enum_wines_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__wines_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__wines_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_wine_variants_size" AS ENUM('187', '375', '500', '750', '1500', '3000', '6000');
  CREATE TYPE "public"."enum_wine_variants_serving_temp" AS ENUM('6-8', '8-10', '10-12', '12-14', '14-16', '16-18');
  CREATE TYPE "public"."enum_wine_variants_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__wine_variants_v_version_size" AS ENUM('187', '375', '500', '750', '1500', '3000', '6000');
  CREATE TYPE "public"."enum__wine_variants_v_version_serving_temp" AS ENUM('6-8', '8-10', '10-12', '12-14', '14-16', '16-18');
  CREATE TYPE "public"."enum__wine_variants_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__wine_variants_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_wineries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__wineries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__wineries_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_regions_price_range" AS ENUM('8-12', '12-18', '18-24', '24-30', '30-40', '40-50', '50-60');
  CREATE TYPE "public"."enum_regions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__regions_v_version_price_range" AS ENUM('8-12', '12-18', '18-24', '24-30', '30-40', '40-50', '50-60');
  CREATE TYPE "public"."enum__regions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__regions_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_wine_countries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__wine_countries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__wine_countries_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_grape_varieties_skin" AS ENUM('red', 'white');
  CREATE TYPE "public"."enum_grape_varieties_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__grape_varieties_v_version_skin" AS ENUM('red', 'white');
  CREATE TYPE "public"."enum__grape_varieties_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__grape_varieties_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_tags_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tags_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tags_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_aromas_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__aromas_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__aromas_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_adjectives_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__adjectives_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__adjectives_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_flavours_category" AS ENUM('fruit', 'floral', 'herbal', 'mineral', 'creamy', 'earth', 'wood', 'other');
  CREATE TYPE "public"."enum_flavours_color_group" AS ENUM('red', 'green', 'yellow', 'orange', 'blue', 'black', 'white');
  CREATE TYPE "public"."enum_flavours_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__flavours_v_version_category" AS ENUM('fruit', 'floral', 'herbal', 'mineral', 'creamy', 'earth', 'wood', 'other');
  CREATE TYPE "public"."enum__flavours_v_version_color_group" AS ENUM('red', 'green', 'yellow', 'orange', 'blue', 'black', 'white');
  CREATE TYPE "public"."enum__flavours_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__flavours_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_styles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__styles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__styles_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_climates_climate" AS ENUM('desert', 'maritime', 'mediterranean', 'continental', 'alpine');
  CREATE TYPE "public"."enum_climates_climate_temperature" AS ENUM('cool', 'moderate', 'warm', 'hot');
  CREATE TYPE "public"."enum_climates_climate_conditions_diurnal_range" AS ENUM('low', 'medium', 'high');
  CREATE TYPE "public"."enum_climates_climate_conditions_humidity" AS ENUM('dry', 'moderate', 'humid');
  CREATE TYPE "public"."enum_climates_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__climates_v_version_climate" AS ENUM('desert', 'maritime', 'mediterranean', 'continental', 'alpine');
  CREATE TYPE "public"."enum__climates_v_version_climate_temperature" AS ENUM('cool', 'moderate', 'warm', 'hot');
  CREATE TYPE "public"."enum__climates_v_version_climate_conditions_diurnal_range" AS ENUM('low', 'medium', 'high');
  CREATE TYPE "public"."enum__climates_v_version_climate_conditions_humidity" AS ENUM('dry', 'moderate', 'humid');
  CREATE TYPE "public"."enum__climates_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__climates_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_moods_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__moods_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__moods_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_dishes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__dishes_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__dishes_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_flat_wine_variants_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__flat_wine_variants_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__flat_wine_variants_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'syncFlatWineVariant', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_workflow_slug" AS ENUM('queueAllFlatWineVariants');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'syncFlatWineVariant', 'schedulePublish');
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"_verified" boolean,
  	"_verificationtoken" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"cloudflare_id" varchar,
  	"original_filename" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "invoices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "active_carts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"wine_variant_id" integer NOT NULL,
  	"quantity" numeric NOT NULL,
  	"added_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "active_carts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer,
  	"session_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "saved_carts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"wine_variant_id" integer NOT NULL,
  	"quantity" numeric NOT NULL,
  	"added_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "saved_carts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"user_id" integer NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "shared_carts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"wine_variant_id" integer NOT NULL,
  	"quantity" numeric NOT NULL,
  	"added_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "shared_carts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"share_id" varchar NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "stock_reservations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant_id" integer NOT NULL,
  	"quantity" numeric NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"status" "enum_stock_reservations_status" DEFAULT 'active' NOT NULL,
  	"order_id" integer,
  	"cart_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant_id" integer NOT NULL,
  	"quantity" numeric NOT NULL,
  	"price" numeric NOT NULL,
  	"reservation_id" integer NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"customer_id" integer,
  	"session_id" varchar,
  	"status" "enum_orders_status" DEFAULT 'pending' NOT NULL,
  	"subtotal" numeric NOT NULL,
  	"shipping" numeric NOT NULL,
  	"tax" numeric NOT NULL,
  	"total" numeric NOT NULL,
  	"shipping_address_first_name" varchar NOT NULL,
  	"shipping_address_last_name" varchar NOT NULL,
  	"shipping_address_address1" varchar NOT NULL,
  	"shipping_address_address2" varchar,
  	"shipping_address_city" varchar NOT NULL,
  	"shipping_address_postal_code" varchar NOT NULL,
  	"shipping_address_country" varchar NOT NULL,
  	"shipping_address_phone" varchar NOT NULL,
  	"billing_address_first_name" varchar NOT NULL,
  	"billing_address_last_name" varchar NOT NULL,
  	"billing_address_address1" varchar NOT NULL,
  	"billing_address_address2" varchar,
  	"billing_address_city" varchar NOT NULL,
  	"billing_address_postal_code" varchar NOT NULL,
  	"billing_address_country" varchar NOT NULL,
  	"billing_address_phone" varchar NOT NULL,
  	"payment_method" "enum_orders_payment_method" NOT NULL,
  	"payment_status" "enum_orders_payment_status" DEFAULT 'pending' NOT NULL,
  	"payment_intent_id" varchar,
  	"notes" varchar,
  	"tracking_number" varchar,
  	"invoice_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "wines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"winery_id" integer,
  	"title" varchar,
  	"region_id" integer,
  	"style_id" integer,
  	"seo_manual_override" boolean,
  	"seo_image" varchar,
  	"seo_structured_data" jsonb,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_wines_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "wines_locales" (
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "wines_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_wines_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_winery_id" integer,
  	"version_title" varchar,
  	"version_region_id" integer,
  	"version_style_id" integer,
  	"version_seo_manual_override" boolean,
  	"version_seo_image" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__wines_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__wines_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_wines_v_locales" (
  	"version_description" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_wines_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "wine_variants_grape_varieties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variety_id" integer,
  	"percentage" numeric
  );
  
  CREATE TABLE "wine_variants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"wine_id" integer,
  	"size" "enum_wine_variants_size",
  	"vintage" varchar,
  	"sku" varchar,
  	"price" numeric,
  	"stock_on_hand" numeric DEFAULT 0,
  	"can_backorder" boolean DEFAULT true,
  	"max_backorder_quantity" numeric DEFAULT 100,
  	"serving_temp" "enum_wine_variants_serving_temp",
  	"decanting" boolean DEFAULT false,
  	"tasting_notes_dry" numeric,
  	"tasting_notes_ripe" numeric,
  	"tasting_notes_creamy" numeric,
  	"tasting_notes_oaky" numeric,
  	"tasting_notes_complex" numeric,
  	"tasting_notes_light" numeric,
  	"tasting_notes_smooth" numeric,
  	"tasting_notes_youthful" numeric,
  	"tasting_notes_energetic" numeric,
  	"tasting_notes_alcohol" numeric,
  	"seo_manual_override" boolean,
  	"seo_image" varchar,
  	"seo_structured_data" jsonb,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_wine_variants_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "wine_variants_locales" (
  	"tasting_profile" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "wine_variants_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dishes_id" integer,
  	"aromas_id" integer,
  	"tags_id" integer,
  	"moods_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_wine_variants_v_version_grape_varieties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variety_id" integer,
  	"percentage" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_wine_variants_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_wine_id" integer,
  	"version_size" "enum__wine_variants_v_version_size",
  	"version_vintage" varchar,
  	"version_sku" varchar,
  	"version_price" numeric,
  	"version_stock_on_hand" numeric DEFAULT 0,
  	"version_can_backorder" boolean DEFAULT true,
  	"version_max_backorder_quantity" numeric DEFAULT 100,
  	"version_serving_temp" "enum__wine_variants_v_version_serving_temp",
  	"version_decanting" boolean DEFAULT false,
  	"version_tasting_notes_dry" numeric,
  	"version_tasting_notes_ripe" numeric,
  	"version_tasting_notes_creamy" numeric,
  	"version_tasting_notes_oaky" numeric,
  	"version_tasting_notes_complex" numeric,
  	"version_tasting_notes_light" numeric,
  	"version_tasting_notes_smooth" numeric,
  	"version_tasting_notes_youthful" numeric,
  	"version_tasting_notes_energetic" numeric,
  	"version_tasting_notes_alcohol" numeric,
  	"version_seo_manual_override" boolean,
  	"version_seo_image" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__wine_variants_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__wine_variants_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_wine_variants_v_locales" (
  	"version_tasting_profile" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_wine_variants_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dishes_id" integer,
  	"aromas_id" integer,
  	"tags_id" integer,
  	"moods_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "wineries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"winery_code" varchar,
  	"social_instagram" varchar,
  	"social_website" varchar,
  	"seo_manual_override" boolean,
  	"seo_image" varchar,
  	"seo_structured_data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_wineries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "wineries_locales" (
  	"slug" varchar,
  	"description" varchar,
  	"why_cool" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "wineries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"wineries_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_wineries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_winery_code" varchar,
  	"version_social_instagram" varchar,
  	"version_social_website" varchar,
  	"version_seo_manual_override" boolean,
  	"version_seo_image" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__wineries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__wineries_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_wineries_v_locales" (
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_why_cool" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_wineries_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"wineries_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "regions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"price_range" "enum_regions_price_range",
  	"climate_id" integer,
  	"country_id" integer,
  	"seo_manual_override" boolean,
  	"seo_image" varchar,
  	"seo_structured_data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_regions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "regions_locales" (
  	"slug" varchar,
  	"why_cool" varchar,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "regions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"regions_id" integer,
  	"grape_varieties_id" integer,
  	"wineries_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_regions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_price_range" "enum__regions_v_version_price_range",
  	"version_climate_id" integer,
  	"version_country_id" integer,
  	"version_seo_manual_override" boolean,
  	"version_seo_image" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__regions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__regions_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_regions_v_locales" (
  	"version_slug" varchar,
  	"version_why_cool" varchar,
  	"version_description" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_regions_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"regions_id" integer,
  	"grape_varieties_id" integer,
  	"wineries_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "wine_countries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"statistics_land_area" numeric,
  	"statistics_wineries_count" numeric,
  	"seo_manual_override" boolean,
  	"seo_image" varchar,
  	"seo_structured_data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_wine_countries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "wine_countries_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"why_cool" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "wine_countries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"regions_id" integer,
  	"grape_varieties_id" integer,
  	"wineries_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_wine_countries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_statistics_land_area" numeric,
  	"version_statistics_wineries_count" numeric,
  	"version_seo_manual_override" boolean,
  	"version_seo_image" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__wine_countries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__wine_countries_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_wine_countries_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_why_cool" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_wine_countries_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"regions_id" integer,
  	"grape_varieties_id" integer,
  	"wineries_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "grape_varieties_synonyms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "grape_varieties" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"skin" "enum_grape_varieties_skin",
  	"seo_manual_override" boolean,
  	"seo_image" varchar,
  	"seo_structured_data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_grape_varieties_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "grape_varieties_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"typical_style" varchar,
  	"why_cool" varchar,
  	"character" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "grape_varieties_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"aromas_id" integer,
  	"regions_id" integer,
  	"grape_varieties_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_grape_varieties_v_version_synonyms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_grape_varieties_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_skin" "enum__grape_varieties_v_version_skin",
  	"version_seo_manual_override" boolean,
  	"version_seo_image" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__grape_varieties_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__grape_varieties_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_grape_varieties_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_typical_style" varchar,
  	"version_why_cool" varchar,
  	"version_character" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_grape_varieties_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"aromas_id" integer,
  	"regions_id" integer,
  	"grape_varieties_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_manual_override" boolean,
  	"seo_image" varchar,
  	"seo_structured_data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_tags_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "tags_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tags_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_tags_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_seo_manual_override" boolean,
  	"version_seo_image" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__tags_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__tags_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_tags_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_tags_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "aromas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"adjective_id" integer,
  	"flavour_id" integer,
  	"seo_manual_override" boolean,
  	"seo_image" varchar,
  	"seo_structured_data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_aromas_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "aromas_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "aromas_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_aromas_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_adjective_id" integer,
  	"version_flavour_id" integer,
  	"version_seo_manual_override" boolean,
  	"version_seo_image" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__aromas_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__aromas_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_aromas_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_aromas_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "adjectives" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_adjectives_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "adjectives_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_adjectives_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__adjectives_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__adjectives_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_adjectives_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "flavours" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_flavours_category",
  	"color_group" "enum_flavours_color_group",
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_flavours_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "flavours_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_flavours_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_category" "enum__flavours_v_version_category",
  	"version_color_group" "enum__flavours_v_version_color_group",
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__flavours_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__flavours_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_flavours_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "styles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_key" varchar,
  	"seo_manual_override" boolean,
  	"seo_image" varchar,
  	"seo_structured_data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_styles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "styles_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "styles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_styles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_icon_key" varchar,
  	"version_seo_manual_override" boolean,
  	"version_seo_image" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__styles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__styles_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_styles_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_styles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "climates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"climate" "enum_climates_climate",
  	"climate_temperature" "enum_climates_climate_temperature",
  	"climate_conditions_diurnal_range" "enum_climates_climate_conditions_diurnal_range",
  	"climate_conditions_humidity" "enum_climates_climate_conditions_humidity",
  	"seo_manual_override" boolean,
  	"seo_image" varchar,
  	"seo_structured_data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_climates_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "climates_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "climates_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"regions_id" integer,
  	"grape_varieties_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_climates_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_climate" "enum__climates_v_version_climate",
  	"version_climate_temperature" "enum__climates_v_version_climate_temperature",
  	"version_climate_conditions_diurnal_range" "enum__climates_v_version_climate_conditions_diurnal_range",
  	"version_climate_conditions_humidity" "enum__climates_v_version_climate_conditions_humidity",
  	"version_seo_manual_override" boolean,
  	"version_seo_image" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__climates_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__climates_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_climates_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_climates_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"regions_id" integer,
  	"grape_varieties_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "moods" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_manual_override" boolean,
  	"seo_image" varchar,
  	"seo_structured_data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_moods_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "moods_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "moods_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_moods_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_seo_manual_override" boolean,
  	"version_seo_image" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__moods_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__moods_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_moods_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_moods_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "dishes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_manual_override" boolean,
  	"seo_image" varchar,
  	"seo_structured_data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_dishes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "dishes_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "dishes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_dishes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_seo_manual_override" boolean,
  	"version_seo_image" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__dishes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__dishes_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_dishes_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_dishes_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "flat_wine_variants_related_wineries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "flat_wine_variants_related_regions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "flat_wine_variants_aromas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"title_en" varchar
  );
  
  CREATE TABLE "flat_wine_variants_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"title_en" varchar
  );
  
  CREATE TABLE "flat_wine_variants_moods" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"title_en" varchar
  );
  
  CREATE TABLE "flat_wine_variants_grape_varieties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"title_en" varchar,
  	"percentage" numeric
  );
  
  CREATE TABLE "flat_wine_variants_climates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"title_en" varchar
  );
  
  CREATE TABLE "flat_wine_variants_dishes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"title_en" varchar
  );
  
  CREATE TABLE "flat_wine_variants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"original_variant_id" integer,
  	"sku" varchar,
  	"wine_title" varchar,
  	"winery_title" varchar,
  	"winery_code" varchar,
  	"region_title" varchar,
  	"country_title" varchar,
  	"country_title_en" varchar,
  	"style_title" varchar,
  	"style_title_en" varchar,
  	"style_icon_key" varchar,
  	"style_slug" varchar,
  	"size" varchar,
  	"vintage" varchar,
  	"price" numeric,
  	"stock_on_hand" numeric,
  	"can_backorder" boolean,
  	"max_backorder_quantity" numeric,
  	"serving_temp" varchar,
  	"decanting" boolean,
  	"tasting_profile" varchar,
  	"description" varchar,
  	"description_en" varchar,
  	"tasting_notes_dry" numeric,
  	"tasting_notes_ripe" numeric,
  	"tasting_notes_creamy" numeric,
  	"tasting_notes_oaky" numeric,
  	"tasting_notes_complex" numeric,
  	"tasting_notes_light" numeric,
  	"tasting_notes_smooth" numeric,
  	"tasting_notes_youthful" numeric,
  	"tasting_notes_energetic" numeric,
  	"tasting_notes_alcohol" numeric,
  	"primary_image_url" varchar,
  	"slug" varchar,
  	"synced_at" timestamp(3) with time zone,
  	"is_published" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_flat_wine_variants_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_flat_wine_variants_v_version_related_wineries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_flat_wine_variants_v_version_related_regions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_flat_wine_variants_v_version_aromas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"title_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_flat_wine_variants_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"title_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_flat_wine_variants_v_version_moods" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"title_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_flat_wine_variants_v_version_grape_varieties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"title_en" varchar,
  	"_uuid" varchar,
  	"percentage" numeric
  );
  
  CREATE TABLE "_flat_wine_variants_v_version_climates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"title_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_flat_wine_variants_v_version_dishes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"title_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_flat_wine_variants_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_original_variant_id" integer,
  	"version_sku" varchar,
  	"version_wine_title" varchar,
  	"version_winery_title" varchar,
  	"version_winery_code" varchar,
  	"version_region_title" varchar,
  	"version_country_title" varchar,
  	"version_country_title_en" varchar,
  	"version_style_title" varchar,
  	"version_style_title_en" varchar,
  	"version_style_icon_key" varchar,
  	"version_style_slug" varchar,
  	"version_size" varchar,
  	"version_vintage" varchar,
  	"version_price" numeric,
  	"version_stock_on_hand" numeric,
  	"version_can_backorder" boolean,
  	"version_max_backorder_quantity" numeric,
  	"version_serving_temp" varchar,
  	"version_decanting" boolean,
  	"version_tasting_profile" varchar,
  	"version_description" varchar,
  	"version_description_en" varchar,
  	"version_tasting_notes_dry" numeric,
  	"version_tasting_notes_ripe" numeric,
  	"version_tasting_notes_creamy" numeric,
  	"version_tasting_notes_oaky" numeric,
  	"version_tasting_notes_complex" numeric,
  	"version_tasting_notes_light" numeric,
  	"version_tasting_notes_smooth" numeric,
  	"version_tasting_notes_youthful" numeric,
  	"version_tasting_notes_energetic" numeric,
  	"version_tasting_notes_alcohol" numeric,
  	"version_primary_image_url" varchar,
  	"version_slug" varchar,
  	"version_synced_at" timestamp(3) with time zone,
  	"version_is_published" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__flat_wine_variants_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__flat_wine_variants_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"workflow_slug" "enum_payload_jobs_workflow_slug",
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"customers_id" integer,
  	"media_id" integer,
  	"invoices_id" integer,
  	"active_carts_id" integer,
  	"saved_carts_id" integer,
  	"shared_carts_id" integer,
  	"stock_reservations_id" integer,
  	"orders_id" integer,
  	"wines_id" integer,
  	"wine_variants_id" integer,
  	"wineries_id" integer,
  	"regions_id" integer,
  	"wine_countries_id" integer,
  	"grape_varieties_id" integer,
  	"tags_id" integer,
  	"aromas_id" integer,
  	"adjectives_id" integer,
  	"flavours_id" integer,
  	"styles_id" integer,
  	"climates_id" integer,
  	"moods_id" integer,
  	"dishes_id" integer,
  	"flat_wine_variants_id" integer,
  	"payload_jobs_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"customers_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "active_carts_items" ADD CONSTRAINT "active_carts_items_wine_variant_id_wine_variants_id_fk" FOREIGN KEY ("wine_variant_id") REFERENCES "public"."wine_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "active_carts_items" ADD CONSTRAINT "active_carts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."active_carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "active_carts" ADD CONSTRAINT "active_carts_user_id_customers_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "saved_carts_items" ADD CONSTRAINT "saved_carts_items_wine_variant_id_wine_variants_id_fk" FOREIGN KEY ("wine_variant_id") REFERENCES "public"."wine_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "saved_carts_items" ADD CONSTRAINT "saved_carts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."saved_carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "saved_carts" ADD CONSTRAINT "saved_carts_user_id_customers_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_carts_items" ADD CONSTRAINT "shared_carts_items_wine_variant_id_wine_variants_id_fk" FOREIGN KEY ("wine_variant_id") REFERENCES "public"."wine_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_carts_items" ADD CONSTRAINT "shared_carts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_variant_id_wine_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."wine_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_cart_id_active_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."active_carts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_variant_id_wine_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."wine_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_reservation_id_stock_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."stock_reservations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_winery_id_wineries_id_fk" FOREIGN KEY ("winery_id") REFERENCES "public"."wineries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_style_id_styles_id_fk" FOREIGN KEY ("style_id") REFERENCES "public"."styles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines_locales" ADD CONSTRAINT "wines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."wines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wines_rels" ADD CONSTRAINT "wines_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."wines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wines_rels" ADD CONSTRAINT "wines_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wines_v" ADD CONSTRAINT "_wines_v_parent_id_wines_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."wines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_wines_v" ADD CONSTRAINT "_wines_v_version_winery_id_wineries_id_fk" FOREIGN KEY ("version_winery_id") REFERENCES "public"."wineries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_wines_v" ADD CONSTRAINT "_wines_v_version_region_id_regions_id_fk" FOREIGN KEY ("version_region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_wines_v" ADD CONSTRAINT "_wines_v_version_style_id_styles_id_fk" FOREIGN KEY ("version_style_id") REFERENCES "public"."styles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_wines_v_locales" ADD CONSTRAINT "_wines_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_wines_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wines_v_rels" ADD CONSTRAINT "_wines_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_wines_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wines_v_rels" ADD CONSTRAINT "_wines_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_variants_grape_varieties" ADD CONSTRAINT "wine_variants_grape_varieties_variety_id_grape_varieties_id_fk" FOREIGN KEY ("variety_id") REFERENCES "public"."grape_varieties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wine_variants_grape_varieties" ADD CONSTRAINT "wine_variants_grape_varieties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."wine_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_variants" ADD CONSTRAINT "wine_variants_wine_id_wines_id_fk" FOREIGN KEY ("wine_id") REFERENCES "public"."wines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wine_variants_locales" ADD CONSTRAINT "wine_variants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."wine_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_variants_rels" ADD CONSTRAINT "wine_variants_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."wine_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_variants_rels" ADD CONSTRAINT "wine_variants_rels_dishes_fk" FOREIGN KEY ("dishes_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_variants_rels" ADD CONSTRAINT "wine_variants_rels_aromas_fk" FOREIGN KEY ("aromas_id") REFERENCES "public"."aromas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_variants_rels" ADD CONSTRAINT "wine_variants_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_variants_rels" ADD CONSTRAINT "wine_variants_rels_moods_fk" FOREIGN KEY ("moods_id") REFERENCES "public"."moods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_variants_rels" ADD CONSTRAINT "wine_variants_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wine_variants_v_version_grape_varieties" ADD CONSTRAINT "_wine_variants_v_version_grape_varieties_variety_id_grape_varieties_id_fk" FOREIGN KEY ("variety_id") REFERENCES "public"."grape_varieties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_wine_variants_v_version_grape_varieties" ADD CONSTRAINT "_wine_variants_v_version_grape_varieties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_wine_variants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wine_variants_v" ADD CONSTRAINT "_wine_variants_v_parent_id_wine_variants_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."wine_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_wine_variants_v" ADD CONSTRAINT "_wine_variants_v_version_wine_id_wines_id_fk" FOREIGN KEY ("version_wine_id") REFERENCES "public"."wines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_wine_variants_v_locales" ADD CONSTRAINT "_wine_variants_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_wine_variants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wine_variants_v_rels" ADD CONSTRAINT "_wine_variants_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_wine_variants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wine_variants_v_rels" ADD CONSTRAINT "_wine_variants_v_rels_dishes_fk" FOREIGN KEY ("dishes_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wine_variants_v_rels" ADD CONSTRAINT "_wine_variants_v_rels_aromas_fk" FOREIGN KEY ("aromas_id") REFERENCES "public"."aromas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wine_variants_v_rels" ADD CONSTRAINT "_wine_variants_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wine_variants_v_rels" ADD CONSTRAINT "_wine_variants_v_rels_moods_fk" FOREIGN KEY ("moods_id") REFERENCES "public"."moods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wine_variants_v_rels" ADD CONSTRAINT "_wine_variants_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wineries_locales" ADD CONSTRAINT "wineries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."wineries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wineries_rels" ADD CONSTRAINT "wineries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."wineries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wineries_rels" ADD CONSTRAINT "wineries_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wineries_rels" ADD CONSTRAINT "wineries_rels_wineries_fk" FOREIGN KEY ("wineries_id") REFERENCES "public"."wineries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wineries_rels" ADD CONSTRAINT "wineries_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wineries_v" ADD CONSTRAINT "_wineries_v_parent_id_wineries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."wineries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_wineries_v_locales" ADD CONSTRAINT "_wineries_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_wineries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wineries_v_rels" ADD CONSTRAINT "_wineries_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_wineries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wineries_v_rels" ADD CONSTRAINT "_wineries_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wineries_v_rels" ADD CONSTRAINT "_wineries_v_rels_wineries_fk" FOREIGN KEY ("wineries_id") REFERENCES "public"."wineries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wineries_v_rels" ADD CONSTRAINT "_wineries_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regions" ADD CONSTRAINT "regions_climate_id_climates_id_fk" FOREIGN KEY ("climate_id") REFERENCES "public"."climates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "regions" ADD CONSTRAINT "regions_country_id_wine_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."wine_countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "regions_locales" ADD CONSTRAINT "regions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regions_rels" ADD CONSTRAINT "regions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regions_rels" ADD CONSTRAINT "regions_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regions_rels" ADD CONSTRAINT "regions_rels_grape_varieties_fk" FOREIGN KEY ("grape_varieties_id") REFERENCES "public"."grape_varieties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regions_rels" ADD CONSTRAINT "regions_rels_wineries_fk" FOREIGN KEY ("wineries_id") REFERENCES "public"."wineries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regions_rels" ADD CONSTRAINT "regions_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_regions_v" ADD CONSTRAINT "_regions_v_parent_id_regions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_regions_v" ADD CONSTRAINT "_regions_v_version_climate_id_climates_id_fk" FOREIGN KEY ("version_climate_id") REFERENCES "public"."climates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_regions_v" ADD CONSTRAINT "_regions_v_version_country_id_wine_countries_id_fk" FOREIGN KEY ("version_country_id") REFERENCES "public"."wine_countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_regions_v_locales" ADD CONSTRAINT "_regions_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_regions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_regions_v_rels" ADD CONSTRAINT "_regions_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_regions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_regions_v_rels" ADD CONSTRAINT "_regions_v_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_regions_v_rels" ADD CONSTRAINT "_regions_v_rels_grape_varieties_fk" FOREIGN KEY ("grape_varieties_id") REFERENCES "public"."grape_varieties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_regions_v_rels" ADD CONSTRAINT "_regions_v_rels_wineries_fk" FOREIGN KEY ("wineries_id") REFERENCES "public"."wineries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_regions_v_rels" ADD CONSTRAINT "_regions_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_countries_locales" ADD CONSTRAINT "wine_countries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."wine_countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_countries_rels" ADD CONSTRAINT "wine_countries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."wine_countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_countries_rels" ADD CONSTRAINT "wine_countries_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_countries_rels" ADD CONSTRAINT "wine_countries_rels_grape_varieties_fk" FOREIGN KEY ("grape_varieties_id") REFERENCES "public"."grape_varieties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_countries_rels" ADD CONSTRAINT "wine_countries_rels_wineries_fk" FOREIGN KEY ("wineries_id") REFERENCES "public"."wineries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_countries_rels" ADD CONSTRAINT "wine_countries_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wine_countries_v" ADD CONSTRAINT "_wine_countries_v_parent_id_wine_countries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."wine_countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_wine_countries_v_locales" ADD CONSTRAINT "_wine_countries_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_wine_countries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wine_countries_v_rels" ADD CONSTRAINT "_wine_countries_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_wine_countries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wine_countries_v_rels" ADD CONSTRAINT "_wine_countries_v_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wine_countries_v_rels" ADD CONSTRAINT "_wine_countries_v_rels_grape_varieties_fk" FOREIGN KEY ("grape_varieties_id") REFERENCES "public"."grape_varieties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wine_countries_v_rels" ADD CONSTRAINT "_wine_countries_v_rels_wineries_fk" FOREIGN KEY ("wineries_id") REFERENCES "public"."wineries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wine_countries_v_rels" ADD CONSTRAINT "_wine_countries_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "grape_varieties_synonyms" ADD CONSTRAINT "grape_varieties_synonyms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."grape_varieties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "grape_varieties_locales" ADD CONSTRAINT "grape_varieties_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."grape_varieties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "grape_varieties_rels" ADD CONSTRAINT "grape_varieties_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."grape_varieties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "grape_varieties_rels" ADD CONSTRAINT "grape_varieties_rels_aromas_fk" FOREIGN KEY ("aromas_id") REFERENCES "public"."aromas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "grape_varieties_rels" ADD CONSTRAINT "grape_varieties_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "grape_varieties_rels" ADD CONSTRAINT "grape_varieties_rels_grape_varieties_fk" FOREIGN KEY ("grape_varieties_id") REFERENCES "public"."grape_varieties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "grape_varieties_rels" ADD CONSTRAINT "grape_varieties_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_grape_varieties_v_version_synonyms" ADD CONSTRAINT "_grape_varieties_v_version_synonyms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_grape_varieties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_grape_varieties_v" ADD CONSTRAINT "_grape_varieties_v_parent_id_grape_varieties_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."grape_varieties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_grape_varieties_v_locales" ADD CONSTRAINT "_grape_varieties_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_grape_varieties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_grape_varieties_v_rels" ADD CONSTRAINT "_grape_varieties_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_grape_varieties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_grape_varieties_v_rels" ADD CONSTRAINT "_grape_varieties_v_rels_aromas_fk" FOREIGN KEY ("aromas_id") REFERENCES "public"."aromas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_grape_varieties_v_rels" ADD CONSTRAINT "_grape_varieties_v_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_grape_varieties_v_rels" ADD CONSTRAINT "_grape_varieties_v_rels_grape_varieties_fk" FOREIGN KEY ("grape_varieties_id") REFERENCES "public"."grape_varieties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_grape_varieties_v_rels" ADD CONSTRAINT "_grape_varieties_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_locales" ADD CONSTRAINT "tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_parent_id_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v_locales" ADD CONSTRAINT "_tags_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tags_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tags_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aromas" ADD CONSTRAINT "aromas_adjective_id_adjectives_id_fk" FOREIGN KEY ("adjective_id") REFERENCES "public"."adjectives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "aromas" ADD CONSTRAINT "aromas_flavour_id_flavours_id_fk" FOREIGN KEY ("flavour_id") REFERENCES "public"."flavours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "aromas_locales" ADD CONSTRAINT "aromas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aromas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aromas_rels" ADD CONSTRAINT "aromas_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."aromas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aromas_rels" ADD CONSTRAINT "aromas_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aromas_v" ADD CONSTRAINT "_aromas_v_parent_id_aromas_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."aromas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_aromas_v" ADD CONSTRAINT "_aromas_v_version_adjective_id_adjectives_id_fk" FOREIGN KEY ("version_adjective_id") REFERENCES "public"."adjectives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_aromas_v" ADD CONSTRAINT "_aromas_v_version_flavour_id_flavours_id_fk" FOREIGN KEY ("version_flavour_id") REFERENCES "public"."flavours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_aromas_v_locales" ADD CONSTRAINT "_aromas_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aromas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aromas_v_rels" ADD CONSTRAINT "_aromas_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_aromas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aromas_v_rels" ADD CONSTRAINT "_aromas_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "adjectives" ADD CONSTRAINT "adjectives_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "adjectives_locales" ADD CONSTRAINT "adjectives_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."adjectives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_adjectives_v" ADD CONSTRAINT "_adjectives_v_parent_id_adjectives_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."adjectives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_adjectives_v" ADD CONSTRAINT "_adjectives_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_adjectives_v_locales" ADD CONSTRAINT "_adjectives_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_adjectives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "flavours" ADD CONSTRAINT "flavours_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "flavours_locales" ADD CONSTRAINT "flavours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."flavours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_flavours_v" ADD CONSTRAINT "_flavours_v_parent_id_flavours_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."flavours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_flavours_v" ADD CONSTRAINT "_flavours_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_flavours_v_locales" ADD CONSTRAINT "_flavours_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_flavours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "styles_locales" ADD CONSTRAINT "styles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "styles_rels" ADD CONSTRAINT "styles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "styles_rels" ADD CONSTRAINT "styles_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_styles_v" ADD CONSTRAINT "_styles_v_parent_id_styles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."styles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_styles_v_locales" ADD CONSTRAINT "_styles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_styles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_styles_v_rels" ADD CONSTRAINT "_styles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_styles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_styles_v_rels" ADD CONSTRAINT "_styles_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "climates_locales" ADD CONSTRAINT "climates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."climates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "climates_rels" ADD CONSTRAINT "climates_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."climates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "climates_rels" ADD CONSTRAINT "climates_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "climates_rels" ADD CONSTRAINT "climates_rels_grape_varieties_fk" FOREIGN KEY ("grape_varieties_id") REFERENCES "public"."grape_varieties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "climates_rels" ADD CONSTRAINT "climates_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_climates_v" ADD CONSTRAINT "_climates_v_parent_id_climates_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."climates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_climates_v_locales" ADD CONSTRAINT "_climates_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_climates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_climates_v_rels" ADD CONSTRAINT "_climates_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_climates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_climates_v_rels" ADD CONSTRAINT "_climates_v_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_climates_v_rels" ADD CONSTRAINT "_climates_v_rels_grape_varieties_fk" FOREIGN KEY ("grape_varieties_id") REFERENCES "public"."grape_varieties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_climates_v_rels" ADD CONSTRAINT "_climates_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "moods_locales" ADD CONSTRAINT "moods_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."moods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "moods_rels" ADD CONSTRAINT "moods_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."moods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "moods_rels" ADD CONSTRAINT "moods_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_moods_v" ADD CONSTRAINT "_moods_v_parent_id_moods_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."moods"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_moods_v_locales" ADD CONSTRAINT "_moods_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_moods_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_moods_v_rels" ADD CONSTRAINT "_moods_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_moods_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_moods_v_rels" ADD CONSTRAINT "_moods_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dishes_locales" ADD CONSTRAINT "dishes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dishes_rels" ADD CONSTRAINT "dishes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dishes_rels" ADD CONSTRAINT "dishes_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_dishes_v" ADD CONSTRAINT "_dishes_v_parent_id_dishes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."dishes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_dishes_v_locales" ADD CONSTRAINT "_dishes_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_dishes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_dishes_v_rels" ADD CONSTRAINT "_dishes_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_dishes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_dishes_v_rels" ADD CONSTRAINT "_dishes_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "flat_wine_variants_related_wineries" ADD CONSTRAINT "flat_wine_variants_related_wineries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."flat_wine_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "flat_wine_variants_related_regions" ADD CONSTRAINT "flat_wine_variants_related_regions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."flat_wine_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "flat_wine_variants_aromas" ADD CONSTRAINT "flat_wine_variants_aromas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."flat_wine_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "flat_wine_variants_tags" ADD CONSTRAINT "flat_wine_variants_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."flat_wine_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "flat_wine_variants_moods" ADD CONSTRAINT "flat_wine_variants_moods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."flat_wine_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "flat_wine_variants_grape_varieties" ADD CONSTRAINT "flat_wine_variants_grape_varieties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."flat_wine_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "flat_wine_variants_climates" ADD CONSTRAINT "flat_wine_variants_climates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."flat_wine_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "flat_wine_variants_dishes" ADD CONSTRAINT "flat_wine_variants_dishes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."flat_wine_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "flat_wine_variants" ADD CONSTRAINT "flat_wine_variants_original_variant_id_wine_variants_id_fk" FOREIGN KEY ("original_variant_id") REFERENCES "public"."wine_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_flat_wine_variants_v_version_related_wineries" ADD CONSTRAINT "_flat_wine_variants_v_version_related_wineries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_flat_wine_variants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_flat_wine_variants_v_version_related_regions" ADD CONSTRAINT "_flat_wine_variants_v_version_related_regions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_flat_wine_variants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_flat_wine_variants_v_version_aromas" ADD CONSTRAINT "_flat_wine_variants_v_version_aromas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_flat_wine_variants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_flat_wine_variants_v_version_tags" ADD CONSTRAINT "_flat_wine_variants_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_flat_wine_variants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_flat_wine_variants_v_version_moods" ADD CONSTRAINT "_flat_wine_variants_v_version_moods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_flat_wine_variants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_flat_wine_variants_v_version_grape_varieties" ADD CONSTRAINT "_flat_wine_variants_v_version_grape_varieties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_flat_wine_variants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_flat_wine_variants_v_version_climates" ADD CONSTRAINT "_flat_wine_variants_v_version_climates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_flat_wine_variants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_flat_wine_variants_v_version_dishes" ADD CONSTRAINT "_flat_wine_variants_v_version_dishes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_flat_wine_variants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_flat_wine_variants_v" ADD CONSTRAINT "_flat_wine_variants_v_parent_id_flat_wine_variants_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."flat_wine_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_flat_wine_variants_v" ADD CONSTRAINT "_flat_wine_variants_v_version_original_variant_id_wine_variants_id_fk" FOREIGN KEY ("version_original_variant_id") REFERENCES "public"."wine_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invoices_fk" FOREIGN KEY ("invoices_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_active_carts_fk" FOREIGN KEY ("active_carts_id") REFERENCES "public"."active_carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_saved_carts_fk" FOREIGN KEY ("saved_carts_id") REFERENCES "public"."saved_carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_shared_carts_fk" FOREIGN KEY ("shared_carts_id") REFERENCES "public"."shared_carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stock_reservations_fk" FOREIGN KEY ("stock_reservations_id") REFERENCES "public"."stock_reservations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wines_fk" FOREIGN KEY ("wines_id") REFERENCES "public"."wines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wine_variants_fk" FOREIGN KEY ("wine_variants_id") REFERENCES "public"."wine_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wineries_fk" FOREIGN KEY ("wineries_id") REFERENCES "public"."wineries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wine_countries_fk" FOREIGN KEY ("wine_countries_id") REFERENCES "public"."wine_countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_grape_varieties_fk" FOREIGN KEY ("grape_varieties_id") REFERENCES "public"."grape_varieties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_aromas_fk" FOREIGN KEY ("aromas_id") REFERENCES "public"."aromas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_adjectives_fk" FOREIGN KEY ("adjectives_id") REFERENCES "public"."adjectives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_flavours_fk" FOREIGN KEY ("flavours_id") REFERENCES "public"."flavours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_styles_fk" FOREIGN KEY ("styles_id") REFERENCES "public"."styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_climates_fk" FOREIGN KEY ("climates_id") REFERENCES "public"."climates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_moods_fk" FOREIGN KEY ("moods_id") REFERENCES "public"."moods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dishes_fk" FOREIGN KEY ("dishes_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_flat_wine_variants_fk" FOREIGN KEY ("flat_wine_variants_id") REFERENCES "public"."flat_wine_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "invoices_updated_at_idx" ON "invoices" USING btree ("updated_at");
  CREATE INDEX "invoices_created_at_idx" ON "invoices" USING btree ("created_at");
  CREATE UNIQUE INDEX "invoices_filename_idx" ON "invoices" USING btree ("filename");
  CREATE INDEX "active_carts_items_order_idx" ON "active_carts_items" USING btree ("_order");
  CREATE INDEX "active_carts_items_parent_id_idx" ON "active_carts_items" USING btree ("_parent_id");
  CREATE INDEX "active_carts_items_wine_variant_idx" ON "active_carts_items" USING btree ("wine_variant_id");
  CREATE INDEX "active_carts_user_idx" ON "active_carts" USING btree ("user_id");
  CREATE INDEX "active_carts_created_at_idx" ON "active_carts" USING btree ("created_at");
  CREATE INDEX "saved_carts_items_order_idx" ON "saved_carts_items" USING btree ("_order");
  CREATE INDEX "saved_carts_items_parent_id_idx" ON "saved_carts_items" USING btree ("_parent_id");
  CREATE INDEX "saved_carts_items_wine_variant_idx" ON "saved_carts_items" USING btree ("wine_variant_id");
  CREATE INDEX "saved_carts_user_idx" ON "saved_carts" USING btree ("user_id");
  CREATE INDEX "shared_carts_items_order_idx" ON "shared_carts_items" USING btree ("_order");
  CREATE INDEX "shared_carts_items_parent_id_idx" ON "shared_carts_items" USING btree ("_parent_id");
  CREATE INDEX "shared_carts_items_wine_variant_idx" ON "shared_carts_items" USING btree ("wine_variant_id");
  CREATE UNIQUE INDEX "shared_carts_share_id_idx" ON "shared_carts" USING btree ("share_id");
  CREATE INDEX "shared_carts_updated_at_idx" ON "shared_carts" USING btree ("updated_at");
  CREATE INDEX "stock_reservations_variant_idx" ON "stock_reservations" USING btree ("variant_id");
  CREATE INDEX "stock_reservations_order_idx" ON "stock_reservations" USING btree ("order_id");
  CREATE INDEX "stock_reservations_cart_idx" ON "stock_reservations" USING btree ("cart_id");
  CREATE INDEX "stock_reservations_updated_at_idx" ON "stock_reservations" USING btree ("updated_at");
  CREATE INDEX "stock_reservations_created_at_idx" ON "stock_reservations" USING btree ("created_at");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_variant_idx" ON "orders_items" USING btree ("variant_id");
  CREATE INDEX "orders_items_reservation_idx" ON "orders_items" USING btree ("reservation_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX "orders_invoice_idx" ON "orders" USING btree ("invoice_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "wines_winery_idx" ON "wines" USING btree ("winery_id");
  CREATE INDEX "wines_title_idx" ON "wines" USING btree ("title");
  CREATE INDEX "wines_region_idx" ON "wines" USING btree ("region_id");
  CREATE INDEX "wines_style_idx" ON "wines" USING btree ("style_id");
  CREATE INDEX "wines_slug_idx" ON "wines" USING btree ("slug");
  CREATE INDEX "wines_updated_at_idx" ON "wines" USING btree ("updated_at");
  CREATE INDEX "wines_created_at_idx" ON "wines" USING btree ("created_at");
  CREATE INDEX "wines__status_idx" ON "wines" USING btree ("_status");
  CREATE UNIQUE INDEX "wines_locales_locale_parent_id_unique" ON "wines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "wines_rels_order_idx" ON "wines_rels" USING btree ("order");
  CREATE INDEX "wines_rels_parent_idx" ON "wines_rels" USING btree ("parent_id");
  CREATE INDEX "wines_rels_path_idx" ON "wines_rels" USING btree ("path");
  CREATE INDEX "wines_rels_media_id_idx" ON "wines_rels" USING btree ("media_id");
  CREATE INDEX "_wines_v_parent_idx" ON "_wines_v" USING btree ("parent_id");
  CREATE INDEX "_wines_v_version_version_winery_idx" ON "_wines_v" USING btree ("version_winery_id");
  CREATE INDEX "_wines_v_version_version_title_idx" ON "_wines_v" USING btree ("version_title");
  CREATE INDEX "_wines_v_version_version_region_idx" ON "_wines_v" USING btree ("version_region_id");
  CREATE INDEX "_wines_v_version_version_style_idx" ON "_wines_v" USING btree ("version_style_id");
  CREATE INDEX "_wines_v_version_version_slug_idx" ON "_wines_v" USING btree ("version_slug");
  CREATE INDEX "_wines_v_version_version_updated_at_idx" ON "_wines_v" USING btree ("version_updated_at");
  CREATE INDEX "_wines_v_version_version_created_at_idx" ON "_wines_v" USING btree ("version_created_at");
  CREATE INDEX "_wines_v_version_version__status_idx" ON "_wines_v" USING btree ("version__status");
  CREATE INDEX "_wines_v_created_at_idx" ON "_wines_v" USING btree ("created_at");
  CREATE INDEX "_wines_v_updated_at_idx" ON "_wines_v" USING btree ("updated_at");
  CREATE INDEX "_wines_v_snapshot_idx" ON "_wines_v" USING btree ("snapshot");
  CREATE INDEX "_wines_v_published_locale_idx" ON "_wines_v" USING btree ("published_locale");
  CREATE INDEX "_wines_v_latest_idx" ON "_wines_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_wines_v_locales_locale_parent_id_unique" ON "_wines_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_wines_v_rels_order_idx" ON "_wines_v_rels" USING btree ("order");
  CREATE INDEX "_wines_v_rels_parent_idx" ON "_wines_v_rels" USING btree ("parent_id");
  CREATE INDEX "_wines_v_rels_path_idx" ON "_wines_v_rels" USING btree ("path");
  CREATE INDEX "_wines_v_rels_media_id_idx" ON "_wines_v_rels" USING btree ("media_id");
  CREATE INDEX "wine_variants_grape_varieties_order_idx" ON "wine_variants_grape_varieties" USING btree ("_order");
  CREATE INDEX "wine_variants_grape_varieties_parent_id_idx" ON "wine_variants_grape_varieties" USING btree ("_parent_id");
  CREATE INDEX "wine_variants_grape_varieties_variety_idx" ON "wine_variants_grape_varieties" USING btree ("variety_id");
  CREATE INDEX "wine_variants_wine_idx" ON "wine_variants" USING btree ("wine_id");
  CREATE INDEX "wine_variants_size_idx" ON "wine_variants" USING btree ("size");
  CREATE INDEX "wine_variants_vintage_idx" ON "wine_variants" USING btree ("vintage");
  CREATE INDEX "wine_variants_sku_idx" ON "wine_variants" USING btree ("sku");
  CREATE INDEX "wine_variants_price_idx" ON "wine_variants" USING btree ("price");
  CREATE INDEX "wine_variants_stock_on_hand_idx" ON "wine_variants" USING btree ("stock_on_hand");
  CREATE INDEX "wine_variants_can_backorder_idx" ON "wine_variants" USING btree ("can_backorder");
  CREATE INDEX "wine_variants_max_backorder_quantity_idx" ON "wine_variants" USING btree ("max_backorder_quantity");
  CREATE INDEX "wine_variants_serving_temp_idx" ON "wine_variants" USING btree ("serving_temp");
  CREATE INDEX "wine_variants_decanting_idx" ON "wine_variants" USING btree ("decanting");
  CREATE INDEX "wine_variants_tasting_notes_tasting_notes_dry_idx" ON "wine_variants" USING btree ("tasting_notes_dry");
  CREATE INDEX "wine_variants_tasting_notes_tasting_notes_ripe_idx" ON "wine_variants" USING btree ("tasting_notes_ripe");
  CREATE INDEX "wine_variants_tasting_notes_tasting_notes_creamy_idx" ON "wine_variants" USING btree ("tasting_notes_creamy");
  CREATE INDEX "wine_variants_tasting_notes_tasting_notes_oaky_idx" ON "wine_variants" USING btree ("tasting_notes_oaky");
  CREATE INDEX "wine_variants_tasting_notes_tasting_notes_complex_idx" ON "wine_variants" USING btree ("tasting_notes_complex");
  CREATE INDEX "wine_variants_tasting_notes_tasting_notes_light_idx" ON "wine_variants" USING btree ("tasting_notes_light");
  CREATE INDEX "wine_variants_tasting_notes_tasting_notes_smooth_idx" ON "wine_variants" USING btree ("tasting_notes_smooth");
  CREATE INDEX "wine_variants_tasting_notes_tasting_notes_youthful_idx" ON "wine_variants" USING btree ("tasting_notes_youthful");
  CREATE INDEX "wine_variants_tasting_notes_tasting_notes_energetic_idx" ON "wine_variants" USING btree ("tasting_notes_energetic");
  CREATE INDEX "wine_variants_tasting_notes_tasting_notes_alcohol_idx" ON "wine_variants" USING btree ("tasting_notes_alcohol");
  CREATE INDEX "wine_variants_slug_idx" ON "wine_variants" USING btree ("slug");
  CREATE INDEX "wine_variants_updated_at_idx" ON "wine_variants" USING btree ("updated_at");
  CREATE INDEX "wine_variants_created_at_idx" ON "wine_variants" USING btree ("created_at");
  CREATE INDEX "wine_variants__status_idx" ON "wine_variants" USING btree ("_status");
  CREATE UNIQUE INDEX "wine_variants_locales_locale_parent_id_unique" ON "wine_variants_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "wine_variants_rels_order_idx" ON "wine_variants_rels" USING btree ("order");
  CREATE INDEX "wine_variants_rels_parent_idx" ON "wine_variants_rels" USING btree ("parent_id");
  CREATE INDEX "wine_variants_rels_path_idx" ON "wine_variants_rels" USING btree ("path");
  CREATE INDEX "wine_variants_rels_dishes_id_idx" ON "wine_variants_rels" USING btree ("dishes_id");
  CREATE INDEX "wine_variants_rels_aromas_id_idx" ON "wine_variants_rels" USING btree ("aromas_id");
  CREATE INDEX "wine_variants_rels_tags_id_idx" ON "wine_variants_rels" USING btree ("tags_id");
  CREATE INDEX "wine_variants_rels_moods_id_idx" ON "wine_variants_rels" USING btree ("moods_id");
  CREATE INDEX "wine_variants_rels_media_id_idx" ON "wine_variants_rels" USING btree ("media_id");
  CREATE INDEX "_wine_variants_v_version_grape_varieties_order_idx" ON "_wine_variants_v_version_grape_varieties" USING btree ("_order");
  CREATE INDEX "_wine_variants_v_version_grape_varieties_parent_id_idx" ON "_wine_variants_v_version_grape_varieties" USING btree ("_parent_id");
  CREATE INDEX "_wine_variants_v_version_grape_varieties_variety_idx" ON "_wine_variants_v_version_grape_varieties" USING btree ("variety_id");
  CREATE INDEX "_wine_variants_v_parent_idx" ON "_wine_variants_v" USING btree ("parent_id");
  CREATE INDEX "_wine_variants_v_version_version_wine_idx" ON "_wine_variants_v" USING btree ("version_wine_id");
  CREATE INDEX "_wine_variants_v_version_version_size_idx" ON "_wine_variants_v" USING btree ("version_size");
  CREATE INDEX "_wine_variants_v_version_version_vintage_idx" ON "_wine_variants_v" USING btree ("version_vintage");
  CREATE INDEX "_wine_variants_v_version_version_sku_idx" ON "_wine_variants_v" USING btree ("version_sku");
  CREATE INDEX "_wine_variants_v_version_version_price_idx" ON "_wine_variants_v" USING btree ("version_price");
  CREATE INDEX "_wine_variants_v_version_version_stock_on_hand_idx" ON "_wine_variants_v" USING btree ("version_stock_on_hand");
  CREATE INDEX "_wine_variants_v_version_version_can_backorder_idx" ON "_wine_variants_v" USING btree ("version_can_backorder");
  CREATE INDEX "_wine_variants_v_version_version_max_backorder_quantity_idx" ON "_wine_variants_v" USING btree ("version_max_backorder_quantity");
  CREATE INDEX "_wine_variants_v_version_version_serving_temp_idx" ON "_wine_variants_v" USING btree ("version_serving_temp");
  CREATE INDEX "_wine_variants_v_version_version_decanting_idx" ON "_wine_variants_v" USING btree ("version_decanting");
  CREATE INDEX "_wine_variants_v_version_tasting_notes_version_tasting_notes_dry_idx" ON "_wine_variants_v" USING btree ("version_tasting_notes_dry");
  CREATE INDEX "_wine_variants_v_version_tasting_notes_version_tasting_notes_ripe_idx" ON "_wine_variants_v" USING btree ("version_tasting_notes_ripe");
  CREATE INDEX "_wine_variants_v_version_tasting_notes_version_tasting_notes_creamy_idx" ON "_wine_variants_v" USING btree ("version_tasting_notes_creamy");
  CREATE INDEX "_wine_variants_v_version_tasting_notes_version_tasting_notes_oaky_idx" ON "_wine_variants_v" USING btree ("version_tasting_notes_oaky");
  CREATE INDEX "_wine_variants_v_version_tasting_notes_version_tasting_notes_complex_idx" ON "_wine_variants_v" USING btree ("version_tasting_notes_complex");
  CREATE INDEX "_wine_variants_v_version_tasting_notes_version_tasting_notes_light_idx" ON "_wine_variants_v" USING btree ("version_tasting_notes_light");
  CREATE INDEX "_wine_variants_v_version_tasting_notes_version_tasting_notes_smooth_idx" ON "_wine_variants_v" USING btree ("version_tasting_notes_smooth");
  CREATE INDEX "_wine_variants_v_version_tasting_notes_version_tasting_notes_youthful_idx" ON "_wine_variants_v" USING btree ("version_tasting_notes_youthful");
  CREATE INDEX "_wine_variants_v_version_tasting_notes_version_tasting_notes_energetic_idx" ON "_wine_variants_v" USING btree ("version_tasting_notes_energetic");
  CREATE INDEX "_wine_variants_v_version_tasting_notes_version_tasting_notes_alcohol_idx" ON "_wine_variants_v" USING btree ("version_tasting_notes_alcohol");
  CREATE INDEX "_wine_variants_v_version_version_slug_idx" ON "_wine_variants_v" USING btree ("version_slug");
  CREATE INDEX "_wine_variants_v_version_version_updated_at_idx" ON "_wine_variants_v" USING btree ("version_updated_at");
  CREATE INDEX "_wine_variants_v_version_version_created_at_idx" ON "_wine_variants_v" USING btree ("version_created_at");
  CREATE INDEX "_wine_variants_v_version_version__status_idx" ON "_wine_variants_v" USING btree ("version__status");
  CREATE INDEX "_wine_variants_v_created_at_idx" ON "_wine_variants_v" USING btree ("created_at");
  CREATE INDEX "_wine_variants_v_updated_at_idx" ON "_wine_variants_v" USING btree ("updated_at");
  CREATE INDEX "_wine_variants_v_snapshot_idx" ON "_wine_variants_v" USING btree ("snapshot");
  CREATE INDEX "_wine_variants_v_published_locale_idx" ON "_wine_variants_v" USING btree ("published_locale");
  CREATE INDEX "_wine_variants_v_latest_idx" ON "_wine_variants_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_wine_variants_v_locales_locale_parent_id_unique" ON "_wine_variants_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_wine_variants_v_rels_order_idx" ON "_wine_variants_v_rels" USING btree ("order");
  CREATE INDEX "_wine_variants_v_rels_parent_idx" ON "_wine_variants_v_rels" USING btree ("parent_id");
  CREATE INDEX "_wine_variants_v_rels_path_idx" ON "_wine_variants_v_rels" USING btree ("path");
  CREATE INDEX "_wine_variants_v_rels_dishes_id_idx" ON "_wine_variants_v_rels" USING btree ("dishes_id");
  CREATE INDEX "_wine_variants_v_rels_aromas_id_idx" ON "_wine_variants_v_rels" USING btree ("aromas_id");
  CREATE INDEX "_wine_variants_v_rels_tags_id_idx" ON "_wine_variants_v_rels" USING btree ("tags_id");
  CREATE INDEX "_wine_variants_v_rels_moods_id_idx" ON "_wine_variants_v_rels" USING btree ("moods_id");
  CREATE INDEX "_wine_variants_v_rels_media_id_idx" ON "_wine_variants_v_rels" USING btree ("media_id");
  CREATE INDEX "wineries_title_idx" ON "wineries" USING btree ("title");
  CREATE UNIQUE INDEX "wineries_winery_code_idx" ON "wineries" USING btree ("winery_code");
  CREATE INDEX "wineries_updated_at_idx" ON "wineries" USING btree ("updated_at");
  CREATE INDEX "wineries_created_at_idx" ON "wineries" USING btree ("created_at");
  CREATE INDEX "wineries__status_idx" ON "wineries" USING btree ("_status");
  CREATE INDEX "wineries_slug_idx" ON "wineries_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "wineries_locales_locale_parent_id_unique" ON "wineries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "wineries_rels_order_idx" ON "wineries_rels" USING btree ("order");
  CREATE INDEX "wineries_rels_parent_idx" ON "wineries_rels" USING btree ("parent_id");
  CREATE INDEX "wineries_rels_path_idx" ON "wineries_rels" USING btree ("path");
  CREATE INDEX "wineries_rels_tags_id_idx" ON "wineries_rels" USING btree ("tags_id");
  CREATE INDEX "wineries_rels_wineries_id_idx" ON "wineries_rels" USING btree ("wineries_id");
  CREATE INDEX "wineries_rels_media_id_idx" ON "wineries_rels" USING btree ("media_id");
  CREATE INDEX "_wineries_v_parent_idx" ON "_wineries_v" USING btree ("parent_id");
  CREATE INDEX "_wineries_v_version_version_title_idx" ON "_wineries_v" USING btree ("version_title");
  CREATE INDEX "_wineries_v_version_version_winery_code_idx" ON "_wineries_v" USING btree ("version_winery_code");
  CREATE INDEX "_wineries_v_version_version_updated_at_idx" ON "_wineries_v" USING btree ("version_updated_at");
  CREATE INDEX "_wineries_v_version_version_created_at_idx" ON "_wineries_v" USING btree ("version_created_at");
  CREATE INDEX "_wineries_v_version_version__status_idx" ON "_wineries_v" USING btree ("version__status");
  CREATE INDEX "_wineries_v_created_at_idx" ON "_wineries_v" USING btree ("created_at");
  CREATE INDEX "_wineries_v_updated_at_idx" ON "_wineries_v" USING btree ("updated_at");
  CREATE INDEX "_wineries_v_snapshot_idx" ON "_wineries_v" USING btree ("snapshot");
  CREATE INDEX "_wineries_v_published_locale_idx" ON "_wineries_v" USING btree ("published_locale");
  CREATE INDEX "_wineries_v_latest_idx" ON "_wineries_v" USING btree ("latest");
  CREATE INDEX "_wineries_v_version_version_slug_idx" ON "_wineries_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_wineries_v_locales_locale_parent_id_unique" ON "_wineries_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_wineries_v_rels_order_idx" ON "_wineries_v_rels" USING btree ("order");
  CREATE INDEX "_wineries_v_rels_parent_idx" ON "_wineries_v_rels" USING btree ("parent_id");
  CREATE INDEX "_wineries_v_rels_path_idx" ON "_wineries_v_rels" USING btree ("path");
  CREATE INDEX "_wineries_v_rels_tags_id_idx" ON "_wineries_v_rels" USING btree ("tags_id");
  CREATE INDEX "_wineries_v_rels_wineries_id_idx" ON "_wineries_v_rels" USING btree ("wineries_id");
  CREATE INDEX "_wineries_v_rels_media_id_idx" ON "_wineries_v_rels" USING btree ("media_id");
  CREATE INDEX "regions_title_idx" ON "regions" USING btree ("title");
  CREATE INDEX "regions_price_range_idx" ON "regions" USING btree ("price_range");
  CREATE INDEX "regions_climate_idx" ON "regions" USING btree ("climate_id");
  CREATE INDEX "regions_country_idx" ON "regions" USING btree ("country_id");
  CREATE INDEX "regions_updated_at_idx" ON "regions" USING btree ("updated_at");
  CREATE INDEX "regions_created_at_idx" ON "regions" USING btree ("created_at");
  CREATE INDEX "regions__status_idx" ON "regions" USING btree ("_status");
  CREATE INDEX "regions_slug_idx" ON "regions_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "regions_locales_locale_parent_id_unique" ON "regions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "regions_rels_order_idx" ON "regions_rels" USING btree ("order");
  CREATE INDEX "regions_rels_parent_idx" ON "regions_rels" USING btree ("parent_id");
  CREATE INDEX "regions_rels_path_idx" ON "regions_rels" USING btree ("path");
  CREATE INDEX "regions_rels_regions_id_idx" ON "regions_rels" USING btree ("regions_id");
  CREATE INDEX "regions_rels_grape_varieties_id_idx" ON "regions_rels" USING btree ("grape_varieties_id");
  CREATE INDEX "regions_rels_wineries_id_idx" ON "regions_rels" USING btree ("wineries_id");
  CREATE INDEX "regions_rels_media_id_idx" ON "regions_rels" USING btree ("media_id");
  CREATE INDEX "_regions_v_parent_idx" ON "_regions_v" USING btree ("parent_id");
  CREATE INDEX "_regions_v_version_version_title_idx" ON "_regions_v" USING btree ("version_title");
  CREATE INDEX "_regions_v_version_version_price_range_idx" ON "_regions_v" USING btree ("version_price_range");
  CREATE INDEX "_regions_v_version_version_climate_idx" ON "_regions_v" USING btree ("version_climate_id");
  CREATE INDEX "_regions_v_version_version_country_idx" ON "_regions_v" USING btree ("version_country_id");
  CREATE INDEX "_regions_v_version_version_updated_at_idx" ON "_regions_v" USING btree ("version_updated_at");
  CREATE INDEX "_regions_v_version_version_created_at_idx" ON "_regions_v" USING btree ("version_created_at");
  CREATE INDEX "_regions_v_version_version__status_idx" ON "_regions_v" USING btree ("version__status");
  CREATE INDEX "_regions_v_created_at_idx" ON "_regions_v" USING btree ("created_at");
  CREATE INDEX "_regions_v_updated_at_idx" ON "_regions_v" USING btree ("updated_at");
  CREATE INDEX "_regions_v_snapshot_idx" ON "_regions_v" USING btree ("snapshot");
  CREATE INDEX "_regions_v_published_locale_idx" ON "_regions_v" USING btree ("published_locale");
  CREATE INDEX "_regions_v_latest_idx" ON "_regions_v" USING btree ("latest");
  CREATE INDEX "_regions_v_version_version_slug_idx" ON "_regions_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_regions_v_locales_locale_parent_id_unique" ON "_regions_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_regions_v_rels_order_idx" ON "_regions_v_rels" USING btree ("order");
  CREATE INDEX "_regions_v_rels_parent_idx" ON "_regions_v_rels" USING btree ("parent_id");
  CREATE INDEX "_regions_v_rels_path_idx" ON "_regions_v_rels" USING btree ("path");
  CREATE INDEX "_regions_v_rels_regions_id_idx" ON "_regions_v_rels" USING btree ("regions_id");
  CREATE INDEX "_regions_v_rels_grape_varieties_id_idx" ON "_regions_v_rels" USING btree ("grape_varieties_id");
  CREATE INDEX "_regions_v_rels_wineries_id_idx" ON "_regions_v_rels" USING btree ("wineries_id");
  CREATE INDEX "_regions_v_rels_media_id_idx" ON "_regions_v_rels" USING btree ("media_id");
  CREATE INDEX "wine_countries_statistics_statistics_land_area_idx" ON "wine_countries" USING btree ("statistics_land_area");
  CREATE INDEX "wine_countries_statistics_statistics_wineries_count_idx" ON "wine_countries" USING btree ("statistics_wineries_count");
  CREATE INDEX "wine_countries_updated_at_idx" ON "wine_countries" USING btree ("updated_at");
  CREATE INDEX "wine_countries_created_at_idx" ON "wine_countries" USING btree ("created_at");
  CREATE INDEX "wine_countries__status_idx" ON "wine_countries" USING btree ("_status");
  CREATE INDEX "wine_countries_title_idx" ON "wine_countries_locales" USING btree ("title","_locale");
  CREATE INDEX "wine_countries_slug_idx" ON "wine_countries_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "wine_countries_locales_locale_parent_id_unique" ON "wine_countries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "wine_countries_rels_order_idx" ON "wine_countries_rels" USING btree ("order");
  CREATE INDEX "wine_countries_rels_parent_idx" ON "wine_countries_rels" USING btree ("parent_id");
  CREATE INDEX "wine_countries_rels_path_idx" ON "wine_countries_rels" USING btree ("path");
  CREATE INDEX "wine_countries_rels_regions_id_idx" ON "wine_countries_rels" USING btree ("regions_id");
  CREATE INDEX "wine_countries_rels_grape_varieties_id_idx" ON "wine_countries_rels" USING btree ("grape_varieties_id");
  CREATE INDEX "wine_countries_rels_wineries_id_idx" ON "wine_countries_rels" USING btree ("wineries_id");
  CREATE INDEX "wine_countries_rels_media_id_idx" ON "wine_countries_rels" USING btree ("media_id");
  CREATE INDEX "_wine_countries_v_parent_idx" ON "_wine_countries_v" USING btree ("parent_id");
  CREATE INDEX "_wine_countries_v_version_statistics_version_statistics_land_area_idx" ON "_wine_countries_v" USING btree ("version_statistics_land_area");
  CREATE INDEX "_wine_countries_v_version_statistics_version_statistics_wineries_count_idx" ON "_wine_countries_v" USING btree ("version_statistics_wineries_count");
  CREATE INDEX "_wine_countries_v_version_version_updated_at_idx" ON "_wine_countries_v" USING btree ("version_updated_at");
  CREATE INDEX "_wine_countries_v_version_version_created_at_idx" ON "_wine_countries_v" USING btree ("version_created_at");
  CREATE INDEX "_wine_countries_v_version_version__status_idx" ON "_wine_countries_v" USING btree ("version__status");
  CREATE INDEX "_wine_countries_v_created_at_idx" ON "_wine_countries_v" USING btree ("created_at");
  CREATE INDEX "_wine_countries_v_updated_at_idx" ON "_wine_countries_v" USING btree ("updated_at");
  CREATE INDEX "_wine_countries_v_snapshot_idx" ON "_wine_countries_v" USING btree ("snapshot");
  CREATE INDEX "_wine_countries_v_published_locale_idx" ON "_wine_countries_v" USING btree ("published_locale");
  CREATE INDEX "_wine_countries_v_latest_idx" ON "_wine_countries_v" USING btree ("latest");
  CREATE INDEX "_wine_countries_v_version_version_title_idx" ON "_wine_countries_v_locales" USING btree ("version_title","_locale");
  CREATE INDEX "_wine_countries_v_version_version_slug_idx" ON "_wine_countries_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_wine_countries_v_locales_locale_parent_id_unique" ON "_wine_countries_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_wine_countries_v_rels_order_idx" ON "_wine_countries_v_rels" USING btree ("order");
  CREATE INDEX "_wine_countries_v_rels_parent_idx" ON "_wine_countries_v_rels" USING btree ("parent_id");
  CREATE INDEX "_wine_countries_v_rels_path_idx" ON "_wine_countries_v_rels" USING btree ("path");
  CREATE INDEX "_wine_countries_v_rels_regions_id_idx" ON "_wine_countries_v_rels" USING btree ("regions_id");
  CREATE INDEX "_wine_countries_v_rels_grape_varieties_id_idx" ON "_wine_countries_v_rels" USING btree ("grape_varieties_id");
  CREATE INDEX "_wine_countries_v_rels_wineries_id_idx" ON "_wine_countries_v_rels" USING btree ("wineries_id");
  CREATE INDEX "_wine_countries_v_rels_media_id_idx" ON "_wine_countries_v_rels" USING btree ("media_id");
  CREATE INDEX "grape_varieties_synonyms_order_idx" ON "grape_varieties_synonyms" USING btree ("_order");
  CREATE INDEX "grape_varieties_synonyms_parent_id_idx" ON "grape_varieties_synonyms" USING btree ("_parent_id");
  CREATE INDEX "grape_varieties_synonyms_locale_idx" ON "grape_varieties_synonyms" USING btree ("_locale");
  CREATE INDEX "grape_varieties_skin_idx" ON "grape_varieties" USING btree ("skin");
  CREATE INDEX "grape_varieties_updated_at_idx" ON "grape_varieties" USING btree ("updated_at");
  CREATE INDEX "grape_varieties_created_at_idx" ON "grape_varieties" USING btree ("created_at");
  CREATE INDEX "grape_varieties__status_idx" ON "grape_varieties" USING btree ("_status");
  CREATE INDEX "grape_varieties_title_idx" ON "grape_varieties_locales" USING btree ("title","_locale");
  CREATE INDEX "grape_varieties_slug_idx" ON "grape_varieties_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "grape_varieties_locales_locale_parent_id_unique" ON "grape_varieties_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "grape_varieties_rels_order_idx" ON "grape_varieties_rels" USING btree ("order");
  CREATE INDEX "grape_varieties_rels_parent_idx" ON "grape_varieties_rels" USING btree ("parent_id");
  CREATE INDEX "grape_varieties_rels_path_idx" ON "grape_varieties_rels" USING btree ("path");
  CREATE INDEX "grape_varieties_rels_aromas_id_idx" ON "grape_varieties_rels" USING btree ("aromas_id");
  CREATE INDEX "grape_varieties_rels_regions_id_idx" ON "grape_varieties_rels" USING btree ("regions_id");
  CREATE INDEX "grape_varieties_rels_grape_varieties_id_idx" ON "grape_varieties_rels" USING btree ("grape_varieties_id");
  CREATE INDEX "grape_varieties_rels_media_id_idx" ON "grape_varieties_rels" USING btree ("media_id");
  CREATE INDEX "_grape_varieties_v_version_synonyms_order_idx" ON "_grape_varieties_v_version_synonyms" USING btree ("_order");
  CREATE INDEX "_grape_varieties_v_version_synonyms_parent_id_idx" ON "_grape_varieties_v_version_synonyms" USING btree ("_parent_id");
  CREATE INDEX "_grape_varieties_v_version_synonyms_locale_idx" ON "_grape_varieties_v_version_synonyms" USING btree ("_locale");
  CREATE INDEX "_grape_varieties_v_parent_idx" ON "_grape_varieties_v" USING btree ("parent_id");
  CREATE INDEX "_grape_varieties_v_version_version_skin_idx" ON "_grape_varieties_v" USING btree ("version_skin");
  CREATE INDEX "_grape_varieties_v_version_version_updated_at_idx" ON "_grape_varieties_v" USING btree ("version_updated_at");
  CREATE INDEX "_grape_varieties_v_version_version_created_at_idx" ON "_grape_varieties_v" USING btree ("version_created_at");
  CREATE INDEX "_grape_varieties_v_version_version__status_idx" ON "_grape_varieties_v" USING btree ("version__status");
  CREATE INDEX "_grape_varieties_v_created_at_idx" ON "_grape_varieties_v" USING btree ("created_at");
  CREATE INDEX "_grape_varieties_v_updated_at_idx" ON "_grape_varieties_v" USING btree ("updated_at");
  CREATE INDEX "_grape_varieties_v_snapshot_idx" ON "_grape_varieties_v" USING btree ("snapshot");
  CREATE INDEX "_grape_varieties_v_published_locale_idx" ON "_grape_varieties_v" USING btree ("published_locale");
  CREATE INDEX "_grape_varieties_v_latest_idx" ON "_grape_varieties_v" USING btree ("latest");
  CREATE INDEX "_grape_varieties_v_version_version_title_idx" ON "_grape_varieties_v_locales" USING btree ("version_title","_locale");
  CREATE INDEX "_grape_varieties_v_version_version_slug_idx" ON "_grape_varieties_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_grape_varieties_v_locales_locale_parent_id_unique" ON "_grape_varieties_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_grape_varieties_v_rels_order_idx" ON "_grape_varieties_v_rels" USING btree ("order");
  CREATE INDEX "_grape_varieties_v_rels_parent_idx" ON "_grape_varieties_v_rels" USING btree ("parent_id");
  CREATE INDEX "_grape_varieties_v_rels_path_idx" ON "_grape_varieties_v_rels" USING btree ("path");
  CREATE INDEX "_grape_varieties_v_rels_aromas_id_idx" ON "_grape_varieties_v_rels" USING btree ("aromas_id");
  CREATE INDEX "_grape_varieties_v_rels_regions_id_idx" ON "_grape_varieties_v_rels" USING btree ("regions_id");
  CREATE INDEX "_grape_varieties_v_rels_grape_varieties_id_idx" ON "_grape_varieties_v_rels" USING btree ("grape_varieties_id");
  CREATE INDEX "_grape_varieties_v_rels_media_id_idx" ON "_grape_varieties_v_rels" USING btree ("media_id");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "tags__status_idx" ON "tags" USING btree ("_status");
  CREATE INDEX "tags_title_idx" ON "tags_locales" USING btree ("title","_locale");
  CREATE INDEX "tags_slug_idx" ON "tags_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "tags_locales_locale_parent_id_unique" ON "tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tags_rels_order_idx" ON "tags_rels" USING btree ("order");
  CREATE INDEX "tags_rels_parent_idx" ON "tags_rels" USING btree ("parent_id");
  CREATE INDEX "tags_rels_path_idx" ON "tags_rels" USING btree ("path");
  CREATE INDEX "tags_rels_media_id_idx" ON "tags_rels" USING btree ("media_id");
  CREATE INDEX "_tags_v_parent_idx" ON "_tags_v" USING btree ("parent_id");
  CREATE INDEX "_tags_v_version_version_updated_at_idx" ON "_tags_v" USING btree ("version_updated_at");
  CREATE INDEX "_tags_v_version_version_created_at_idx" ON "_tags_v" USING btree ("version_created_at");
  CREATE INDEX "_tags_v_version_version__status_idx" ON "_tags_v" USING btree ("version__status");
  CREATE INDEX "_tags_v_created_at_idx" ON "_tags_v" USING btree ("created_at");
  CREATE INDEX "_tags_v_updated_at_idx" ON "_tags_v" USING btree ("updated_at");
  CREATE INDEX "_tags_v_snapshot_idx" ON "_tags_v" USING btree ("snapshot");
  CREATE INDEX "_tags_v_published_locale_idx" ON "_tags_v" USING btree ("published_locale");
  CREATE INDEX "_tags_v_latest_idx" ON "_tags_v" USING btree ("latest");
  CREATE INDEX "_tags_v_version_version_title_idx" ON "_tags_v_locales" USING btree ("version_title","_locale");
  CREATE INDEX "_tags_v_version_version_slug_idx" ON "_tags_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_tags_v_locales_locale_parent_id_unique" ON "_tags_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_tags_v_rels_order_idx" ON "_tags_v_rels" USING btree ("order");
  CREATE INDEX "_tags_v_rels_parent_idx" ON "_tags_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tags_v_rels_path_idx" ON "_tags_v_rels" USING btree ("path");
  CREATE INDEX "_tags_v_rels_media_id_idx" ON "_tags_v_rels" USING btree ("media_id");
  CREATE INDEX "aromas_adjective_idx" ON "aromas" USING btree ("adjective_id");
  CREATE INDEX "aromas_flavour_idx" ON "aromas" USING btree ("flavour_id");
  CREATE INDEX "aromas_updated_at_idx" ON "aromas" USING btree ("updated_at");
  CREATE INDEX "aromas_created_at_idx" ON "aromas" USING btree ("created_at");
  CREATE INDEX "aromas__status_idx" ON "aromas" USING btree ("_status");
  CREATE INDEX "aromas_title_idx" ON "aromas_locales" USING btree ("title","_locale");
  CREATE INDEX "aromas_slug_idx" ON "aromas_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "aromas_locales_locale_parent_id_unique" ON "aromas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "aromas_rels_order_idx" ON "aromas_rels" USING btree ("order");
  CREATE INDEX "aromas_rels_parent_idx" ON "aromas_rels" USING btree ("parent_id");
  CREATE INDEX "aromas_rels_path_idx" ON "aromas_rels" USING btree ("path");
  CREATE INDEX "aromas_rels_media_id_idx" ON "aromas_rels" USING btree ("media_id");
  CREATE INDEX "_aromas_v_parent_idx" ON "_aromas_v" USING btree ("parent_id");
  CREATE INDEX "_aromas_v_version_version_adjective_idx" ON "_aromas_v" USING btree ("version_adjective_id");
  CREATE INDEX "_aromas_v_version_version_flavour_idx" ON "_aromas_v" USING btree ("version_flavour_id");
  CREATE INDEX "_aromas_v_version_version_updated_at_idx" ON "_aromas_v" USING btree ("version_updated_at");
  CREATE INDEX "_aromas_v_version_version_created_at_idx" ON "_aromas_v" USING btree ("version_created_at");
  CREATE INDEX "_aromas_v_version_version__status_idx" ON "_aromas_v" USING btree ("version__status");
  CREATE INDEX "_aromas_v_created_at_idx" ON "_aromas_v" USING btree ("created_at");
  CREATE INDEX "_aromas_v_updated_at_idx" ON "_aromas_v" USING btree ("updated_at");
  CREATE INDEX "_aromas_v_snapshot_idx" ON "_aromas_v" USING btree ("snapshot");
  CREATE INDEX "_aromas_v_published_locale_idx" ON "_aromas_v" USING btree ("published_locale");
  CREATE INDEX "_aromas_v_latest_idx" ON "_aromas_v" USING btree ("latest");
  CREATE INDEX "_aromas_v_version_version_title_idx" ON "_aromas_v_locales" USING btree ("version_title","_locale");
  CREATE INDEX "_aromas_v_version_version_slug_idx" ON "_aromas_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_aromas_v_locales_locale_parent_id_unique" ON "_aromas_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_aromas_v_rels_order_idx" ON "_aromas_v_rels" USING btree ("order");
  CREATE INDEX "_aromas_v_rels_parent_idx" ON "_aromas_v_rels" USING btree ("parent_id");
  CREATE INDEX "_aromas_v_rels_path_idx" ON "_aromas_v_rels" USING btree ("path");
  CREATE INDEX "_aromas_v_rels_media_id_idx" ON "_aromas_v_rels" USING btree ("media_id");
  CREATE INDEX "adjectives_meta_image_idx" ON "adjectives" USING btree ("meta_image_id");
  CREATE INDEX "adjectives_updated_at_idx" ON "adjectives" USING btree ("updated_at");
  CREATE INDEX "adjectives_created_at_idx" ON "adjectives" USING btree ("created_at");
  CREATE INDEX "adjectives__status_idx" ON "adjectives" USING btree ("_status");
  CREATE INDEX "adjectives_slug_idx" ON "adjectives_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "adjectives_locales_locale_parent_id_unique" ON "adjectives_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_adjectives_v_parent_idx" ON "_adjectives_v" USING btree ("parent_id");
  CREATE INDEX "_adjectives_v_version_version_meta_image_idx" ON "_adjectives_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_adjectives_v_version_version_updated_at_idx" ON "_adjectives_v" USING btree ("version_updated_at");
  CREATE INDEX "_adjectives_v_version_version_created_at_idx" ON "_adjectives_v" USING btree ("version_created_at");
  CREATE INDEX "_adjectives_v_version_version__status_idx" ON "_adjectives_v" USING btree ("version__status");
  CREATE INDEX "_adjectives_v_created_at_idx" ON "_adjectives_v" USING btree ("created_at");
  CREATE INDEX "_adjectives_v_updated_at_idx" ON "_adjectives_v" USING btree ("updated_at");
  CREATE INDEX "_adjectives_v_snapshot_idx" ON "_adjectives_v" USING btree ("snapshot");
  CREATE INDEX "_adjectives_v_published_locale_idx" ON "_adjectives_v" USING btree ("published_locale");
  CREATE INDEX "_adjectives_v_latest_idx" ON "_adjectives_v" USING btree ("latest");
  CREATE INDEX "_adjectives_v_version_version_slug_idx" ON "_adjectives_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_adjectives_v_locales_locale_parent_id_unique" ON "_adjectives_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "flavours_meta_image_idx" ON "flavours" USING btree ("meta_image_id");
  CREATE INDEX "flavours_updated_at_idx" ON "flavours" USING btree ("updated_at");
  CREATE INDEX "flavours_created_at_idx" ON "flavours" USING btree ("created_at");
  CREATE INDEX "flavours__status_idx" ON "flavours" USING btree ("_status");
  CREATE INDEX "flavours_slug_idx" ON "flavours_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "flavours_locales_locale_parent_id_unique" ON "flavours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_flavours_v_parent_idx" ON "_flavours_v" USING btree ("parent_id");
  CREATE INDEX "_flavours_v_version_version_meta_image_idx" ON "_flavours_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_flavours_v_version_version_updated_at_idx" ON "_flavours_v" USING btree ("version_updated_at");
  CREATE INDEX "_flavours_v_version_version_created_at_idx" ON "_flavours_v" USING btree ("version_created_at");
  CREATE INDEX "_flavours_v_version_version__status_idx" ON "_flavours_v" USING btree ("version__status");
  CREATE INDEX "_flavours_v_created_at_idx" ON "_flavours_v" USING btree ("created_at");
  CREATE INDEX "_flavours_v_updated_at_idx" ON "_flavours_v" USING btree ("updated_at");
  CREATE INDEX "_flavours_v_snapshot_idx" ON "_flavours_v" USING btree ("snapshot");
  CREATE INDEX "_flavours_v_published_locale_idx" ON "_flavours_v" USING btree ("published_locale");
  CREATE INDEX "_flavours_v_latest_idx" ON "_flavours_v" USING btree ("latest");
  CREATE INDEX "_flavours_v_version_version_slug_idx" ON "_flavours_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_flavours_v_locales_locale_parent_id_unique" ON "_flavours_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "styles_icon_key_idx" ON "styles" USING btree ("icon_key");
  CREATE INDEX "styles_updated_at_idx" ON "styles" USING btree ("updated_at");
  CREATE INDEX "styles_created_at_idx" ON "styles" USING btree ("created_at");
  CREATE INDEX "styles__status_idx" ON "styles" USING btree ("_status");
  CREATE INDEX "styles_title_idx" ON "styles_locales" USING btree ("title","_locale");
  CREATE INDEX "styles_slug_idx" ON "styles_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "styles_locales_locale_parent_id_unique" ON "styles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "styles_rels_order_idx" ON "styles_rels" USING btree ("order");
  CREATE INDEX "styles_rels_parent_idx" ON "styles_rels" USING btree ("parent_id");
  CREATE INDEX "styles_rels_path_idx" ON "styles_rels" USING btree ("path");
  CREATE INDEX "styles_rels_media_id_idx" ON "styles_rels" USING btree ("media_id");
  CREATE INDEX "_styles_v_parent_idx" ON "_styles_v" USING btree ("parent_id");
  CREATE INDEX "_styles_v_version_version_icon_key_idx" ON "_styles_v" USING btree ("version_icon_key");
  CREATE INDEX "_styles_v_version_version_updated_at_idx" ON "_styles_v" USING btree ("version_updated_at");
  CREATE INDEX "_styles_v_version_version_created_at_idx" ON "_styles_v" USING btree ("version_created_at");
  CREATE INDEX "_styles_v_version_version__status_idx" ON "_styles_v" USING btree ("version__status");
  CREATE INDEX "_styles_v_created_at_idx" ON "_styles_v" USING btree ("created_at");
  CREATE INDEX "_styles_v_updated_at_idx" ON "_styles_v" USING btree ("updated_at");
  CREATE INDEX "_styles_v_snapshot_idx" ON "_styles_v" USING btree ("snapshot");
  CREATE INDEX "_styles_v_published_locale_idx" ON "_styles_v" USING btree ("published_locale");
  CREATE INDEX "_styles_v_latest_idx" ON "_styles_v" USING btree ("latest");
  CREATE INDEX "_styles_v_version_version_title_idx" ON "_styles_v_locales" USING btree ("version_title","_locale");
  CREATE INDEX "_styles_v_version_version_slug_idx" ON "_styles_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_styles_v_locales_locale_parent_id_unique" ON "_styles_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_styles_v_rels_order_idx" ON "_styles_v_rels" USING btree ("order");
  CREATE INDEX "_styles_v_rels_parent_idx" ON "_styles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_styles_v_rels_path_idx" ON "_styles_v_rels" USING btree ("path");
  CREATE INDEX "_styles_v_rels_media_id_idx" ON "_styles_v_rels" USING btree ("media_id");
  CREATE INDEX "climates_climate_idx" ON "climates" USING btree ("climate");
  CREATE INDEX "climates_climate_temperature_idx" ON "climates" USING btree ("climate_temperature");
  CREATE INDEX "climates_climate_conditions_climate_conditions_diurnal_range_idx" ON "climates" USING btree ("climate_conditions_diurnal_range");
  CREATE INDEX "climates_climate_conditions_climate_conditions_humidity_idx" ON "climates" USING btree ("climate_conditions_humidity");
  CREATE INDEX "climates_updated_at_idx" ON "climates" USING btree ("updated_at");
  CREATE INDEX "climates_created_at_idx" ON "climates" USING btree ("created_at");
  CREATE INDEX "climates__status_idx" ON "climates" USING btree ("_status");
  CREATE INDEX "climates_title_idx" ON "climates_locales" USING btree ("title","_locale");
  CREATE INDEX "climates_slug_idx" ON "climates_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "climates_locales_locale_parent_id_unique" ON "climates_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "climates_rels_order_idx" ON "climates_rels" USING btree ("order");
  CREATE INDEX "climates_rels_parent_idx" ON "climates_rels" USING btree ("parent_id");
  CREATE INDEX "climates_rels_path_idx" ON "climates_rels" USING btree ("path");
  CREATE INDEX "climates_rels_regions_id_idx" ON "climates_rels" USING btree ("regions_id");
  CREATE INDEX "climates_rels_grape_varieties_id_idx" ON "climates_rels" USING btree ("grape_varieties_id");
  CREATE INDEX "climates_rels_media_id_idx" ON "climates_rels" USING btree ("media_id");
  CREATE INDEX "_climates_v_parent_idx" ON "_climates_v" USING btree ("parent_id");
  CREATE INDEX "_climates_v_version_version_climate_idx" ON "_climates_v" USING btree ("version_climate");
  CREATE INDEX "_climates_v_version_version_climate_temperature_idx" ON "_climates_v" USING btree ("version_climate_temperature");
  CREATE INDEX "_climates_v_version_climate_conditions_version_climate_conditions_diurnal_range_idx" ON "_climates_v" USING btree ("version_climate_conditions_diurnal_range");
  CREATE INDEX "_climates_v_version_climate_conditions_version_climate_conditions_humidity_idx" ON "_climates_v" USING btree ("version_climate_conditions_humidity");
  CREATE INDEX "_climates_v_version_version_updated_at_idx" ON "_climates_v" USING btree ("version_updated_at");
  CREATE INDEX "_climates_v_version_version_created_at_idx" ON "_climates_v" USING btree ("version_created_at");
  CREATE INDEX "_climates_v_version_version__status_idx" ON "_climates_v" USING btree ("version__status");
  CREATE INDEX "_climates_v_created_at_idx" ON "_climates_v" USING btree ("created_at");
  CREATE INDEX "_climates_v_updated_at_idx" ON "_climates_v" USING btree ("updated_at");
  CREATE INDEX "_climates_v_snapshot_idx" ON "_climates_v" USING btree ("snapshot");
  CREATE INDEX "_climates_v_published_locale_idx" ON "_climates_v" USING btree ("published_locale");
  CREATE INDEX "_climates_v_latest_idx" ON "_climates_v" USING btree ("latest");
  CREATE INDEX "_climates_v_version_version_title_idx" ON "_climates_v_locales" USING btree ("version_title","_locale");
  CREATE INDEX "_climates_v_version_version_slug_idx" ON "_climates_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_climates_v_locales_locale_parent_id_unique" ON "_climates_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_climates_v_rels_order_idx" ON "_climates_v_rels" USING btree ("order");
  CREATE INDEX "_climates_v_rels_parent_idx" ON "_climates_v_rels" USING btree ("parent_id");
  CREATE INDEX "_climates_v_rels_path_idx" ON "_climates_v_rels" USING btree ("path");
  CREATE INDEX "_climates_v_rels_regions_id_idx" ON "_climates_v_rels" USING btree ("regions_id");
  CREATE INDEX "_climates_v_rels_grape_varieties_id_idx" ON "_climates_v_rels" USING btree ("grape_varieties_id");
  CREATE INDEX "_climates_v_rels_media_id_idx" ON "_climates_v_rels" USING btree ("media_id");
  CREATE INDEX "moods_updated_at_idx" ON "moods" USING btree ("updated_at");
  CREATE INDEX "moods_created_at_idx" ON "moods" USING btree ("created_at");
  CREATE INDEX "moods__status_idx" ON "moods" USING btree ("_status");
  CREATE INDEX "moods_title_idx" ON "moods_locales" USING btree ("title","_locale");
  CREATE INDEX "moods_slug_idx" ON "moods_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "moods_locales_locale_parent_id_unique" ON "moods_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "moods_rels_order_idx" ON "moods_rels" USING btree ("order");
  CREATE INDEX "moods_rels_parent_idx" ON "moods_rels" USING btree ("parent_id");
  CREATE INDEX "moods_rels_path_idx" ON "moods_rels" USING btree ("path");
  CREATE INDEX "moods_rels_media_id_idx" ON "moods_rels" USING btree ("media_id");
  CREATE INDEX "_moods_v_parent_idx" ON "_moods_v" USING btree ("parent_id");
  CREATE INDEX "_moods_v_version_version_updated_at_idx" ON "_moods_v" USING btree ("version_updated_at");
  CREATE INDEX "_moods_v_version_version_created_at_idx" ON "_moods_v" USING btree ("version_created_at");
  CREATE INDEX "_moods_v_version_version__status_idx" ON "_moods_v" USING btree ("version__status");
  CREATE INDEX "_moods_v_created_at_idx" ON "_moods_v" USING btree ("created_at");
  CREATE INDEX "_moods_v_updated_at_idx" ON "_moods_v" USING btree ("updated_at");
  CREATE INDEX "_moods_v_snapshot_idx" ON "_moods_v" USING btree ("snapshot");
  CREATE INDEX "_moods_v_published_locale_idx" ON "_moods_v" USING btree ("published_locale");
  CREATE INDEX "_moods_v_latest_idx" ON "_moods_v" USING btree ("latest");
  CREATE INDEX "_moods_v_version_version_title_idx" ON "_moods_v_locales" USING btree ("version_title","_locale");
  CREATE INDEX "_moods_v_version_version_slug_idx" ON "_moods_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_moods_v_locales_locale_parent_id_unique" ON "_moods_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_moods_v_rels_order_idx" ON "_moods_v_rels" USING btree ("order");
  CREATE INDEX "_moods_v_rels_parent_idx" ON "_moods_v_rels" USING btree ("parent_id");
  CREATE INDEX "_moods_v_rels_path_idx" ON "_moods_v_rels" USING btree ("path");
  CREATE INDEX "_moods_v_rels_media_id_idx" ON "_moods_v_rels" USING btree ("media_id");
  CREATE INDEX "dishes_updated_at_idx" ON "dishes" USING btree ("updated_at");
  CREATE INDEX "dishes_created_at_idx" ON "dishes" USING btree ("created_at");
  CREATE INDEX "dishes__status_idx" ON "dishes" USING btree ("_status");
  CREATE INDEX "dishes_title_idx" ON "dishes_locales" USING btree ("title","_locale");
  CREATE INDEX "dishes_slug_idx" ON "dishes_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "dishes_locales_locale_parent_id_unique" ON "dishes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "dishes_rels_order_idx" ON "dishes_rels" USING btree ("order");
  CREATE INDEX "dishes_rels_parent_idx" ON "dishes_rels" USING btree ("parent_id");
  CREATE INDEX "dishes_rels_path_idx" ON "dishes_rels" USING btree ("path");
  CREATE INDEX "dishes_rels_media_id_idx" ON "dishes_rels" USING btree ("media_id");
  CREATE INDEX "_dishes_v_parent_idx" ON "_dishes_v" USING btree ("parent_id");
  CREATE INDEX "_dishes_v_version_version_updated_at_idx" ON "_dishes_v" USING btree ("version_updated_at");
  CREATE INDEX "_dishes_v_version_version_created_at_idx" ON "_dishes_v" USING btree ("version_created_at");
  CREATE INDEX "_dishes_v_version_version__status_idx" ON "_dishes_v" USING btree ("version__status");
  CREATE INDEX "_dishes_v_created_at_idx" ON "_dishes_v" USING btree ("created_at");
  CREATE INDEX "_dishes_v_updated_at_idx" ON "_dishes_v" USING btree ("updated_at");
  CREATE INDEX "_dishes_v_snapshot_idx" ON "_dishes_v" USING btree ("snapshot");
  CREATE INDEX "_dishes_v_published_locale_idx" ON "_dishes_v" USING btree ("published_locale");
  CREATE INDEX "_dishes_v_latest_idx" ON "_dishes_v" USING btree ("latest");
  CREATE INDEX "_dishes_v_version_version_title_idx" ON "_dishes_v_locales" USING btree ("version_title","_locale");
  CREATE INDEX "_dishes_v_version_version_slug_idx" ON "_dishes_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_dishes_v_locales_locale_parent_id_unique" ON "_dishes_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_dishes_v_rels_order_idx" ON "_dishes_v_rels" USING btree ("order");
  CREATE INDEX "_dishes_v_rels_parent_idx" ON "_dishes_v_rels" USING btree ("parent_id");
  CREATE INDEX "_dishes_v_rels_path_idx" ON "_dishes_v_rels" USING btree ("path");
  CREATE INDEX "_dishes_v_rels_media_id_idx" ON "_dishes_v_rels" USING btree ("media_id");
  CREATE INDEX "flat_wine_variants_related_wineries_order_idx" ON "flat_wine_variants_related_wineries" USING btree ("_order");
  CREATE INDEX "flat_wine_variants_related_wineries_parent_id_idx" ON "flat_wine_variants_related_wineries" USING btree ("_parent_id");
  CREATE INDEX "flat_wine_variants_related_regions_order_idx" ON "flat_wine_variants_related_regions" USING btree ("_order");
  CREATE INDEX "flat_wine_variants_related_regions_parent_id_idx" ON "flat_wine_variants_related_regions" USING btree ("_parent_id");
  CREATE INDEX "flat_wine_variants_aromas_order_idx" ON "flat_wine_variants_aromas" USING btree ("_order");
  CREATE INDEX "flat_wine_variants_aromas_parent_id_idx" ON "flat_wine_variants_aromas" USING btree ("_parent_id");
  CREATE INDEX "flat_wine_variants_tags_order_idx" ON "flat_wine_variants_tags" USING btree ("_order");
  CREATE INDEX "flat_wine_variants_tags_parent_id_idx" ON "flat_wine_variants_tags" USING btree ("_parent_id");
  CREATE INDEX "flat_wine_variants_moods_order_idx" ON "flat_wine_variants_moods" USING btree ("_order");
  CREATE INDEX "flat_wine_variants_moods_parent_id_idx" ON "flat_wine_variants_moods" USING btree ("_parent_id");
  CREATE INDEX "flat_wine_variants_grape_varieties_order_idx" ON "flat_wine_variants_grape_varieties" USING btree ("_order");
  CREATE INDEX "flat_wine_variants_grape_varieties_parent_id_idx" ON "flat_wine_variants_grape_varieties" USING btree ("_parent_id");
  CREATE INDEX "flat_wine_variants_climates_order_idx" ON "flat_wine_variants_climates" USING btree ("_order");
  CREATE INDEX "flat_wine_variants_climates_parent_id_idx" ON "flat_wine_variants_climates" USING btree ("_parent_id");
  CREATE INDEX "flat_wine_variants_dishes_order_idx" ON "flat_wine_variants_dishes" USING btree ("_order");
  CREATE INDEX "flat_wine_variants_dishes_parent_id_idx" ON "flat_wine_variants_dishes" USING btree ("_parent_id");
  CREATE INDEX "flat_wine_variants_original_variant_idx" ON "flat_wine_variants" USING btree ("original_variant_id");
  CREATE INDEX "flat_wine_variants_sku_idx" ON "flat_wine_variants" USING btree ("sku");
  CREATE INDEX "flat_wine_variants_wine_title_idx" ON "flat_wine_variants" USING btree ("wine_title");
  CREATE INDEX "flat_wine_variants_winery_title_idx" ON "flat_wine_variants" USING btree ("winery_title");
  CREATE INDEX "flat_wine_variants_winery_code_idx" ON "flat_wine_variants" USING btree ("winery_code");
  CREATE INDEX "flat_wine_variants_region_title_idx" ON "flat_wine_variants" USING btree ("region_title");
  CREATE INDEX "flat_wine_variants_country_title_idx" ON "flat_wine_variants" USING btree ("country_title");
  CREATE INDEX "flat_wine_variants_country_title_en_idx" ON "flat_wine_variants" USING btree ("country_title_en");
  CREATE INDEX "flat_wine_variants_style_title_idx" ON "flat_wine_variants" USING btree ("style_title");
  CREATE INDEX "flat_wine_variants_style_title_en_idx" ON "flat_wine_variants" USING btree ("style_title_en");
  CREATE INDEX "flat_wine_variants_style_icon_key_idx" ON "flat_wine_variants" USING btree ("style_icon_key");
  CREATE INDEX "flat_wine_variants_style_slug_idx" ON "flat_wine_variants" USING btree ("style_slug");
  CREATE INDEX "flat_wine_variants_size_idx" ON "flat_wine_variants" USING btree ("size");
  CREATE INDEX "flat_wine_variants_vintage_idx" ON "flat_wine_variants" USING btree ("vintage");
  CREATE INDEX "flat_wine_variants_price_idx" ON "flat_wine_variants" USING btree ("price");
  CREATE INDEX "flat_wine_variants_stock_on_hand_idx" ON "flat_wine_variants" USING btree ("stock_on_hand");
  CREATE INDEX "flat_wine_variants_can_backorder_idx" ON "flat_wine_variants" USING btree ("can_backorder");
  CREATE INDEX "flat_wine_variants_max_backorder_quantity_idx" ON "flat_wine_variants" USING btree ("max_backorder_quantity");
  CREATE INDEX "flat_wine_variants_serving_temp_idx" ON "flat_wine_variants" USING btree ("serving_temp");
  CREATE INDEX "flat_wine_variants_decanting_idx" ON "flat_wine_variants" USING btree ("decanting");
  CREATE INDEX "flat_wine_variants_tasting_profile_idx" ON "flat_wine_variants" USING btree ("tasting_profile");
  CREATE INDEX "flat_wine_variants_description_idx" ON "flat_wine_variants" USING btree ("description");
  CREATE INDEX "flat_wine_variants_description_en_idx" ON "flat_wine_variants" USING btree ("description_en");
  CREATE INDEX "flat_wine_variants_slug_idx" ON "flat_wine_variants" USING btree ("slug");
  CREATE INDEX "flat_wine_variants_synced_at_idx" ON "flat_wine_variants" USING btree ("synced_at");
  CREATE INDEX "flat_wine_variants_is_published_idx" ON "flat_wine_variants" USING btree ("is_published");
  CREATE INDEX "flat_wine_variants_updated_at_idx" ON "flat_wine_variants" USING btree ("updated_at");
  CREATE INDEX "flat_wine_variants_created_at_idx" ON "flat_wine_variants" USING btree ("created_at");
  CREATE INDEX "flat_wine_variants__status_idx" ON "flat_wine_variants" USING btree ("_status");
  CREATE INDEX "_flat_wine_variants_v_version_related_wineries_order_idx" ON "_flat_wine_variants_v_version_related_wineries" USING btree ("_order");
  CREATE INDEX "_flat_wine_variants_v_version_related_wineries_parent_id_idx" ON "_flat_wine_variants_v_version_related_wineries" USING btree ("_parent_id");
  CREATE INDEX "_flat_wine_variants_v_version_related_regions_order_idx" ON "_flat_wine_variants_v_version_related_regions" USING btree ("_order");
  CREATE INDEX "_flat_wine_variants_v_version_related_regions_parent_id_idx" ON "_flat_wine_variants_v_version_related_regions" USING btree ("_parent_id");
  CREATE INDEX "_flat_wine_variants_v_version_aromas_order_idx" ON "_flat_wine_variants_v_version_aromas" USING btree ("_order");
  CREATE INDEX "_flat_wine_variants_v_version_aromas_parent_id_idx" ON "_flat_wine_variants_v_version_aromas" USING btree ("_parent_id");
  CREATE INDEX "_flat_wine_variants_v_version_tags_order_idx" ON "_flat_wine_variants_v_version_tags" USING btree ("_order");
  CREATE INDEX "_flat_wine_variants_v_version_tags_parent_id_idx" ON "_flat_wine_variants_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_flat_wine_variants_v_version_moods_order_idx" ON "_flat_wine_variants_v_version_moods" USING btree ("_order");
  CREATE INDEX "_flat_wine_variants_v_version_moods_parent_id_idx" ON "_flat_wine_variants_v_version_moods" USING btree ("_parent_id");
  CREATE INDEX "_flat_wine_variants_v_version_grape_varieties_order_idx" ON "_flat_wine_variants_v_version_grape_varieties" USING btree ("_order");
  CREATE INDEX "_flat_wine_variants_v_version_grape_varieties_parent_id_idx" ON "_flat_wine_variants_v_version_grape_varieties" USING btree ("_parent_id");
  CREATE INDEX "_flat_wine_variants_v_version_climates_order_idx" ON "_flat_wine_variants_v_version_climates" USING btree ("_order");
  CREATE INDEX "_flat_wine_variants_v_version_climates_parent_id_idx" ON "_flat_wine_variants_v_version_climates" USING btree ("_parent_id");
  CREATE INDEX "_flat_wine_variants_v_version_dishes_order_idx" ON "_flat_wine_variants_v_version_dishes" USING btree ("_order");
  CREATE INDEX "_flat_wine_variants_v_version_dishes_parent_id_idx" ON "_flat_wine_variants_v_version_dishes" USING btree ("_parent_id");
  CREATE INDEX "_flat_wine_variants_v_parent_idx" ON "_flat_wine_variants_v" USING btree ("parent_id");
  CREATE INDEX "_flat_wine_variants_v_version_version_original_variant_idx" ON "_flat_wine_variants_v" USING btree ("version_original_variant_id");
  CREATE INDEX "_flat_wine_variants_v_version_version_sku_idx" ON "_flat_wine_variants_v" USING btree ("version_sku");
  CREATE INDEX "_flat_wine_variants_v_version_version_wine_title_idx" ON "_flat_wine_variants_v" USING btree ("version_wine_title");
  CREATE INDEX "_flat_wine_variants_v_version_version_winery_title_idx" ON "_flat_wine_variants_v" USING btree ("version_winery_title");
  CREATE INDEX "_flat_wine_variants_v_version_version_winery_code_idx" ON "_flat_wine_variants_v" USING btree ("version_winery_code");
  CREATE INDEX "_flat_wine_variants_v_version_version_region_title_idx" ON "_flat_wine_variants_v" USING btree ("version_region_title");
  CREATE INDEX "_flat_wine_variants_v_version_version_country_title_idx" ON "_flat_wine_variants_v" USING btree ("version_country_title");
  CREATE INDEX "_flat_wine_variants_v_version_version_country_title_en_idx" ON "_flat_wine_variants_v" USING btree ("version_country_title_en");
  CREATE INDEX "_flat_wine_variants_v_version_version_style_title_idx" ON "_flat_wine_variants_v" USING btree ("version_style_title");
  CREATE INDEX "_flat_wine_variants_v_version_version_style_title_en_idx" ON "_flat_wine_variants_v" USING btree ("version_style_title_en");
  CREATE INDEX "_flat_wine_variants_v_version_version_style_icon_key_idx" ON "_flat_wine_variants_v" USING btree ("version_style_icon_key");
  CREATE INDEX "_flat_wine_variants_v_version_version_style_slug_idx" ON "_flat_wine_variants_v" USING btree ("version_style_slug");
  CREATE INDEX "_flat_wine_variants_v_version_version_size_idx" ON "_flat_wine_variants_v" USING btree ("version_size");
  CREATE INDEX "_flat_wine_variants_v_version_version_vintage_idx" ON "_flat_wine_variants_v" USING btree ("version_vintage");
  CREATE INDEX "_flat_wine_variants_v_version_version_price_idx" ON "_flat_wine_variants_v" USING btree ("version_price");
  CREATE INDEX "_flat_wine_variants_v_version_version_stock_on_hand_idx" ON "_flat_wine_variants_v" USING btree ("version_stock_on_hand");
  CREATE INDEX "_flat_wine_variants_v_version_version_can_backorder_idx" ON "_flat_wine_variants_v" USING btree ("version_can_backorder");
  CREATE INDEX "_flat_wine_variants_v_version_version_max_backorder_quantity_idx" ON "_flat_wine_variants_v" USING btree ("version_max_backorder_quantity");
  CREATE INDEX "_flat_wine_variants_v_version_version_serving_temp_idx" ON "_flat_wine_variants_v" USING btree ("version_serving_temp");
  CREATE INDEX "_flat_wine_variants_v_version_version_decanting_idx" ON "_flat_wine_variants_v" USING btree ("version_decanting");
  CREATE INDEX "_flat_wine_variants_v_version_version_tasting_profile_idx" ON "_flat_wine_variants_v" USING btree ("version_tasting_profile");
  CREATE INDEX "_flat_wine_variants_v_version_version_description_idx" ON "_flat_wine_variants_v" USING btree ("version_description");
  CREATE INDEX "_flat_wine_variants_v_version_version_description_en_idx" ON "_flat_wine_variants_v" USING btree ("version_description_en");
  CREATE INDEX "_flat_wine_variants_v_version_version_slug_idx" ON "_flat_wine_variants_v" USING btree ("version_slug");
  CREATE INDEX "_flat_wine_variants_v_version_version_synced_at_idx" ON "_flat_wine_variants_v" USING btree ("version_synced_at");
  CREATE INDEX "_flat_wine_variants_v_version_version_is_published_idx" ON "_flat_wine_variants_v" USING btree ("version_is_published");
  CREATE INDEX "_flat_wine_variants_v_version_version_updated_at_idx" ON "_flat_wine_variants_v" USING btree ("version_updated_at");
  CREATE INDEX "_flat_wine_variants_v_version_version_created_at_idx" ON "_flat_wine_variants_v" USING btree ("version_created_at");
  CREATE INDEX "_flat_wine_variants_v_version_version__status_idx" ON "_flat_wine_variants_v" USING btree ("version__status");
  CREATE INDEX "_flat_wine_variants_v_created_at_idx" ON "_flat_wine_variants_v" USING btree ("created_at");
  CREATE INDEX "_flat_wine_variants_v_updated_at_idx" ON "_flat_wine_variants_v" USING btree ("updated_at");
  CREATE INDEX "_flat_wine_variants_v_snapshot_idx" ON "_flat_wine_variants_v" USING btree ("snapshot");
  CREATE INDEX "_flat_wine_variants_v_published_locale_idx" ON "_flat_wine_variants_v" USING btree ("published_locale");
  CREATE INDEX "_flat_wine_variants_v_latest_idx" ON "_flat_wine_variants_v" USING btree ("latest");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_workflow_slug_idx" ON "payload_jobs" USING btree ("workflow_slug");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_invoices_id_idx" ON "payload_locked_documents_rels" USING btree ("invoices_id");
  CREATE INDEX "payload_locked_documents_rels_active_carts_id_idx" ON "payload_locked_documents_rels" USING btree ("active_carts_id");
  CREATE INDEX "payload_locked_documents_rels_saved_carts_id_idx" ON "payload_locked_documents_rels" USING btree ("saved_carts_id");
  CREATE INDEX "payload_locked_documents_rels_shared_carts_id_idx" ON "payload_locked_documents_rels" USING btree ("shared_carts_id");
  CREATE INDEX "payload_locked_documents_rels_stock_reservations_id_idx" ON "payload_locked_documents_rels" USING btree ("stock_reservations_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_wines_id_idx" ON "payload_locked_documents_rels" USING btree ("wines_id");
  CREATE INDEX "payload_locked_documents_rels_wine_variants_id_idx" ON "payload_locked_documents_rels" USING btree ("wine_variants_id");
  CREATE INDEX "payload_locked_documents_rels_wineries_id_idx" ON "payload_locked_documents_rels" USING btree ("wineries_id");
  CREATE INDEX "payload_locked_documents_rels_regions_id_idx" ON "payload_locked_documents_rels" USING btree ("regions_id");
  CREATE INDEX "payload_locked_documents_rels_wine_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("wine_countries_id");
  CREATE INDEX "payload_locked_documents_rels_grape_varieties_id_idx" ON "payload_locked_documents_rels" USING btree ("grape_varieties_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_aromas_id_idx" ON "payload_locked_documents_rels" USING btree ("aromas_id");
  CREATE INDEX "payload_locked_documents_rels_adjectives_id_idx" ON "payload_locked_documents_rels" USING btree ("adjectives_id");
  CREATE INDEX "payload_locked_documents_rels_flavours_id_idx" ON "payload_locked_documents_rels" USING btree ("flavours_id");
  CREATE INDEX "payload_locked_documents_rels_styles_id_idx" ON "payload_locked_documents_rels" USING btree ("styles_id");
  CREATE INDEX "payload_locked_documents_rels_climates_id_idx" ON "payload_locked_documents_rels" USING btree ("climates_id");
  CREATE INDEX "payload_locked_documents_rels_moods_id_idx" ON "payload_locked_documents_rels" USING btree ("moods_id");
  CREATE INDEX "payload_locked_documents_rels_dishes_id_idx" ON "payload_locked_documents_rels" USING btree ("dishes_id");
  CREATE INDEX "payload_locked_documents_rels_flat_wine_variants_id_idx" ON "payload_locked_documents_rels" USING btree ("flat_wine_variants_id");
  CREATE INDEX "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_customers_id_idx" ON "payload_preferences_rels" USING btree ("customers_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "invoices" CASCADE;
  DROP TABLE "active_carts_items" CASCADE;
  DROP TABLE "active_carts" CASCADE;
  DROP TABLE "saved_carts_items" CASCADE;
  DROP TABLE "saved_carts" CASCADE;
  DROP TABLE "shared_carts_items" CASCADE;
  DROP TABLE "shared_carts" CASCADE;
  DROP TABLE "stock_reservations" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "wines" CASCADE;
  DROP TABLE "wines_locales" CASCADE;
  DROP TABLE "wines_rels" CASCADE;
  DROP TABLE "_wines_v" CASCADE;
  DROP TABLE "_wines_v_locales" CASCADE;
  DROP TABLE "_wines_v_rels" CASCADE;
  DROP TABLE "wine_variants_grape_varieties" CASCADE;
  DROP TABLE "wine_variants" CASCADE;
  DROP TABLE "wine_variants_locales" CASCADE;
  DROP TABLE "wine_variants_rels" CASCADE;
  DROP TABLE "_wine_variants_v_version_grape_varieties" CASCADE;
  DROP TABLE "_wine_variants_v" CASCADE;
  DROP TABLE "_wine_variants_v_locales" CASCADE;
  DROP TABLE "_wine_variants_v_rels" CASCADE;
  DROP TABLE "wineries" CASCADE;
  DROP TABLE "wineries_locales" CASCADE;
  DROP TABLE "wineries_rels" CASCADE;
  DROP TABLE "_wineries_v" CASCADE;
  DROP TABLE "_wineries_v_locales" CASCADE;
  DROP TABLE "_wineries_v_rels" CASCADE;
  DROP TABLE "regions" CASCADE;
  DROP TABLE "regions_locales" CASCADE;
  DROP TABLE "regions_rels" CASCADE;
  DROP TABLE "_regions_v" CASCADE;
  DROP TABLE "_regions_v_locales" CASCADE;
  DROP TABLE "_regions_v_rels" CASCADE;
  DROP TABLE "wine_countries" CASCADE;
  DROP TABLE "wine_countries_locales" CASCADE;
  DROP TABLE "wine_countries_rels" CASCADE;
  DROP TABLE "_wine_countries_v" CASCADE;
  DROP TABLE "_wine_countries_v_locales" CASCADE;
  DROP TABLE "_wine_countries_v_rels" CASCADE;
  DROP TABLE "grape_varieties_synonyms" CASCADE;
  DROP TABLE "grape_varieties" CASCADE;
  DROP TABLE "grape_varieties_locales" CASCADE;
  DROP TABLE "grape_varieties_rels" CASCADE;
  DROP TABLE "_grape_varieties_v_version_synonyms" CASCADE;
  DROP TABLE "_grape_varieties_v" CASCADE;
  DROP TABLE "_grape_varieties_v_locales" CASCADE;
  DROP TABLE "_grape_varieties_v_rels" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "tags_locales" CASCADE;
  DROP TABLE "tags_rels" CASCADE;
  DROP TABLE "_tags_v" CASCADE;
  DROP TABLE "_tags_v_locales" CASCADE;
  DROP TABLE "_tags_v_rels" CASCADE;
  DROP TABLE "aromas" CASCADE;
  DROP TABLE "aromas_locales" CASCADE;
  DROP TABLE "aromas_rels" CASCADE;
  DROP TABLE "_aromas_v" CASCADE;
  DROP TABLE "_aromas_v_locales" CASCADE;
  DROP TABLE "_aromas_v_rels" CASCADE;
  DROP TABLE "adjectives" CASCADE;
  DROP TABLE "adjectives_locales" CASCADE;
  DROP TABLE "_adjectives_v" CASCADE;
  DROP TABLE "_adjectives_v_locales" CASCADE;
  DROP TABLE "flavours" CASCADE;
  DROP TABLE "flavours_locales" CASCADE;
  DROP TABLE "_flavours_v" CASCADE;
  DROP TABLE "_flavours_v_locales" CASCADE;
  DROP TABLE "styles" CASCADE;
  DROP TABLE "styles_locales" CASCADE;
  DROP TABLE "styles_rels" CASCADE;
  DROP TABLE "_styles_v" CASCADE;
  DROP TABLE "_styles_v_locales" CASCADE;
  DROP TABLE "_styles_v_rels" CASCADE;
  DROP TABLE "climates" CASCADE;
  DROP TABLE "climates_locales" CASCADE;
  DROP TABLE "climates_rels" CASCADE;
  DROP TABLE "_climates_v" CASCADE;
  DROP TABLE "_climates_v_locales" CASCADE;
  DROP TABLE "_climates_v_rels" CASCADE;
  DROP TABLE "moods" CASCADE;
  DROP TABLE "moods_locales" CASCADE;
  DROP TABLE "moods_rels" CASCADE;
  DROP TABLE "_moods_v" CASCADE;
  DROP TABLE "_moods_v_locales" CASCADE;
  DROP TABLE "_moods_v_rels" CASCADE;
  DROP TABLE "dishes" CASCADE;
  DROP TABLE "dishes_locales" CASCADE;
  DROP TABLE "dishes_rels" CASCADE;
  DROP TABLE "_dishes_v" CASCADE;
  DROP TABLE "_dishes_v_locales" CASCADE;
  DROP TABLE "_dishes_v_rels" CASCADE;
  DROP TABLE "flat_wine_variants_related_wineries" CASCADE;
  DROP TABLE "flat_wine_variants_related_regions" CASCADE;
  DROP TABLE "flat_wine_variants_aromas" CASCADE;
  DROP TABLE "flat_wine_variants_tags" CASCADE;
  DROP TABLE "flat_wine_variants_moods" CASCADE;
  DROP TABLE "flat_wine_variants_grape_varieties" CASCADE;
  DROP TABLE "flat_wine_variants_climates" CASCADE;
  DROP TABLE "flat_wine_variants_dishes" CASCADE;
  DROP TABLE "flat_wine_variants" CASCADE;
  DROP TABLE "_flat_wine_variants_v_version_related_wineries" CASCADE;
  DROP TABLE "_flat_wine_variants_v_version_related_regions" CASCADE;
  DROP TABLE "_flat_wine_variants_v_version_aromas" CASCADE;
  DROP TABLE "_flat_wine_variants_v_version_tags" CASCADE;
  DROP TABLE "_flat_wine_variants_v_version_moods" CASCADE;
  DROP TABLE "_flat_wine_variants_v_version_grape_varieties" CASCADE;
  DROP TABLE "_flat_wine_variants_v_version_climates" CASCADE;
  DROP TABLE "_flat_wine_variants_v_version_dishes" CASCADE;
  DROP TABLE "_flat_wine_variants_v" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_stock_reservations_status";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_payment_method";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_wines_status";
  DROP TYPE "public"."enum__wines_v_version_status";
  DROP TYPE "public"."enum__wines_v_published_locale";
  DROP TYPE "public"."enum_wine_variants_size";
  DROP TYPE "public"."enum_wine_variants_serving_temp";
  DROP TYPE "public"."enum_wine_variants_status";
  DROP TYPE "public"."enum__wine_variants_v_version_size";
  DROP TYPE "public"."enum__wine_variants_v_version_serving_temp";
  DROP TYPE "public"."enum__wine_variants_v_version_status";
  DROP TYPE "public"."enum__wine_variants_v_published_locale";
  DROP TYPE "public"."enum_wineries_status";
  DROP TYPE "public"."enum__wineries_v_version_status";
  DROP TYPE "public"."enum__wineries_v_published_locale";
  DROP TYPE "public"."enum_regions_price_range";
  DROP TYPE "public"."enum_regions_status";
  DROP TYPE "public"."enum__regions_v_version_price_range";
  DROP TYPE "public"."enum__regions_v_version_status";
  DROP TYPE "public"."enum__regions_v_published_locale";
  DROP TYPE "public"."enum_wine_countries_status";
  DROP TYPE "public"."enum__wine_countries_v_version_status";
  DROP TYPE "public"."enum__wine_countries_v_published_locale";
  DROP TYPE "public"."enum_grape_varieties_skin";
  DROP TYPE "public"."enum_grape_varieties_status";
  DROP TYPE "public"."enum__grape_varieties_v_version_skin";
  DROP TYPE "public"."enum__grape_varieties_v_version_status";
  DROP TYPE "public"."enum__grape_varieties_v_published_locale";
  DROP TYPE "public"."enum_tags_status";
  DROP TYPE "public"."enum__tags_v_version_status";
  DROP TYPE "public"."enum__tags_v_published_locale";
  DROP TYPE "public"."enum_aromas_status";
  DROP TYPE "public"."enum__aromas_v_version_status";
  DROP TYPE "public"."enum__aromas_v_published_locale";
  DROP TYPE "public"."enum_adjectives_status";
  DROP TYPE "public"."enum__adjectives_v_version_status";
  DROP TYPE "public"."enum__adjectives_v_published_locale";
  DROP TYPE "public"."enum_flavours_category";
  DROP TYPE "public"."enum_flavours_color_group";
  DROP TYPE "public"."enum_flavours_status";
  DROP TYPE "public"."enum__flavours_v_version_category";
  DROP TYPE "public"."enum__flavours_v_version_color_group";
  DROP TYPE "public"."enum__flavours_v_version_status";
  DROP TYPE "public"."enum__flavours_v_published_locale";
  DROP TYPE "public"."enum_styles_status";
  DROP TYPE "public"."enum__styles_v_version_status";
  DROP TYPE "public"."enum__styles_v_published_locale";
  DROP TYPE "public"."enum_climates_climate";
  DROP TYPE "public"."enum_climates_climate_temperature";
  DROP TYPE "public"."enum_climates_climate_conditions_diurnal_range";
  DROP TYPE "public"."enum_climates_climate_conditions_humidity";
  DROP TYPE "public"."enum_climates_status";
  DROP TYPE "public"."enum__climates_v_version_climate";
  DROP TYPE "public"."enum__climates_v_version_climate_temperature";
  DROP TYPE "public"."enum__climates_v_version_climate_conditions_diurnal_range";
  DROP TYPE "public"."enum__climates_v_version_climate_conditions_humidity";
  DROP TYPE "public"."enum__climates_v_version_status";
  DROP TYPE "public"."enum__climates_v_published_locale";
  DROP TYPE "public"."enum_moods_status";
  DROP TYPE "public"."enum__moods_v_version_status";
  DROP TYPE "public"."enum__moods_v_published_locale";
  DROP TYPE "public"."enum_dishes_status";
  DROP TYPE "public"."enum__dishes_v_version_status";
  DROP TYPE "public"."enum__dishes_v_published_locale";
  DROP TYPE "public"."enum_flat_wine_variants_status";
  DROP TYPE "public"."enum__flat_wine_variants_v_version_status";
  DROP TYPE "public"."enum__flat_wine_variants_v_published_locale";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_workflow_slug";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
