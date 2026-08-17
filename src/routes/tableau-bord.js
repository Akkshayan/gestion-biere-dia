const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

const images = {
  'Heineken': 'heineken.jpg',
  '1664': '1664.jpg',
  'La Goudale': 'la-goudale.jpg',
  '8.6 Original': '8-6-original.jpg',
  'Desperados': 'desperados.jpg'
};

function joursAvantProchaineLivraison() {
  const aujourdHui = new Date();
  const jourSemaine = aujourdHui.getDay();
  let joursRestants = (6 - jourSemaine + 7) % 7;
  if (joursRestants === 0) joursRestants = 7;
  return joursRestants;
}

function calculerStatut(quantite, seuilAlerte, joursAvantLivraison) {
  if (quantite <= 0) return 'rouge';
  if (quantite < seuilAlerte && joursAvantLivraison <= 2) return 'rouge';
  if (quantite < seuilAlerte) return 'orange';
  return 'vert';
}

router.get('/tableau-bord', requireAuth, async (req, res) => {
  const references = await pool.query('SELECT * FROM references_bieres ORDER BY nom');
  const joursRestants = joursAvantProchaineLivraison();

  const donnees = [];
  for (const ref of references.rows) {
    const mouvements = await pool.query(
      `SELECT
        COALESCE(SUM(CASE WHEN type = 'entree' THEN quantite ELSE 0 END), 0) AS entrees,
        COALESCE(SUM(CASE WHEN type = 'sortie' THEN quantite ELSE 0 END), 0) AS sorties
       FROM mouvements_stock WHERE reference_id = $1`,
      [ref.id]
    );
    const quantite = mouvements.rows[0].entrees - mouvements.rows[0].sorties;
    donnees.push({
      ...ref,
      quantite,
      statut: calculerStatut(quantite, ref.seuil_alerte, joursRestants),
      image: images[ref.nom] || null
    });
  }

  res.render('tableau-bord', {
    utilisateur: req.session.utilisateur,
    references: donnees,
    joursRestants
  });
});

router.get('/historique', requireAuth, async (req, res) => {
  const resultat = await pool.query(
    `SELECT m.date, m.type, m.quantite,
            r.nom AS nom_reference,
            u.nom AS nom_utilisateur
     FROM mouvements_stock m
     JOIN references_bieres r ON m.reference_id = r.id
     JOIN utilisateurs u ON m.utilisateur_id = u.id
     ORDER BY m.date DESC`
  );

  res.render('historique', {
    utilisateur: req.session.utilisateur,
    mouvements: resultat.rows
  });
});

module.exports = router;
