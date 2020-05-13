CREATE TABLE hospitals (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  trust_id integer REFERENCES trusts (id) NOT NULL,
  CONSTRAINT unq_hospital_trust UNIQUE(trust_id, name)
);