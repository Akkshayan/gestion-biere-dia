const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = express.Router();

router.get('/connexion', (req, res) => {
  res.render('connexion', { erreur: null });
});

router.post('/connexion', async (req, res) => {
  const { login, mot_de_passe } = req.body;
  const result = await pool.query('SELECT * FROM utilisateurs WHERE login = $1', [login]);
  const utilisateur = result.rows[0];

  if (!utilisateur) {
    return res.render('connexion', { erreur: 'Identifiants incorrects.' });
  }

  const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe_hash);
  if (!motDePasseValide) {
    return res.render('connexion', { erreur: 'Identifiants incorrects.' });
  }

  req.session.utilisateur = {
    id: utilisateur.id,
    nom: utilisateur.nom,
    role: utilisateur.role
  };
  res.redirect('/tableau-bord');
});

router.post('/deconnexion', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/connexion');
  });
});

module.exports = router;