---
trigger: always_on
---

create table public.users (
  id uuid not null,
  email text not null,
  role public.user_role not null default 'user'::user_role,
  created_at timestamp with time zone null default CURRENT_TIMESTAMP,
  updated_at timestamp with time zone null default CURRENT_TIMESTAMP,
  nama text null,
  company_id uuid null,
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_company_id_fkey foreign KEY (company_id) references companies (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_users_company_id on public.users using btree (company_id) TABLESPACE pg_default;