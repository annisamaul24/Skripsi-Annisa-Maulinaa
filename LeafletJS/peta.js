// Inisialisasi peta di teluk pandan
var map = L.map('map').setView([-5.531802, 105.237589], 11);

// Tambahkan base layer
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 5,
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});

var esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom : 19,
    attribution: 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
    });

// Menambahkan layer default
esriSat.addTo(map);

// Layer batas administrasi
var batasdesa = L.geoJSON(null, {
    style: function(feature) {
        return {
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0
        };
    }
});

// Memanggil file GeoJSON batas administrasi desa
fetch('Geojson/batasdesa.geojson')
    .then(response => response.json())
    .then(data => {
        console.log("Data GeoJSON Batas administrasi:", data);
        batasdesa.addData(data);
    })
    .catch(error => console.error("Error memuat GeoJSON batas desa: ", error));

// Layer jaringan jalan
var Jaringanjalan = L.geoJSON(null, {
    style: function(feature) {
        return {
            color: "red",
            weight: 1,
            opacity: 1
        };
    }
});

// Memanggil file GeoJSON jaringan jalan
fetch('Geojson/Jaringanjalan.geojson')
    .then(response => response.json())
    .then(data => {
        console.log("Data GeoJSON Jaringan Jalan:", data);
        Jaringanjalan.addData(data);
    })
    .catch(error => console.error("Error memuat GeoJSON jaringan jalan: ", error));

// Layer koordinat pariwisata
var DATAUMKM = L.geoJSON(null, {
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng).bindPopup(
          "<table style='width:100%; font-size: 14px;'>" +
            "<tr><th colspan='2' style='text-align:center; font-size: 16px;'>" + feature.properties.Nama + "</th></tr>" +
            "<tr><td><b>Jenis Usaha</b></td><td>" + feature.properties["Jenis Usaha"] + "</td></tr>" +
            "<tr><td><b>Kontak</b></td><td>" + feature.properties.Kontak + "</td></tr>" +
            "<tr><td colspan='2' style='text-align: justify; padding-top: 10px;'>" + feature.properties.Deskripsi.replace(/\n/g, "<br>&emsp;") + "</td></tr>" +
            (feature.properties.Foto ?
                "<tr><td colspan='2' style='text-align: center; padding-top: 10px;'><img src='" + feature.properties.Foto + "' style='max-width: 100%; width: 150px; border-radius: 8px; center;'></td></tr>"
                : ""
            ) +
        "</table>"
    );
    }
});


// Memanggil file GeoJSON koordinat UMKM
fetch('Geojson/DATAUMKM.geojson')
    .then(response => response.json())
    .then(data => {
        console.log("Data GeoJSON koordinat UMKM:", data);
        DATAUMKM.addData(data);
        map.addLayer(DATAUMKM); // Tambahkan layer ke peta agar terlihat
    })
    .catch(error => console.error("Error memuat GeoJSON koordinat UMKM: ", error));

// Base maps
var baseMaps = {
    "OpenStreetMap": osm,
    "OpenStreetMap HOT": osmHOT,
    "Citra Satelit" : esriSat
};

// Overlay layers
var overlayMaps = {
    "Batas Desa": batasdesa,
    "Jaringan Jalan": Jaringanjalan,
    "Koordinat UMKM": DATAUMKM
};

// Tambahkan kontrol layer ke peta
L.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(map);

//LOKASI REAL-TIME
// Inisialisasi marker user
var userMarker = null;

// Tambahkan tombol sebagai kontrol Leaflet di bawah tombol zoom
var LokasiSayaButton = L.Control.extend({
    options: {
        position: 'topleft' // posisi kiri atas (sama seperti zoom)
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.innerHTML = '<span style="font-size: 18px;">📍</span>';
        container.style.backgroundColor = 'white';
        container.style.width = '34px';
        container.style.height = '34px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.cursor = 'pointer';
        container.title = "Lokasi Saya";

        container.onclick = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;

                    if (userMarker) {
                        // Jika marker sudah ada, hapus marker
                        map.removeLayer(userMarker);
                        userMarker = null; // Setel userMarker ke null agar tidak ada lagi marker
                    } else {
                        // Gunakan bulatan biru sebagai marker
                        userMarker = L.circleMarker([lat, lng], {
                            radius: 10, // ukuran bulatan
                            fillColor: "#3388ff", // warna isi bulatan biru
                            color: "#ffffff", // warna tepi
                            weight: 2, // ketebalan tepi
                            opacity: 1, // opasitas
                            fillOpacity: 0.8 // opasitas isi
                        }).addTo(map).bindPopup("Lokasi Anda").openPopup();
                    }

                    // Pindahkan tampilan peta ke lokasi pengguna
                    map.setView([lat, lng], 14);
                }, function (error) {
                    alert("Gagal mendapatkan lokasi.");
                    console.error(error);
                });
            } else {
                alert("Browser tidak mendukung Geolocation.");
            }
        };

        return container;
    }
});

// Tambahkan tombol ke peta
map.addControl(new LokasiSayaButton());

