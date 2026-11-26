CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(8,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmee',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(8,2) NOT NULL
);

INSERT INTO users (email, password, name) VALUES
  ('alice@boutique.test', 'alice123', 'Alice Martin'),
  ('bob@boutique.test', 'bob123', 'Bob Durand');

INSERT INTO products (name, description, price, stock, category) VALUES
  ('Clavier mécanique', 'Clavier 105 touches, switches rouges, rétroéclairé.', 79.90, 12, 'Périphériques'),
  ('Souris sans fil', 'Souris ergonomique, 3 niveaux de DPI.', 24.10, 30, 'Périphériques'),
  ('Écran 24 pouces', 'Dalle IPS Full HD, 75 Hz.', 139.90, 5, 'Écrans'),
  ('Écran 27 pouces', 'Dalle IPS QHD, 144 Hz.', 249.00, 3, 'Écrans'),
  ('Casque audio', 'Casque fermé avec micro détachable.', 59.90, 15, 'Audio'),
  ('Enceinte Bluetooth', 'Autonomie 12 h, étanche IPX5.', 34.10, 20, 'Audio'),
  ('Webcam HD', 'Webcam 1080p avec microphone intégré.', 44.10, 8, 'Périphériques'),
  ('Câble USB-C', NULL, 9.90, 100, 'Accessoires'),
  ('Hub USB 4 ports', 'Hub alimenté, 4 ports USB 3.0.', 19.90, 25, 'Accessoires'),
  ('Tapis de souris XL', 'Tapis 90x40 cm, base antidérapante.', 14.10, 40, 'Accessoires'),
  ('Support ordinateur', 'Support aluminium réglable en hauteur.', 29.90, 18, 'Accessoires'),
  ('Disque SSD 1 To', 'SSD NVMe, lecture 3500 Mo/s.', 89.90, 10, 'Stockage'),
  ('Clé USB 64 Go', 'Clé USB 3.2.', 12.10, 60, 'Stockage'),
  ('Disque dur externe 2 To', 'Disque portable USB 3.0.', 74.90, 7, 'Stockage'),
  ('Microphone USB', 'Microphone cardioïde pour streaming.', 64.10, 9, 'Audio'),
  ('Lampe de bureau LED', 'Lampe à intensité réglable.', 27.90, 22, 'Accessoires');
