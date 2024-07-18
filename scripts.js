document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();

    let descripcion = document.getElementById('descripcion').value;
    let cantidad = parseFloat(document.getElementById('cantidad').value);
    let precio_unitario = parseFloat(document.getElementById('precio_unitario').value);
    let total = cantidad * precio_unitario;

    let table = document.getElementById('boleta-table').getElementsByTagName('tbody')[0];
    let newRow = table.insertRow();

    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);
    let cell4 = newRow.insertCell(3);

    cell1.innerHTML = descripcion;
    cell2.innerHTML = Number.isInteger(cantidad) ? cantidad : cantidad.toFixed(2);
    cell3.innerHTML = Number.isInteger(precio_unitario) ? precio_unitario : precio_unitario.toFixed(2);
    cell4.innerHTML = Number.isInteger(total) ? total : total.toFixed(2);

    actualizarTotal();
    
    // Limpiar los campos de entrada después de agregar el producto
    document.getElementById('product-form').reset();
});

function actualizarTotal() {
    let table = document.getElementById('boleta-table').getElementsByTagName('tbody')[0];
    let rows = table.getElementsByTagName('tr');
    let total = 0;

    for (let i = 0; i < rows.length; i++) {
        total += parseFloat(rows[i].getElementsByTagName('td')[3].innerHTML);
    }

    document.getElementById('total-boleta').innerHTML = Number.isInteger(total) ? total : total.toFixed(2);
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