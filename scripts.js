document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();

    let descripcion = document.getElementById('descripcion').value;
    let cantidad = parseFloat(document.getElementById('cantidad').value);
    let precio_unitario = parseFloat(document.getElementById('precio_unitario').value);
    let total = cantidad * precio_unitario;

    // Formatear los valores antes de agregarlos a la tabla
    let cantidadFormateada = formatearMonto(cantidad);
    let precioUnitarioFormateado = formatearMonto(precio_unitario);
    let totalFormateado = formatearMonto(total);

    let table = document.getElementById('boleta-table').getElementsByTagName('tbody')[0];
    let newRow = table.insertRow();

    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);
    let cell4 = newRow.insertCell(3);

    cell1.innerHTML = descripcion;
    cell2.innerHTML = cantidadFormateada;
    cell3.innerHTML = precioUnitarioFormateado;
    cell4.innerHTML = totalFormateado;

    actualizarTotal();
    
    // Limpiar los campos de entrada después de agregar el producto
    document.getElementById('product-form').reset();

    // Mostrar mensaje de confirmación
    const mensaje = document.getElementById('mensaje');
    if (mensaje) {
        mensaje.style.display = 'block';

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
            mensaje.style.display = 'none';
        }, 3000);
    }
});

function actualizarTotal() {
    let table = document.getElementById('boleta-table').getElementsByTagName('tbody')[0];
    let rows = table.getElementsByTagName('tr');
    let total = 0;

    for (let i = 0; i < rows.length; i++) {
        total += parseFloat(rows[i].getElementsByTagName('td')[3].innerHTML.replace(/\./g, '').replace(',', '.'));
    }

    document.getElementById('total-boleta').innerHTML = formatearMonto(total);
}

document.getElementById('generarPDF').addEventListener('click', function() {
    let clienteData = {
        fecha: document.getElementById('fecha').value,
        nombre: document.getElementById('nombre').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        productos: []
    };

    let table = document.getElementById('boleta-table').getElementsByTagName('tbody')[0];
    let rows = table.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName('td');
        clienteData.productos.push({
            descripcion: cells[0].innerHTML,
            cantidad: cells[1].innerHTML,
            precio_unitario: cells[2].innerHTML,
            total: cells[3].innerHTML
        });
    }

    clienteData.total = document.getElementById('total-boleta').innerHTML;

    localStorage.setItem('clienteData', JSON.stringify(clienteData));
    window.open('print.html', '_blank');
});

function limpiarDatos() {
    document.getElementById('client-form').reset();
    document.getElementById('product-form').reset();
    document.getElementById('boleta-table').getElementsByTagName('tbody')[0].innerHTML = '';
    document.getElementById('total-boleta').innerHTML = '0';
}

// Función para formatear los montos en pesos argentinos sin decimales ni símbolos
function formatearMonto(monto) {
    return monto.toLocaleString('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).replace(/\./g, '.'); // Reemplaza puntos por puntos para separación de miles
}
