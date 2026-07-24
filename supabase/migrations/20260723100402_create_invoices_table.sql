/*
# Create invoices table (single-tenant, no auth)

1. New Tables
- `invoices`
  - `id` (uuid, primary key)
  - `client_name` (text, not null)
  - `client_vat_number` (text)
  - `client_country` (text)
  - `client_address` (text)
  - `client_is_vat_subject` (boolean, default false)
  - `client_vies_valid` (boolean, nullable)
  - `client_manual_confirm` (boolean, default false)
  - `regime` (text: normal, intra_eu, export, co_contractant)
  - `vat_mention` (text, nullable)
  - `items` (jsonb, array of line items)
  - `total_ht` (numeric)
  - `total_vat` (numeric)
  - `total_ttc` (numeric)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `invoices`.
- Allow anon + authenticated CRUD because the app has no sign-in screen
  and the data is intentionally shared/public (single-tenant).

3. Notes
- This is a single-tenant app with no authentication. All policies use
  `TO anon, authenticated` so the anon-key frontend can read and write.
*/

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_vat_number text,
  client_country text,
  client_address text,
  client_is_vat_subject boolean NOT NULL DEFAULT false,
  client_vies_valid boolean,
  client_manual_confirm boolean NOT NULL DEFAULT false,
  regime text NOT NULL DEFAULT 'normal',
  vat_mention text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_ht numeric NOT NULL DEFAULT 0,
  total_vat numeric NOT NULL DEFAULT 0,
  total_ttc numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_invoices" ON invoices;
CREATE POLICY "anon_select_invoices" ON invoices FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_invoices" ON invoices;
CREATE POLICY "anon_insert_invoices" ON invoices FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_invoices" ON invoices;
CREATE POLICY "anon_update_invoices" ON invoices FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_invoices" ON invoices;
CREATE POLICY "anon_delete_invoices" ON invoices FOR DELETE
  TO anon, authenticated USING (true);
