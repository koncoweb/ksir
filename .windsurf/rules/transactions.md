---
trigger: always_on
---

create table public.transactions (
  id uuid not null default gen_random_uuid (),
  company_id uuid not null,
  user_id uuid not null,
  transaction_number character varying(50) not null,
  total_amount numeric(10, 2) not null,
  tax_amount numeric(10, 2) null default 0,
  discount_amount numeric(10, 2) null default 0,
  payment_method character varying(50) not null,
  payment_status character varying(20) null default 'completed'::character varying,
  notes text null,
  created_at timestamp with time zone null default now(),
  constraint transactions_pkey primary key (id),
  constraint transactions_transaction_number_key unique (transaction_number),
  constraint transactions_company_id_fkey foreign KEY (company_id) references companies (id) on delete CASCADE,
  constraint transactions_user_id_fkey foreign KEY (user_id) references users (id)
) TABLESPACE pg_default;

create index IF not exists idx_transactions_company_id on public.transactions using btree (company_id) TABLESPACE pg_default;