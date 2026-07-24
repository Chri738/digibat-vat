/*
# Add surface_m2 column to determinations

1. Modified Tables
- `determinations`
  - Add `surface_m2` (integer, nullable) — reconstruction surface in m²,
    only populated when work_type = 'demolition_rebuild'. Null for other work types.
2. Security
- No policy changes; existing anon CRUD policies remain valid.
3. Notes
- Non-destructive: ADD COLUMN only, no data loss. Existing rows get NULL, which is correct
  since prior determinations did not capture surface.
*/

ALTER TABLE determinations
  ADD COLUMN IF NOT EXISTS surface_m2 integer;
