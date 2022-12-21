var currentLayer = 'geen';
var straten = [];
var plekken = [];

const options = { min: 1300, max: new Date().getFullYear(), step: 1, value: [1800, 1840], onInput: changeRange, onThumbDragEnd: endRangeSliderDrag, onRangeDragEnd: endRangeSliderDrag };
var minYear = options.value[0];
var maxYear = options.value[1];

var defaultIcon = L.icon({ iconSize: [25, 41], iconAnchor: [12, 40], popupAnchor: [0, -26], iconUrl: 'https://www.goudatijdmachine.nl/data/files/geo/marker-icon.png', shadowUrl: 'https://www.goudatijdmachine.nl/data/files/geo/marker-shadow.png', shadowSize: [41, 41], shadowAnchor: [12, 40] });

function endRangeSliderDrag() {
	updateTimeBoundMapInfo();
}


showMap(currentLayer);

function showMap(newLayer) {
	if (currentLayer != 'geen') {
		maps[currentLayer].remove();
	}
	currentLayer = newLayer;
	if (currentLayer != 'geen') {
		maps[currentLayer].addTo(map);
	}
}

function showInfo(infoLayer) {
	if (plekken[infoLayer].active == 1) {
		plekken[infoLayer].geojson.remove();
		plekken[infoLayer].active = 0;
	} else {
		plekken[infoLayer].geojson.addTo(map);
		plekken[infoLayer].active = 1;
	}
}

/* periodSliderLine */


function changeRange(e) {

	minYear = e[0];
	maxYear = e[1];

	document.querySelector("div[data-lower]").innerHTML = minYear;
	document.querySelector("div[data-upper]").innerHTML = maxYear;

	updatePanels();
}

function updateTimeBoundMapInfo() {
	placeAndTimeBoundInformation.forEach((layer) => {
		if (plekken[layer.title].active == 1) {
			loadJSON(layer.geojson, function (data) {
				map.removeLayer(plekken[layer.title].geojson);
				if (typeof layer.strictperiod !== 'undefined') {
					plekken[layer.title].geojson = L.geoJSON(data, { filter: strictPeriodFilter, onEachFeature: onEachFeature, pointToLayer: function (feature, latlng) { if (typeof layer.icon != 'undefined') { return L.marker(latlng, { icon: L.icon(layer.icon) }); } else { return L.marker(latlng, { icon: defaultIcon }); } } });
				} else {
					plekken[layer.title].geojson = L.geoJSON(data, { filter: periodFilter, onEachFeature: onEachFeature, pointToLayer: function (feature, latlng) { if (typeof layer.icon != 'undefined') { return L.marker(latlng, { icon: L.icon(layer.icon) }); } else { return L.marker(latlng, { icon: defaultIcon }); } } });
				}

				plekken[layer.title].geojson.addTo(map);
			}, function (xhr) { console.error(xhr); });
		}
	});
}


function updateTimeBoundInfoContent() { // Informatie

	var burgemeesterInfo = [];

	if (burgemeesters.length == 0) { return; }

	burgemeesters.forEach((layer) => {
		if (layer.yearFrom <= maxYear && minYear <= layer.yearUntil) {
			burgemeesterInfo.push(layer);
		}
	});

	var htmlContent = '';

	years = [];

	if (burgemeesterInfo.length > 0) {
		burgemeesterInfo.forEach((layer) => {
			for (year = layer.yearFrom; year <= layer.yearUntil; year++) {
				var li = '<li><a class="pidLink" href="javascript:pidLink(\'' + layer.pid + '\')">' + layer.title + '</a></li>';
				if (typeof years[year] == 'undefined') {
					years[year] = li;
				} else {
					years[year] += li;
				}
			}
		});
	}

	if (years.length > 0) {
		htmlContent += '<div id="timeline"><div>';
		years.forEach(function callback(li, year) {
			htmlContent += '<section class="year"><h3>' + year + '</h3><section><ul>' + li + '</ul></section></section>';
		});
		htmlContent += '</div></div>';
	}
	document.getElementById('timeBoundInfoContent').innerHTML = htmlContent;
}

function updateTimeBoundInfoHeader() {	// Informatie

	var htmlContent = '';

	timeBoundInformation.forEach((layer) => {
		if (layer.yearFrom <= maxYear && minYear <= layer.yearUntil) {
			htmlContent += '<option>';
		} else {
			htmlContent += '<option disabled>';
		}
		htmlContent += layer.title;
		if (layer.yearFrom == layer.yearUntil) {
			htmlContent += ' (' + layer.yearFrom + ')';
		} else {
			htmlContent += ' (' + layer.yearFrom + '-' + layer.yearUntil + ')';
		}
		htmlContent += '</option>'

	});

	document.getElementById('infoSelect').innerHTML = htmlContent;
}

