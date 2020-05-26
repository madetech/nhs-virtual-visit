CREATE TABLE admins (
  id serial PRIMARY KEY,
  code varchar(255) NOT NULL UNIQUE
);
