const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const tableauBordRoutes = require('./routes/tableau-bord');
const mouvementRoutes = require('./routes/mouvement');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vues'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.get('/', (req, res) => res.redirect('/tableau-bord'));
app.use(authRoutes);
app.use(tableauBordRoutes);
app.use(mouvementRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur demarre sur le port ${PORT}`);
});