function updatePlaceTimeBoundInfoContent() { // Plekken in de tijd
	var htmlContent = '';

	placeAndTimeBoundInformation.forEach((layer) => {
		htmlContent += '<p><input onclick="showInfo(\'' + layer.title + '\')" type="checkbox"';
		if (typeof plekken[layer.title] != 'undefined' && plekken[layer.title].active > 0) {
			htmlContent += ' checked="checked"';
		}
		htmlContent += '>&nbsp;' + layer.title + '</p>';
	});
	document.getElementById('placeTimeBoundInfoContent').innerHTML = htmlContent;
}

function updateTimeBoundMapsContent() {	// Kaarten
	var htmlContent = '';

	georeferencedMaps.forEach((layer) => {
		htmlContent += '<p>';
		if (layer.yearFrom <= maxYear && minYear <= layer.yearUntil) {
			if (layer.map == currentLayer) {
				htmlContent += '<input onclick="showMap(\'' + layer.map + '\')" name="tbMap" checked="checked" type="radio">&nbsp;' + layer.title;
			} else {
				htmlContent += '<input onclick="showMap(\'' + layer.map + '\')" name="tbMap" type="radio">&nbsp;' + layer.title;
			}
			if (layer.yearFrom == layer.yearUntil) {
				htmlContent += '<span class="layerYear">' + layer.yearFrom + '</span>';
			} else {
				htmlContent += '<span class="layerYear">' + layer.yearFrom + '-' + layer.yearUntil + '</span>';
			}

		} else {
			if (layer.map == currentLayer) {
				htmlContent += '<input onclick="showMap(\'' + layer.map + '\')" name="tbMap" checked="checked" type="radio">&nbsp;<span class="disabledText">' + layer.title;
			} else {
				htmlContent += '<input onclick="showMap(\'' + layer.map + '\')" name="tbMap" type="radio">&nbsp;<span class="disabledText">' + layer.title;
			}
			if (layer.yearFrom == layer.yearUntil) {
				htmlContent += '<span class="layerYear">' + layer.yearFrom + '</span>';
			} else {
				htmlContent += '<span class="layerYear">' + layer.yearFrom + '-' + layer.yearUntil + '</span>';
			}
			htmlContent += '</span>';
		}

		htmlContent += '<p>'

	});

	if (currentLayer == 'geen') {
		htmlContent += '<br><p><input onclick="showMap(\'geen\')" name="tbMap" checked="checked" type="radio">&nbsp;Geen<p>'
	} else {
		htmlContent += '<br><p><input onclick="showMap(\'geen\')" name="tbMap" type="radio">&nbsp;Geen<p>'
	}
	document.getElementById('timeBoundMapsContent').innerHTML = htmlContent;
}


function updatePanels() {
	updateTimeBoundInfoHeader();
	updateTimeBoundInfoContent();
	updatePlaceTimeBoundInfoContent();
	updateTimeBoundMapsContent();
}

function pidLink(pid) {
	var main = document.getElementById('pidContent');
	var iframe = document.getElementById('pidContentIframe');

	iframe.src = pid;
	main.className = "showContent";

}

function pidClose() {
	var main = document.getElementById('pidContent');
	var iframe = document.getElementById('pidContentIframe');

	iframe.src = 'about:blank';
	main.className = "hideContent";
}


rangeSlider(document.querySelector('#periodSliderLine'), options);

document.querySelector("div[data-lower]").innerHTML = minYear;
document.querySelector("div[data-upper]").innerHTML = maxYear;
document.getElementById('periodSliderMin').innerHTML = options.min;
document.getElementById('periodSliderMax').innerHTML = options.max;


var burgemeesters = [];

var sparql_geojson_items = 'PREFIX gtm: <https://www.goudatijdmachine.nl/def#> PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/> PREFIX omeka: <http://omeka.org/s/vocabs/o#> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> SELECT ?pid ?title ?yearFrom ?yearUntil WHERE {     ?pid omeka:item_set <https://n2t.net/ark:/60537/bPoosY> . ?pid sem:hasActor ?actor . ?actor <http://purl.org/dc/terms/title> ?title .     ?pid sem:hasEarliestBeginTimeStamp ?yearFrom . OPTIONAL { ?pid sem:hasLatestEndTimeStamp ?yearUntil } . FILTER(CONTAINS(STR(?pid),"ark")) } GROUP BY ?pid ?title ?yearFrom ?yearUntil ORDER BY ?yearFrom';

