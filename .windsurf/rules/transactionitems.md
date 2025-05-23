---
trigger: always_on
---

create table public.transaction_items (
  id uuid not null default gen_random_uuid (),
  transaction_id uuid not null,
  product_id uuid not null,
  quantity integer not null,
  unit_price numeric(10, 2) not null,
  total_price numeric(10, 2) not null,
  created_at timestamp with time zone null default now(),
  constraint transaction_items_pkey primary key (id),
  constraint transaction_items_product_id_fkey foreign KEY (product_id) references products (id),
  constraint transaction_items_transaction_id_fkey foreign KEY (transaction_id) references transactions (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_transaction_items_transaction_id on public.transaction_items using btree (transaction_id) TABLESPACE pg_default;

create index IF not exists idx_transaction_items_product_id on public.transaction_items using btree (product_id) TABLESPACE pg_default;