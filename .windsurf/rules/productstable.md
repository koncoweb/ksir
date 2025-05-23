---
trigger: always_on
---

create table public.products (
  id uuid not null default gen_random_uuid (),
  company_id uuid not null,
  name character varying(255) not null,
  description text null,
  price numeric(10, 2) not null,
  cost numeric(10, 2) null,
  sku character varying(100) null,
  barcode character varying(100) null,
  category_id uuid null,
  image_url text null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint products_pkey primary key (id),
  constraint products_company_id_fkey foreign KEY (company_id) references companies (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_products_company_id on public.products using btree (company_id) TABLESPACE pg_default;