CREATE TABLE ward_visit_totals (
  id serial PRIMARY KEY,
  ward_id integer REFERENCES wards(id) NOT NULL,
  total_date date NOT NULL,
  total integer NOT NULL,
  CONSTRAINT unq_ward_date UNIQUE(ward_id, total_date)
);
