CREATE TABLE utilisateurs (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  login VARCHAR(50) UNIQUE NOT NULL,
  mot_de_passe_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'lecture'))
);

CREATE TABLE references_bieres (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  conditionnement VARCHAR(50) NOT NULL,
  seuil_alerte INTEGER NOT NULL DEFAULT 20
);

CREATE TABLE mouvements_stock (
  id SERIAL PRIMARY KEY,
  reference_id INTEGER NOT NULL REFERENCES references_bieres(id),
  utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id),
  type VARCHAR(10) NOT NULL CHECK (type IN ('entree', 'sortie')),
  quantite INTEGER NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT NOW()
);
