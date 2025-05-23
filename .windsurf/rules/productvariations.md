---
trigger: always_on
---

create table public.product_variations (
  id uuid not null default extensions.uuid_generate_v4 (),
  product_id uuid not null,
  name character varying not null,
  sku character varying null,
  barcode character varying null,
  price numeric not null,
  wholesale_price numeric null,
  min_wholesale_qty integer null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint product_variations_pkey primary key (id),
  constraint product_variations_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_product_variations_product_id on public.product_variations using btree (product_id) TABLESPACE pg_default;