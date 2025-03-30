const express = require('express');
const router = express.Router();
const db = require('../Conexion/conexion.js'); // Importamos la conexión a la DB

// 📌 Ruta para agregar un usuario (POST)
router.post('/', async (req, res) => {
    try {
        const { nombre, cuil, tipo_usuario, estado } = req.body;

        // Validación básica
        if (!nombre || !cuil || !tipo_usuario || estado === undefined) {
            return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
        }

        // Inserción con async/await
        const [result] = await db.execute(
            `INSERT INTO USUARIOS (nombre, cuil, tipo_usuario, estado) VALUES (?, ?, ?, ?)`,
            [nombre, cuil, tipo_usuario, estado]
        );

        res.status(201).json({ msg: 'Usuario agregado con éxito', id: result.insertId });
    } catch (err) {
        res.status(500).json({ msg: 'Error al agregar usuario', error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const [results] = await db.execute(
            'SELECT ID_USUARIO, NOMBRE, CUIL, TIPO_USUARIO, (ESTADO+0) AS ESTADO FROM USUARIOS'
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ msg: 'Error en la consulta', error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = parseInt(req.params); // Obtenemos el ID de la URL
        const { nombre, cuil, tipo_usuario, estado } = req.body; // Datos a modificar

        // Validación básica
        if (!nombre || !cuil || !tipo_usuario || estado === undefined) {
            return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
        }

        // Consulta SQL para actualizar
        const [result] = await db.execute(
            `UPDATE USUARIOS SET nombre = ?, cuil = ?, tipo_usuario = ?, estado = ? WHERE ID_USUARIO = ?`,
            [nombre, cuil, tipo_usuario, estado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.json({ msg: 'Usuario actualizado con éxito' });
    } catch (err) {
        res.status(500).json({ msg: 'Error al modificar usuario', error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🛠️ Eliminando usuario con ID: ${id}`);

        // Llamar al Stored Procedure
        const [result] = await db.execute('CALL eliminar_usuario(?)', [id]);

        console.log(`✔️ Resultado: `, result);
        res.json({ msg: '✅ Usuario eliminado correctamente' });

    } catch (error) {
        console.error('❌ Error en la eliminación:', error);
        res.status(500).json({ msg: 'Error en el servidor', error: error.message });
    }
});

module.exports = router;