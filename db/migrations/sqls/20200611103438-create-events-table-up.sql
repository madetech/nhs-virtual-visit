CREATE TABLE events (
  id serial PRIMARY KEY,
  time timestamp NOT NULL,
  action varchar(20) NOT NULL,
  visit_id integer NOT NULL REFERENCES scheduled_calls_table(id),
  session_id uuid NOT NULL
);
