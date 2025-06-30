// Inicializar el mapa
const map = L.map('map').setView([23.6345, -102.5528], 5); // México

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Función para crear iconos según aceptación
function getIcon(aceptacion) {
  const color = (aceptacion && aceptacion.trim().toUpperCase() === "SI") ? "008000" : "FF0000"; // verde o rojo
  return L.icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`,
    iconSize: [21, 34],
    iconAnchor: [10, 34],
    popupAnchor: [0, -30]
  });
}

// Manejar carga del archivo
document.getElementById('file-input').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const data = results.data;

      data.forEach(row => {
        const lat = parseFloat(row.latitud);
        const lng = parseFloat(row.longitud);
        const sucursal = row.sucursal || 'Sucursal';
        const aceptacion = row.aceptacion || '';
        const dias = row['dias sin gestion'] || 'N/A';
        const monto = row['monto adeudado'] || 'N/A';
        const saldo = row['saldo total'] || 'N/A';
        const porcentaje = row['porcentaje pagado'] || 'N/A';
        const ejecutivo = row.ejecutivo || 'N/A';

        if (!lat || !lng) return;

        const marker = L.marker([lat, lng], { icon: getIcon(aceptacion) }).addTo(map);
        marker.bindPopup(`
          <strong>${sucursal}</strong><br>
          Aceptación: ${aceptacion}<br>
          Días sin gestión: ${dias}<br>
          Monto adeudado: $${monto}<br>
          Saldo total: $${saldo}<br>
          % Pagado: ${porcentaje}%<br>
          Ejecutivo: ${ejecutivo}
        `);
      });
    }
  });
});
