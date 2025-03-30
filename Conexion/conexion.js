const mysql = require('mysql2/promise');

const conexion = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "123456789", // Cambia esto por tu contraseña de MySQL
    database: "PROVEEDORES",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar conexión inmediatamente
conexion.getConnection()
    .then(conn => {
        console.log("✅ Conexión a MySQL exitosa");
        conn.release();
    })
    .catch(err => {
        console.error("❌ Error de conexión a MySQL:", err.message);
    });

module.exports = conexion;
