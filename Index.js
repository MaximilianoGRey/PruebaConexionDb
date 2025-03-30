const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./routes/routesUsuarios.js');

const app = express();
app.use(cors()); // Permite solicitudes desde el frontend
app.use(express.json()); // Permite recibir JSON en las peticiones
app.use('/usuarios', usuarioRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));