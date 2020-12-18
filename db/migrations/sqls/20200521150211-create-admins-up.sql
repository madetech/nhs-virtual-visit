CREATE TABLE admins (
  id serial PRIMARY KEY,
  email varchar(255) NOT NULL UNIQUE
);