var url = 'https://www.goudatijdmachine.nl/sparql/repositories/gtm?query=' + encodeURIComponent(sparql_geojson_items);
var xhr2 = new XMLHttpRequest();
xhr2.open("GET", url);
xhr2.setRequestHeader("Accept", "application/json");

xhr2.onreadystatechange = function () {
	if (xhr2.readyState === 4) {
		if (xhr2.status === 200) {
			sparqlresult = JSON.parse(xhr2.responseText);
			for (var prop in sparqlresult.results.bindings) {
				var burgemeester = {
					"pid": sparqlresult.results.bindings[prop].pid.value,
					"title": sparqlresult.results.bindings[prop].title.value,
					"yearFrom": sparqlresult.results.bindings[prop].yearFrom.value,
					"yearUntil": ((typeof sparqlresult.results.bindings[prop].yearUntil !== 'undefined') ? sparqlresult.results.bindings[prop].yearUntil.value : 2022)
				};
				burgemeesters.push(burgemeester);
			}
			updateTimeBoundInfoContent();
		} else {
			console.log("Call to triplestore got HTTP code " + xhr2.status);
		}
	}
};

xhr2.send();

function attachCollapseTriggers() {
	var colTriggers = document.getElementsByClassName("collapse-trigger");
	for (var colTrig of colTriggers) {
		colTrig.addEventListener("click", function () {
			this.classList.toggle("active");
		});
	}
}

attachCollapseTriggers();




function onEachFeature(feature, layer) {
	var popupContent;
	if (feature.properties) {
		if (typeof feature.properties.pid !== "undefined") {
			popupContent = "<a href=\"javascript:pidLink('" + feature.properties.pid + "')\">" + feature.properties.title + "</a>";
		} else {
			if (typeof feature.properties.id !== "undefined") {
				popupContent = "<a target=\"_blank\" href=\"" + feature.properties.id + "\">" + feature.properties.title + "</a>";
			} else {
				popupContent = feature.properties.title;
			}
		}
		//straten[feature.properties.title]=
		layer.bindPopup(popupContent);
	}
}



// not clickable....
//plekken['straten'] = L.tileLayer.wms('https://www.goudatijdmachine.nl/geoserver/gtm/wms',{ layers:'straten',maxZoom:21,transparent:true,format:'image/png',zIndex:8});

function loadGeojson() {
	placeAndTimeBoundInformation.forEach((layer) => {
		loadJSON(layer.geojson, function (data) {

			if (typeof layer.strictperiod !== 'undefined') {
				//plekken[layer.title].geojson=L.geoJSON(data, { filter: strictPeriodFilter, onEachFeature: onEachFeature }); 
				plekken[layer.title] = {
					active: 0, geojson: L.geoJSON(data, {
						filter: strictPeriodFilter, onEachFeature: onEachFeature, pointToLayer: function (feature, latlng) { if (typeof layer.icon != 'undefined') { return L.marker(latlng, { icon: L.icon(layer.icon) }); } else { return L.marker(latlng, { icon: defaultIcon }); } }
					})
				}
			} else {
				plekken[layer.title] = {
					active: 0, geojson: L.geoJSON(data, {
						filter: periodFilter, onEachFeature: onEachFeature, pointToLayer: function (feature, latlng) { if (typeof layer.icon != 'undefined') { return L.marker(latlng, { icon: L.icon(layer.icon) }); } else { return L.marker(latlng, { icon: defaultIcon }); } }
					})
				}
				//plekken[layer.title].geojson=L.geoJSON(data, { filter: periodFilter, onEachFeature: onEachFeature }); 
			}


		}, function (xhr) {
			console.error(xhr);
		});
	});
}

function strictPeriodFilter(feature) {
	return _periodFilter(feature, options.max + 2);
}

function periodFilter(feature) {
	return _periodFilter(feature, options.min);
}

function _periodFilter(feature, yearFrom) {
	if (typeof feature.properties.yearFrom != 'undefined') {
		yearFrom = feature.properties.yearFrom;
	}
	yearUntil = options.max;
	if (typeof feature.properties.yearUntil != 'undefined') {
		yearUntil = feature.properties.yearUntil;
	}

	return (yearFrom <= maxYear && minYear <= yearUntil);
}


updatePanels(); loadGeojson();
