var map = L.map('map').setView([23.6345, -102.5528], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Cargar y mostrar el segundo archivo GeoJSON
fetch('mexico.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: function (feature) {
        return {
          color: '##b6740d',        // color del borde
          weight: 2,               // grosor del borde
          fillColor: '##eacd9f',    // color de relleno
          fillOpacity: 0.5         // opacidad del relleno
        };
      }
    }).addTo(map);
  });

  
function getColor(categoria) {
    switch (categoria) {
        case 'Leve': return '#2DC937';
        case 'Moderado': return '#E7B416';
        case 'Fuerte': return '#CC3232';
        default: return '#3366cc';
    }
}

fetch("Categoria_sismos.geojson")
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {
            const mag = feature.properties.Magnitud;
            if (mag < 3) {
                feature.properties.categoria = "Leve";
            } else if (mag >= 3 && mag < 5) {
                feature.properties.categoria = "Moderado";
            } else {
                feature.properties.categoria = "Fuerte";
            }
        });

        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: getColor(feature.properties.categoria),
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        }).addTo(map);
    });

L.Control.geocoder().addTo(map);

var legend = L.control({ position: "bottomright" });
legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    var categorias = ["Leve", "Moderado", "Fuerte"];
    var colores = ["#2DC937", "#E7B416", "#CC3232"];
    for (var i = 0; i < categorias.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colores[i] + '"></i> ' +
            categorias[i] + '<br>';
    }
    return div;
};
legend.addTo(map);




