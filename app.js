const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user'); // Importa el modelo de usuario
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken
const bcrypt = require('bcrypt'); // Para encriptar contraseñas

const app = express();

// Configuración de body-parser
app.use(bodyParser.json());

// Configuración de la clave secreta para firmar y verificar tokens
const secretKey = 'Q1v0q2OZn/>h'; // Reemplaza esto con tu clave secreta

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost/tu_basedatos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Conexión a MongoDB establecida');
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
  });

// Acción 1: Iniciar sesión y obtener un token
app.post('/proyecto/login/:DPI', async (req, res) => {
  const { usuario, clave } = req.body;
  
  // Simula la autenticación en la base de datos (reemplaza esto con tu propia lógica de autenticación)
  const user = await User.findOne({ usuario });

  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  // Verificar la contraseña
  const isPasswordValid = await bcrypt.compare(clave, user.clave);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  // Generar un token JWT válido
  const token = jwt.sign({ user: user.usuario }, secretKey, { expiresIn: '1h' });

  res.json({ token });
});

// Middleware para verificar el token en las siguientes rutas
app.use('/proyecto/data', (req, res, next) => {
  const token = req.header('token');

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    // Verificar el token usando la clave secreta
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user; // Agregar el usuario decodificado a la solicitud
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token no válido' });
  }
});

// Resto de las rutas y configuración de la aplicación
// ...

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});