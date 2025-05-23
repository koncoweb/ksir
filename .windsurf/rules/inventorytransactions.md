---
trigger: always_on
---

create table public.inventory_transactions (
  id uuid not null default extensions.uuid_generate_v4 (),
  company_id uuid not null,
  product_id uuid not null,
  variation_id uuid null,
  location_name character varying not null,
  location_type character varying not null,
  quantity integer not null,
  previous_quantity integer not null,
  transaction_type character varying not null,
  reference_id uuid null,
  notes text null,
  created_by uuid null,
  created_at timestamp with time zone null default now(),
  constraint inventory_transactions_pkey primary key (id),
  constraint inventory_transactions_company_id_fkey foreign KEY (company_id) references companies (id),
  constraint inventory_transactions_created_by_fkey foreign KEY (created_by) references users (id),
  constraint inventory_transactions_product_id_fkey foreign KEY (product_id) references products (id),
  constraint inventory_transactions_variation_id_fkey foreign KEY (variation_id) references product_variations (id)
) TABLESPACE pg_default;

create index IF not exists idx_inventory_transactions_product_id on public.inventory_transactions using btree (product_id) TABLESPACE pg_default;

create index IF not exists idx_inventory_transactions_variation_id on public.inventory_transactions using btree (variation_id) TABLESPACE pg_default;

create index IF not exists idx_inventory_transactions_company_id on public.inventory_transactions using btree (company_id) TABLESPACE pg_default;