window.onload = function() {
    let clienteData = JSON.parse(localStorage.getItem('clienteData'));
    let downloadCount = parseInt(localStorage.getItem('downloadCount')) || 0;

    if (clienteData) {
        document.getElementById('print-fecha').innerHTML = 'FECHA: ' + clienteData.fecha;
        document.getElementById('print-nombre').innerHTML = 'Apellido y Nombre: ' + clienteData.nombre;
        document.getElementById('print-direccion').innerHTML = 'Dirección: ' + clienteData.direccion;
        document.getElementById('print-telefono').innerHTML = 'Tel: ' + clienteData.telefono;

        let tableBody = document.getElementById('print-productos-tbody');
        clienteData.productos.forEach(producto => {
            let row = document.createElement('tr');

            let cell1 = document.createElement('td');
            let cell2 = document.createElement('td');
            let cell3 = document.createElement('td');
            let cell4 = document.createElement('td');

            cell1.innerHTML = producto.descripcion;
            cell2.innerHTML = Number.isInteger(parseFloat(producto.cantidad)) ? parseInt(producto.cantidad) : parseFloat(producto.cantidad).toFixed(2);
            cell3.innerHTML = Number.isInteger(parseFloat(producto.precio_unitario)) ? parseInt(producto.precio_unitario) : parseFloat(producto.precio_unitario).toFixed(2);
            cell4.innerHTML = Number.isInteger(parseFloat(producto.total)) ? parseInt(producto.total) : parseFloat(producto.total).toFixed(2);

            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.appendChild(cell4);

            tableBody.appendChild(row);
        });

        document.getElementById('print-total').innerHTML = Number.isInteger(parseFloat(clienteData.total)) ? parseInt(clienteData.total) : parseFloat(clienteData.total).toFixed(2);

        if (clienteData.observaciones) {
            document.getElementById('observaciones').value = clienteData.observaciones;
        }
    }

    document.getElementById('observaciones').addEventListener('input', function() {
        clienteData.observaciones = this.value;
        localStorage.setItem('clienteData', JSON.stringify(clienteData));
    });

    document.getElementById('descargarPDF').addEventListener('click', function() {
        // Ocultar los botones antes de capturar la pantalla
        document.querySelector('.btn-group').style.display = 'none';

        // Esperar a que la imagen se cargue completamente
        let logo = document.getElementById('logo-ebenezer');
        if (logo.complete) {
            generarPDF();
        } else {
            logo.onload = generarPDF;
        }
    });

    function generarPDF() {
        html2canvas(document.body, {
            scrollX: 0,
            scrollY: 0,
            width: document.documentElement.offsetWidth,
            height: document.documentElement.scrollHeight,
            scale: 2  // Aumentar la escala para mejorar la calidad
        }).then(function(canvas) {
            let imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;

            // Crear el PDF con el tamaño del canvas original
            let pdf = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            // Agregar la imagen al PDF
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

            // Mostrar los botones nuevamente después de generar el PDF
            document.querySelector('.btn-group').style.display = 'block';

            // Generar nombre de archivo único
            let fileName = `${clienteData.nombre}-${clienteData.fecha}-${downloadCount + 1}.pdf`;

            // Incrementar contador de descargas
            downloadCount++;
            localStorage.setItem('downloadCount', downloadCount);

            // Descargar el PDF con el nombre generado
            pdf.save(fileName);
        });
    }
};