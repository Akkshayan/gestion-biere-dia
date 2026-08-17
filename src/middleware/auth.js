function requireAuth(req, res, next) {
  if (!req.session.utilisateur) {
    return res.redirect('/connexion');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.utilisateur || req.session.utilisateur.role !== 'admin') {
    return res.status(403).render('erreur', {
      utilisateur: req.session.utilisateur,
      message: "Vous n'avez pas les droits pour effectuer cette action."
    });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };