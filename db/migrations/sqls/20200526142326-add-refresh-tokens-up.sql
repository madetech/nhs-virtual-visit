CREATE TABLE tokens (
  id serial PRIMARY KEY,
  token_value varchar(255) NOT NULL UNIQUE
);
