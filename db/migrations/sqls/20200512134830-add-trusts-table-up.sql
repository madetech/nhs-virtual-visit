CREATE TABLE trusts (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  admin_code varchar(255) NOT NULL UNIQUE
);
