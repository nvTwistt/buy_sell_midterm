DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS listings CASCADE;
CREATE TABLE listings (
  id SERIAL PRIMARY KEY NOT NULL,
  seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  thumbnail_photo_url VARCHAR(255),
  cover_photo_url VARCHAR(255),
  price INTEGER,
  country VARCHAR(255),
  street VARCHAR(255),
  city VARCHAR(255),
  province VARCHAR(255),
  post_code VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  category_id INTEGER REFERENCES category_list(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS favorites CASCADE;
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY NOT NULL,
  created_at TIMESTAMP,
  buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  to_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  from_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  time_sent TIMESTAMP,
  message TEXT,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS listing_reviews CASCADE;
CREATE TABLE listing_reviews (
  id SERIAL PRIMARY KEY NOT NULL,
  rating INTEGER,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id INTEGER REFERENCES listings(id) ON DELETE CASCADE
);

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

