CREATE TABLE events (
  id serial PRIMARY KEY,
  time timestamp NOT NULL,
  action varchar(20) NOT NULL,
  visit_id integer NOT NULL,
  session_id uuid NOT NULL
);
