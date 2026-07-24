/*
# Add mixed-use surface and work zone columns to determinations

1. Modified Tables
- `determinations`
  - Add `surface_private_m2` (integer, nullable) — private surface in m², populated for mixed-use renovations.
  - Add `surface_professional_m2` (integer, nullable) — professional surface in m², populated for mixed-use renovations.
  - Add `work_zone` (text, nullable) — one of 'interior_private' | 'interior_professional' | 'common'. Populated for mixed-use renovations.

2. Security
- No policy changes; existing anon CRUD policies remain valid.

3. Notes
- Non-destructive: ADD COLUMN only, no data loss. Existing rows get NULL, which is correct
  since prior determinations did not capture mixed-use surfaces or work zones.
- The existing `surface_m2` column remains in use for demolition-rebuild.
*/

ALTER TABLE determinations
  ADD COLUMN IF NOT EXISTS surface_private_m2 integer;

ALTER TABLE determinations
  ADD COLUMN IF NOT EXISTS surface_professional_m2 integer;

ALTER TABLE determinations
  ADD COLUMN IF NOT EXISTS work_zone text
  CHECK (work_zone IS NULL OR work_zone IN ('interior_private','interior_professional','common'));
