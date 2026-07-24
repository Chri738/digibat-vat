/*
# Create determinations history table (single-tenant, no auth)

1. New Tables
- `determinations`
  - `id` (uuid, primary key)
  - `client_vat_number` (text, not null) — the VAT number entered by the user
  - `client_country` (text, not null) — 2-letter ISO country code (BE, FR, NL, ...)
  - `verdict` (text, not null) — one of: 'autoliquidation' | 'reduced6' | 'standard21'
  - `rate` (integer, not null) — applied VAT rate (0, 6, or 21)
  - `building_age` (text, nullable) — 'under10' | 'over10' | null
  - `building_use` (text, nullable) — 'private' | 'professional' | null
  - `work_type` (text, nullable) — 'renovation' | 'heatpump' | 'demolition_rebuild' | null
  - `result_json` (jsonb, not null) — full DeterminationResult object (titles, legal texts, refs)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `determinations`.
- Single-tenant, no sign-in: allow anon + authenticated CRUD because the data is intentionally
  shared/public within this tool (no user accounts). `USING (true)` is acceptable here.
- Four separate policies (SELECT/INSERT/UPDATE/DELETE), no `FOR ALL`.

3. Indexes
- `determinations_created_at_idx` on `created_at DESC` for history listing.
- `determinations_verdict_idx` on `verdict` for potential filtering.
*/

CREATE TABLE IF NOT EXISTS determinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_vat_number text NOT NULL,
  client_country text NOT NULL,
  verdict text NOT NULL CHECK (verdict IN ('autoliquidation','reduced6','standard21')),
  rate integer NOT NULL,
  building_age text CHECK (building_age IS NULL OR building_age IN ('under10','over10')),
  building_use text CHECK (building_use IS NULL OR building_use IN ('private','professional')),
  work_type text CHECK (work_type IS NULL OR work_type IN ('renovation','heatpump','demolition_rebuild')),
  result_json jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE determinations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_determinations" ON determinations;
CREATE POLICY "anon_select_determinations"
  ON determinations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_determinations" ON determinations;
CREATE POLICY "anon_insert_determinations"
  ON determinations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_determinations" ON determinations;
CREATE POLICY "anon_update_determinations"
  ON determinations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_determinations" ON determinations;
CREATE POLICY "anon_delete_determinations"
  ON determinations FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS determinations_created_at_idx ON determinations (created_at DESC);
CREATE INDEX IF NOT EXISTS determinations_verdict_idx ON determinations (verdict);
