CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    click_count INT DEFAULT 0,
    first_click_ts TIMESTAMP NULL
);

INSERT INTO cards (click_count, first_click_ts)
VALUES 
  (0,NULL),(0,NULL),(0,NULL),(0,NULL),
  (0,NULL),(0,NULL),(0,NULL),(0,NULL);
