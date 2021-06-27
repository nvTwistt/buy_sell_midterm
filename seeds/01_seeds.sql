INSERT INTO users (name, email, password) VALUES
('Evan J', 'EJ@icloud.com', 'password'),
('Matt T', 'matt@gmail.com', 'password'),
('bad guy', 'bad@ymail.com', 'password'),
('Scarlet Johannsen', 'scarletj@hotmail.com', 'password'),
('Peter Chow', 'pchow@hangover.com', 'password'),
('Simba', 'simba@123.com', 'password'),
('Clown', 'clown@rednose.com', 'password'),
('Ajax', 'ajax@gooddog.com', 'password');

INSERT INTO category_list (name) VALUES 
  ('Iron Man'),
  ('Star Lord'),
  ('Spiderman'),
  ('Black Widow'),
  ('Batman'),
  ('Thanos');

INSERT INTO listings (
  seller_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  price,
  country,
  street,
  city,
  province,
  post_code,
  buyer_id,
  category_id
  ) VALUES 
  (1, 'Iron Man MK5', 'State of the art super suit, early edition','thumb photo','cover photo',50000,'USA','Ironman Lane','Malibu','California','12345',NULL,1),
  (2, 'Iron Man MK50', 'State of the art super suit, battle authentic from Avengers Infinity War','thumb photo','cover photo',1000000000,'USA','Avengers Street','Avengers Campus','New York','12345',NULL,1),
  (1, 'Infinity Gauntlet', 'Glorious weapon of mass destruction when containing all 5 stones, buy at your own risk. ','thumb photo','cover photo',50000,'Asgard','Thor Avenue','City of Asgard','Asgard','625891',NULL,6),
  (4, 'Batmobile', 'Matte black Lamborghimi used to fight crime at a fast pace','thumb photo','cover photo',1000000,'USA','Bat ave','Gotham','California','12345',NULL,5),
  (3, 'Space Jet Boots', 'If you need to fly around, these are your boots of choice, get their fast and speedy.','thumb photo','cover photo',50000,'Zandar','space street','Zandar','Some planet','12345',NULL,2),
  (2, 'High tensile spider silk', 'Reload your web shooters with 10km of the strongest spider silk to ensure you catch the villian.','thumb photo','cover photo',3000,'USA','Some back alley','Manhatten','New York','12345',NULL,3),
  (3, 'Electric Stun grenades', 'Stun your enemy with 5000 volts of electricty with the most reliable stun grenades on the market.','thumb photo','cover photo',50,'Canada','Young Street','Toronto','Ontario','h5j9d1',NULL,4);

  INSERT INTO favorites (created_at, buyer_id, listing_id) 
  VALUES 
  ('2021-06-10 17:00:00',5, 1),
  ('2021-06-11 17:00:00',6, 2),
  ('2021-06-12 17:00:00',5, 4),
  ('2021-06-10 17:00:00',8, 5),
  ('2021-06-14 17:00:00',8, 6),
  ('2021-06-15 17:00:00',6, 7),
  ('2021-06-14 17:00:00',7, 2);

  INSERT INTO messages (to_id, from_id, time_sent, message, listing_id)
  VALUES 
  (6,2, '2021-06-26 15:00:000', 'I am interested in your MK50 suit', 2),
  (6,2, '2021-06-26 15:30:000', 'Hello? Did you get my message?', 2),
  (2,6, '2021-06-26 15:40:000', 'Yes, I am only willing to take 1 billion cash', 2),
  (6,2, '2021-06-26 15:50:000', 'That is a stupid amount, how about 900mil?', 2),
  (2,6, '2021-06-26 17:00:000', 'Nope, my price is firm and I am not in a rush to sell', 2);
