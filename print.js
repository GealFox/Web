window.onload = function() {
    let clienteData = JSON.parse(localStorage.getItem('clienteData'));
    let downloadCount = parseInt(localStorage.getItem('downloadCount')) || 0;

    // Función para formatear números
    function formatNumber(number, isInteger = false) {
        // Verificar si el número es válido
        if (isNaN(number)) {
            console.error('Invalid number:', number);
            return '0.00';
        }

        // Formato de número con punto como separador de miles y coma como separador decimal
        const options = isInteger
            ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
            : { minimumFractionDigits: 3, maximumFractionDigits: 3 };

        // Usar Intl.NumberFormat con el locale 'es-ES' para formato en español
        return new Intl.NumberFormat('es-ES', options).format(number).replace(/,/g, '.');
    }

    // Verificar si hay datos de cliente
    if (clienteData) {
        document.getElementById('print-fecha').innerHTML = 'FECHA: ' + clienteData.fecha;
        document.getElementById('print-nombre').innerHTML = 'Apellido y Nombre: ' + clienteData.nombre;
        document.getElementById('print-direccion').innerHTML = 'Dirección: ' + clienteData.direccion;
        document.getElementById('print-telefono').innerHTML = 'Tel: ' + clienteData.telefono;

        let tableBody = document.getElementById('print-productos-tbody');
        tableBody.innerHTML = ''; // Limpiar el tbody antes de agregar filas
        clienteData.productos.forEach(producto => {
            let row = document.createElement('tr');

            let cell1 = document.createElement('td');
            let cell2 = document.createElement('td');
            let cell3 = document.createElement('td');
            let cell4 = document.createElement('td');

            cell1.innerHTML = producto.descripcion;
            cell2.innerHTML = formatNumber(parseFloat(producto.cantidad), true); // Entero
            cell3.innerHTML = formatNumber(parseFloat(producto.precio_unitario)); // Decimal
            cell4.innerHTML = formatNumber(parseFloat(producto.total)); // Decimal

            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.appendChild(cell4);

            tableBody.appendChild(row);
        });

        document.getElementById('print-total').innerHTML = formatNumber(parseFloat(clienteData.total)); // Decimal

        if (clienteData.observaciones) {
            document.getElementById('observaciones').value = clienteData.observaciones;
        }
    } else {
        console.error('No client data found.');
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
