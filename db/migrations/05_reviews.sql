DROP TABLE IF EXISTS listing_reviews CASCADE;
CREATE TABLE listing_reviews (
  id SERIAL PRIMARY KEY NOT NULL,
  rating INTEGER, 
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id INTEGER REFERENCES listings(id) ON DELETE CASCADE
);