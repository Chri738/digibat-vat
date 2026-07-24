/*
# Add outdoor_work_nature column to determinations

1. Modified Tables
- `determinations`
  - Add `outdoor_work_nature` (text, nullable) — one of 'maintenance' | 'heavy_work'.
    Populated when the user specifies the nature of outdoor/garden work.
    NULL means "not applicable" (no outdoor work, or not specified).

2. Security
- No policy changes; existing anon CRUD policies remain valid.

3. Notes
- Non-destructive: ADD COLUMN only, no data loss. Existing rows get NULL.
- 'maintenance' forces 21% in the engine (routine green-space upkeep excluded
  from the 6% reduced rate by the Belgian tax administration).
- 'heavy_work' flows through the normal renovation/preponderance logic.
*/

ALTER TABLE determinations
  ADD COLUMN IF NOT EXISTS outdoor_work_nature text
  CHECK (outdoor_work_nature IS NULL
         OR outdoor_work_nature IN ('maintenance','heavy_work'));
