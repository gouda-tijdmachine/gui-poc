function loadJSON(path, success, error) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success) success(JSON.parse(xhr.responseText));
			} else {
				if (error) error(xhr);
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.send();
}


const MAP_PROXY = 'https://www.goudatijdmachine.nl/data/map-proxy/?url=';
//const MAP_PROXY='';

const maps = [];

// Gemeente Gouda (https://gis.gouda.nl/) - CC-BY-SA

maps['gisgouda_deventer_1572'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/CHRASTER/wms?', { layers: 'Jacob_van_Deventer', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_hogenberg_1585'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/CHRASTER/wms?', { layers: 'braun_hogenberg', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_kadastraal_1613'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/CHRASTER/wms?', { layers: 'Kadastrale_kaart_1613', version: "1.1.1", nocache: true, maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_blaeu_1649'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/CHRASTER/wms?', { layers: 'StadsplattegrondBlaeu1649', version: "1.1.1", format: "image/png", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_kadastraal_1832'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/CHRASTER/wms?', { layers: 'Kadastrale_kaart_1832', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_luchtfoto_1977'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/RASTER/wms?', { layers: 'Lufo_1977_Binnenstad', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_luchtfoto_1987'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/RASTER/wms?', { layers: 'Lufo_1987_Binnenstad', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_luchtfoto_2005'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2005', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_luchtfoto_2010'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2010', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_luchtfoto_2012'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2012', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_luchtfoto_2014'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2014', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_luchtfoto_2015'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2015', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_luchtfoto_2016'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2016', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_luchtfoto_2017'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2017', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_luchtfoto_2018'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2018', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_luchtfoto_2019'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2019', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_luchtfoto_2020'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2020', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });
maps['gisgouda_luchtfoto_2021'] = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2021', version: "1.1.1", maxZoom: 20, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>", zIndex: 5 });

// PDOK / Kadaster (https://app.pdok.nl/viewer/) - CC-BY

maps['pdok_luchtfoto_2021'] = L.tileLayer.wms(' https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0?', { layers: '2021_orthoHR', maxZoom: 20, attribution: "<a href='https://www.pdok.nl/'>PDOK</a>", zIndex: 5 });
maps['pdok_percelen_BRK'] = L.tileLayer.wms('https://service.pdok.nl/kadaster/cp/wms/v1_0?', { layers: 'CP.CadastralParcel', transparent: true, version: "1.3.0", format: "image/png", attribution: "<a href='https://www.pdok.nl/'>PDOK</a>", zIndex: 5 });
maps['pdok_gebouwen_BAG'] = L.tileLayer.wms('https://geodata.nationaalgeoregister.nl/inspire/bu/wms', { layers: 'BU.Building', transparent: true, version: "1.3.0", format: "image/png", attribution: "<a href='https://www.pdok.nl/'>PDOK</a>", zIndex: 5 });

// Universiteit Groningen (https://geo.rug.nl/portal/home/ / https://geo.rug.nl/image/rest/services/HistorischeKaarten)

maps['georug_tmk_kl_1850'] = L.tileLayer.wms(MAP_PROXY + 'https://geo.rug.nl/image/services/HistorischeKaarten/TMK_Kleur/ImageServer/WMSServer?', { layers: '0', transparent: true, attribution: "<a href='https://geo.rug.nl/portal/home/'>Universiteit Groningen</a>", zIndex: 5 });
maps['georug_tmk_gr_1850'] = L.tileLayer.wms(MAP_PROXY + 'https://geo.rug.nl/image/services/HistorischeKaarten/TMKZwartWit/ImageServer/WMSServer?', { layers: '0', transparent: true, attribution: "<a href='https://geo.rug.nl/portal/home/'>Universiteit Groningen</a>", zIndex: 5 });
maps['georug_bonnebladen_1865'] = L.tileLayer.wms(MAP_PROXY + 'https://geo.rug.nl/image/services/HistorischeKaarten/Bonnebladen/ImageServer/WMSServer?', { layers: '0', transparent: true, attribution: "<a href='https://geo.rug.nl/portal/home/'>Universiteit Groningen</a>", zIndex: 5 });

// Tileserver GTM / MapWarper

maps['mapwarper_minuutplannen_1832'] = L.tileLayer(MAP_PROXY + 'https://mapwarper.net/maps/tile/62081/{z}/{x}/{y}.png', { maxZoom: 21, transparent: true, attribution: "<a href='https://www.goudatijdmachine.nl'>Gouda Tijdmachine</a>", zIndex: 5 }); // 62081

// Open Streetmap

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 22, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });

// Mapbox Light

var box = L.tileLayer('https://api.mapbox.com/styles/v1/goudatijdmachine/clb99ht72005v14prsnhqkmzc/tiles/256/{z}/{x}/{y}@2x?access_token={token}', { maxZoom: 21, attribution: '&copy; <a href="https://www.mapbox.com/feedback/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>', id: 'mapbox/light-v10', token: 'pk.eyJ1IjoiZ291ZGF0aWpkbWFjaGluZSIsImEiOiJja3Q2N2Fqb24wZm9sMm9wZThzMW1tYzF1In0.F9nmw4f4wDkIJnsbVqmzJQ' });

var zoom = zoom || 16;
var map = L.map('map', { zoomSnap: 0, attributionControl: true, fullscreenControl: true, center: [52.011, 4.71], zoom: zoom, maxZoom: 22, layers: [box] });

var baseMap = {
	"Open Streetmap": osm,
	"Mapbox Light": box
};

//overlayMaps
L.control.layers(baseMap).addTo(map);