const express = require('express');
const pool = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/mouvement/nouveau', requireAuth, requireAdmin, async (req, res) => {
  const references = await pool.query('SELECT * FROM references_bieres ORDER BY nom');
  res.render('mouvement', {
    utilisateur: req.session.utilisateur,
    references: references.rows,
    erreur: null,
    succes: null
  });
});

router.post('/mouvement/nouveau', requireAuth, requireAdmin, async (req, res) => {
  const { reference_id, type, quantite } = req.body;
  const references = await pool.query('SELECT * FROM references_bieres ORDER BY nom');

  if (!reference_id || !type || !quantite || quantite <= 0) {
    return res.render('mouvement', {
      utilisateur: req.session.utilisateur,
      references: references.rows,
      erreur: 'Merci de remplir tous les champs correctement.',
      succes: null
    });
  }

  await pool.query(
    'INSERT INTO mouvements_stock (reference_id, utilisateur_id, type, quantite) VALUES ($1, $2, $3, $4)',
    [reference_id, req.session.utilisateur.id, type, quantite]
  );

  res.render('mouvement', {
    utilisateur: req.session.utilisateur,
    references: references.rows,
    erreur: null,
    succes: 'Mouvement enregistré.'
  });
});

module.exports = router;