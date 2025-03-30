document.getElementById('usuarioForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const cuil = parseInt(document.getElementById('cuil').value);
    const tipo_usuario = parseInt(document.getElementById('tipo_usuario').value);
    const estado = parseInt(document.getElementById('estado').value);

    // Validación en el frontend
    if (!nombre || isNaN(cuil) || isNaN(tipo_usuario) || isNaN(estado)) {
        alert("⚠️ Todos los campos son obligatorios y deben ser válidos.");
        return;
    }

    const usuario = { nombre, cuil, tipo_usuario, estado };

    try {
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        alert(data.msg);
        location.reload(); // Recargar la página para actualizar la tabla automáticamente
    } catch (error) {
        console.error('❌ Error al hacer la solicitud:', error);
        alert('Hubo un problema con la solicitud.');
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const tabla = document.getElementById('tablaUsuarios');

    try {
        const response = await fetch('http://localhost:3000/usuarios');
        if (!response.ok) throw new Error(`Error en la petición: ${response.status}`);

        const usuarios = await response.json();
        console.log(usuarios);
        // Limpiar la tabla antes de agregar nuevos elementos
        tabla.innerHTML = '';

        usuarios.forEach(usuario => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${usuario.ID_USUARIO}</td>
                <td>${usuario.NOMBRE}</td>
                <td>${usuario.CUIL}</td>
                <td>${usuario.TIPO_USUARIO}</td>
               <td>${usuario.ESTADO ? 'Activo':'Inactivo'}</td>
                <td>
                    <button class="btn-eliminar" data-id="${usuario.ID_USUARIO}">🗑 Eliminar</button>
                </td>
                <td>
                    <button class="btn-modificar" data-id="${usuario.ID_USUARIO}">✏️ Modificar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });

        // Agregar eventos a los botones después de generar la tabla
        agregarEventosBotones();
    } catch (error) {
        console.log('Error al agregar eventobotones');
        console.error('❌ Error al obtener usuarios:', error);
    }
});

// ✅ Función para agregar eventos a los botones de Eliminar y Modificar
function agregarEventosBotones() {
    // 🔴 Evento para eliminar usuario
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', async () => {
            const id = boton.getAttribute('data-id');
            console.log(`🆔 ID obtenido: ${id}`);
            if (!confirm(`¿Seguro que deseas eliminar al usuario con ID ${id}?`)) return;

            try {
                const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(`Error al eliminar: ${response.status}`);
                }

                alert('✅ Usuario eliminado con éxito');
                location.reload(); // Recargar la tabla
            } catch (error) {
                console.error('❌ Error al eliminar usuario:', error);
                alert('Hubo un problema al eliminar el usuario.');
            }
        });
    });

    // 🟡 Evento para modificar usuario
    document.querySelectorAll('.btn-modificar').forEach(boton => {
        boton.addEventListener('click', async () => {
            const id = boton.getAttribute('data-id');

            // Capturar los nuevos valores mediante prompt (puedes mejorar con un formulario modal)
            const nuevoNombre = prompt('Ingrese el nuevo nombre:');
            const nuevoCuil = prompt('Ingrese el nuevo CUIL:');
            const nuevoTipoUsuario = prompt('Ingrese el nuevo Tipo de Usuario:');
            const nuevoEstado = confirm('¿El usuario está activo?') ? 1 : 0;

            if (!nuevoNombre || isNaN(nuevoCuil) || isNaN(nuevoTipoUsuario)) {
                alert('⚠️ Todos los campos son obligatorios y deben ser válidos.');
                return;
            }

            const usuarioActualizado = {
                nombre: nuevoNombre,
                cuil: parseInt(nuevoCuil),
                tipo_usuario: parseInt(nuevoTipoUsuario),
                estado: nuevoEstado
            };

            try {
                const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuarioActualizado)
                });

                if (!response.ok) {
                    throw new Error(`Error al modificar: ${response.status}`);
                }

                alert('✅ Usuario modificado con éxito');
                location.reload();
            } catch (error) {
                console.error('❌ Error al modificar usuario:', error);
                alert('Hubo un problema al modificar el usuario.');
            }
        });
    });
};

function ocultar() {
    let agregarUsuarioDiv = document.getElementById("agregarUusario");
    let listadoUsuariosDiv = document.getElementById("listadoUsuarios");

    
    if (agregarUsuarioDiv.style.display === "none" || agregarUsuarioDiv.style.display === "") {
        agregarUsuarioDiv.style.display = "block";
        listadoUsuariosDiv.style.display = "none";
    } else {
        agregarUsuarioDiv.style.display = "none";
        listadoUsuariosDiv.style.display = "block";
    }
}