DROP TABLE IF EXISTS category_list CASCADE;
DROP TYPE IF EXISTS list_of_categories;
CREATE TYPE list_of_categories AS ENUM (
  'Iron Man',
  'Star Lord',
  'Spiderman',
  'Black Widow',
  'Batman',
  'Thanos'
);

CREATE TABLE category_list (
  id SERIAL PRIMARY KEY NOT NULL,
  name list_of_categories NOT NULL
);