ALTER TABLE determinations
  DROP CONSTRAINT IF EXISTS determinations_work_type_check;

ALTER TABLE determinations
  ADD CONSTRAINT determinations_work_type_check
  CHECK (work_type IS NULL OR work_type IN ('renovation','heatpump','demolition_rebuild','maintenance'));
