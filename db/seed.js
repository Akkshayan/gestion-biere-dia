const bcrypt = require('bcryptjs');
const pool = require('../src/db');

async function peupler() {
  const motDePasse = await bcrypt.hash('0000', 10);

  const references = [
    { nom: 'Heineken', conditionnement: 'Canette 50cl', seuil_alerte: 24 },
    { nom: '1664', conditionnement: 'Canette 50cl', seuil_alerte: 24 },
    { nom: 'La Goudale', conditionnement: 'Canette 50cl', seuil_alerte: 12 },
    { nom: '8.6 Original', conditionnement: 'Canette 50cl', seuil_alerte: 12 },
    { nom: 'Desperados', conditionnement: 'Canette 50cl', seuil_alerte: 12 }
  ];

  for (const ref of references) {
    await pool.query(
      'INSERT INTO references_bieres (nom, conditionnement, seuil_alerte) VALUES ($1, $2, $3)',
      [ref.nom, ref.conditionnement, ref.seuil_alerte]
    );
  }

  const utilisateurs = [
    { nom: 'Gerant', login: 'gerant', role: 'admin' },
    { nom: 'Akkshayan', login: 'akkshayan', role: 'admin' },
    { nom: 'Patrick', login: 'patrick', role: 'lecture' },
    { nom: 'Anna', login: 'anna', role: 'lecture' },
    { nom: 'Emma', login: 'emma', role: 'lecture' },
    { nom: 'Lina', login: 'lina', role: 'lecture' }
  ];

  for (const u of utilisateurs) {
    await pool.query(
      'INSERT INTO utilisateurs (nom, login, mot_de_passe_hash, role) VALUES ($1, $2, $3, $4)',
      [u.nom, u.login, motDePasse, u.role]
    );
  }

  console.log('Base peuplee avec succes.');
  console.log('Identifiants de test (mot de passe pour tous : 0000) :');
  utilisateurs.forEach(u => console.log(`  - ${u.login} (${u.role})`));

  await pool.end();
}

peupler().catch((err) => {
  console.error('Erreur lors du peuplement :', err);
  process.exit(1);
});