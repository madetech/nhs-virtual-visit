CREATE TABLE refresh_tokens (
  id serial PRIMARY KEY,
  value varchar(255) NOT NULL UNIQUE
);
