CREATE TABLE organization (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL UNIQUE,
  status integer NOT NULL 
);
