import { map, maps, loadJSON } from './geo.js';
import { georeferencedMaps } from '../../data/georeferencedMaps.js';
import { placeAndTimeBoundInformation } from '../../data/placeAndTimeBoundInformation.js';
import { timeBoundInformation } from '../../data/timeBoundInformation.js';

const sparqlEndpoint = 'https://qlever.coret.org/gtm?query=';

const defaultIcon = L.icon({ iconSize: [25, 41], iconAnchor: [12, 40], popupAnchor: [0, -26], iconUrl: 'https://www.goudatijdmachine.nl/data/files/geo/marker-icon.png', shadowUrl: 'https://www.goudatijdmachine.nl/data/files/geo/marker-shadow.png', shadowSize: [41, 41], shadowAnchor: [12, 40] });

const sliderOptions = { min: 1300, max: new Date().getFullYear(), step: 1, value: [1800, 1840], onInput: changeRange, onThumbDragEnd: endRangeSliderDrag, onRangeDragEnd: endRangeSliderDrag };

let currentLayer = 'geen';
const placeLayerConfigs = new Map(placeAndTimeBoundInformation.map((layer) => [layer.title, layer]));
const placeLayers = new Map();
let selectedInfo = 'burgemeesters';
let timeBoundInfoRecords = [];
let minYear = sliderOptions.value[0];
let maxYear = sliderOptions.value[1];

const iconCache = new WeakMap();

const infoSelect = document.getElementById('infoSelect');
const timelineContainer = document.getElementById('timeBoundInfoContent');
const placeInfoContainer = document.getElementById('placeTimeBoundInfoContent');
const mapsContainer = document.getElementById('timeBoundMapsContent');
const lowerLabel = document.querySelector('div[data-lower]');
const upperLabel = document.querySelector('div[data-upper]');
const sliderMinLabel = document.getElementById('periodSliderMin');
const sliderMaxLabel = document.getElementById('periodSliderMax');

rangeSlider(document.querySelector('#periodSliderLine'), sliderOptions);
lowerLabel.textContent = String(minYear);
upperLabel.textContent = String(maxYear);
sliderMinLabel.textContent = String(sliderOptions.min);
sliderMaxLabel.textContent = String(sliderOptions.max);

showMap(currentLayer);
attachCollapseTriggers();
infoSelect.addEventListener('change', changeTimeBoundInfo);

updatePanels();
changeTimeBoundInfo();

function changeRange(range) {
	minYear = Number(range[0]);
	maxYear = Number(range[1]);

	lowerLabel.textContent = String(minYear);
	upperLabel.textContent = String(maxYear);

	updatePanels();
}

function endRangeSliderDrag() {
	updateTimeBoundMapInfo();
}

function showMap(newLayer) {
	if (currentLayer !== 'geen' && maps[currentLayer]) {
		maps[currentLayer].remove();
	}
	currentLayer = newLayer;
	if (currentLayer !== 'geen' && maps[currentLayer]) {
		maps[currentLayer].addTo(map);
	}
}

function updateTimeBoundMapInfo() {
	placeLayers.forEach((entry, title) => {
		if (!entry.active || !entry.data) {
			return;
		}

		if (entry.layer) {
			entry.layer.remove();
		}

		const config = placeLayerConfigs.get(title);
		if (!config) {
			return;
		}

		entry.layer = createGeoJsonLayer(config, entry.data);
		entry.layer.addTo(map);
	});
}

function createGeoJsonLayer(layerConfig, data) {
	const filter = layerConfig.strictperiod ? strictPeriodFilter : periodFilter;
	const icon = getIcon(layerConfig.icon);
	return L.geoJSON(data, {
		filter,
		onEachFeature,
		pointToLayer: (feature, latlng) => L.marker(latlng, { icon })
	});
}

function getLayerEntry(layerTitle) {
	if (!placeLayers.has(layerTitle)) {
		placeLayers.set(layerTitle, { active: false, data: null, layer: null });
	}
	return placeLayers.get(layerTitle);
}

async function togglePlaceLayer(layerTitle) {
	const config = placeLayerConfigs.get(layerTitle);
	if (!config) {
		return;
	}

	const entry = getLayerEntry(layerTitle);

	if (entry.active) {
		if (entry.layer) {
			entry.layer.remove();
			entry.layer = null;
		}
		entry.active = false;
	} else {
		if (!entry.data) {
			try {
				entry.data = await loadJSON(config.geojson);
			} catch (error) {
				console.error(error);
				updatePlaceTimeBoundInfoContent();
				return;
			}

		entry.layer = createGeoJsonLayer(config, entry.data);
		entry.layer.addTo(map);
		entry.active = true;
	}

	placeLayers.set(layerTitle, entry);
	updatePanels();
}

function getIcon(iconConfig) {
	if (!iconConfig) {
		return defaultIcon;
	}
	if (!iconCache.has(iconConfig)) {
		iconCache.set(iconConfig, L.icon(iconConfig));
	}
	return iconCache.get(iconConfig);
}

function updateTimeBoundInfoContent() {
	const relevantRecords = timeBoundInfoRecords.filter(({ yearFrom, yearUntil }) => yearFrom <= maxYear && minYear <= yearUntil);

	if (relevantRecords.length === 0) {
		timelineContainer.textContent = '';
		return;
	}

	const years = new Map();

	relevantRecords.forEach((record) => {
		for (let year = record.yearFrom; year <= record.yearUntil; year += 1) {
			const items = years.get(year) || [];
			items.push(record);
			years.set(year, items);
		}
	});

	if (years.size === 0) {
		timelineContainer.textContent = '';
		return;
	}

	const timeline = document.createElement('div');
	timeline.id = 'timeline';
	const timelineInner = document.createElement('div');
	timeline.appendChild(timelineInner);

	const sortedYears = Array.from(years.entries()).sort((a, b) => a[0] - b[0]);

	sortedYears.forEach(([year, items]) => {
		const yearSection = document.createElement('section');
		yearSection.className = 'year';

		const heading = document.createElement('h3');
		heading.textContent = year;
		yearSection.appendChild(heading);

		const section = document.createElement('section');
		const list = document.createElement('ul');

		items.forEach((item) => {
			const listItem = document.createElement('li');
			const link = document.createElement('a');
			link.className = 'pidLink';
			link.href = '#';
			link.textContent = item.title;
			link.addEventListener('click', (event) => {
				event.preventDefault();
				pidLink(item.pid);
			});
			listItem.appendChild(link);
			list.appendChild(listItem);
		});

		section.appendChild(list);
		yearSection.appendChild(section);
		timelineInner.appendChild(yearSection);
	});

	timelineContainer.replaceChildren(timeline);
}

function updateTimeBoundInfoHeader() {
	const fragment = document.createDocumentFragment();
	let hasSelection = false;

	Object.entries(timeBoundInformation).forEach(([id, layer]) => {
		const option = document.createElement('option');
		option.value = id;


		if (layer.yearFrom != layer.yearUntil) {
			option.textContent=layer.title+' (' + layer.yearFrom + '-' + layer.yearUntil + ')';
		} else {
			option.textContent=layer.title+' (' + layer.yearFrom + ')';
		}
		//option.textContent = layer.yearFrom !== layer.yearUntil ? ${layer.title} (-) : ${layer.title} ();
		option.disabled = layer.yearFrom > maxYear || minYear > layer.yearUntil;
		if (id === selectedInfo) {
			option.selected = true;
			hasSelection = true;
		}
		fragment.appendChild(option);
	});

	infoSelect.replaceChildren(fragment);

	if (!hasSelection && infoSelect.options.length > 0) {
		selectedInfo = infoSelect.options[0].value;
	}

	infoSelect.value = selectedInfo;
}

function formatLayerYears(layer) {
	return layer.yearFrom !== layer.yearUntil ? `${layer.yearFrom}-${layer.yearUntil}` : `${layer.yearFrom}`;
}


function updatePlaceTimeBoundInfoContent() {
	const fragment = document.createDocumentFragment();

	placeAndTimeBoundInformation.forEach((layer) => {
		const wrapper = document.createElement('p');
		const label = document.createElement('label');
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = Boolean(placeLayers.get(layer.title)?.active);
		checkbox.addEventListener('change', () => {
			togglePlaceLayer(layer.title).catch((error) => console.error(error));
		});
		label.appendChild(checkbox);
		label.append(' ');
		label.append(layer.title);
		wrapper.appendChild(label);
		fragment.appendChild(wrapper);
	});

	placeInfoContainer.replaceChildren(fragment);
}


function updateTimeBoundMapsContent() {
	const fragment = document.createDocumentFragment();

	georeferencedMaps.forEach((layer) => {
		const wrapper = document.createElement('p');
		const label = document.createElement('label');
		const radio = document.createElement('input');
		radio.type = 'radio';
		radio.name = 'tbMap';
		radio.value = layer.map;
		radio.checked = currentLayer === layer.map;

		const withinRange = layer.yearFrom <= maxYear && minYear <= layer.yearUntil;
		radio.disabled = !withinRange;
		radio.addEventListener('change', () => showMap(layer.map));
		label.appendChild(radio);
		label.append(' ');

		const titleSpan = document.createElement('span');
		if (!withinRange) {
			titleSpan.classList.add('disabledText');
		}
		titleSpan.textContent = layer.title;
		label.appendChild(titleSpan);
		label.append(' ');
		const yearSpan = document.createElement('span');
		yearSpan.className = 'layerYear';
		yearSpan.textContent = formatLayerYears(layer);
		label.appendChild(yearSpan);

		wrapper.appendChild(label);
		fragment.appendChild(wrapper);
	});

	const noneWrapper = document.createElement('p');
	const noneLabel = document.createElement('label');
	const noneRadio = document.createElement('input');
	noneRadio.type = 'radio';
	noneRadio.name = 'tbMap';
	noneRadio.value = 'geen';
	noneRadio.checked = currentLayer === 'geen';
	noneRadio.addEventListener('change', () => showMap('geen'));
	noneLabel.appendChild(noneRadio);
	noneLabel.append(' Geen');
	noneWrapper.appendChild(noneLabel);
	fragment.appendChild(noneWrapper);

	mapsContainer.replaceChildren(fragment);
}

function updatePanels() {
	updateTimeBoundInfoHeader();
	updateTimeBoundInfoContent();
	updatePlaceTimeBoundInfoContent();
	updateTimeBoundMapsContent();
}

function pidLink(pid) {
	const main = document.getElementById('pidContent');
	const iframe = document.getElementById('pidContentIframe');

	iframe.src = pid;
	main.className = 'showContent';
}

function pidClose() {
	const main = document.getElementById('pidContent');
	const iframe = document.getElementById('pidContentIframe');

	iframe.src = 'about:blank';
	main.className = 'hideContent';
}

window.pidLink = pidLink;
window.pidClose = pidClose;

async function changeTimeBoundInfo() {
	if (!infoSelect.value) {
		return;
	}

	selectedInfo = infoSelect.value;
	await getTimeBoundInfo();
	updateTimeBoundInfoContent();
}

async function getTimeBoundInfo() {
	timeBoundInfoRecords = [];

	const selection = timeBoundInformation[selectedInfo];
	if (!selection) {
		updateTimeBoundInfoContent();
		return;
	}

	const sparqlQuery = `
		SELECT * WHERE {
			?pid <http://omeka.org/s/vocabs/o#item_set> <${selection.itemset}> ;
				<https://schema.org/name> ?title ;
				<https://schema.org/startDate> ?yearFrom .
			OPTIONAL {
				?pid <https://schema.org/endDate> ?yearUntil .
			}
			OPTIONAL {
				?pid <https://www.goudatijdmachine.nl/def#rang> ?rang
			}
		}
		ORDER BY ?yearFrom ?rang
	`;

	try {
		const response = await fetch(sparqlEndpoint + encodeURIComponent(sparqlQuery), {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			console.log(`Call to triplestore got HTTP code ${response.status}`);
			updateTimeBoundInfoContent();
			return;
		}

		const sparqlResult = await response.json();
		const bindings = Array.isArray(sparqlResult.results?.bindings) ? sparqlResult.results.bindings : [];
		timeBoundInfoRecords = bindings.map((binding) => {
			const yearFrom = Number.parseInt(binding.yearFrom.value, 10);
			const yearUntil = binding.yearUntil ? Number.parseInt(binding.yearUntil.value, 10) : sliderOptions.max;
			return {
				pid: binding.pid.value,
				title: binding.title.value,
				yearFrom: Number.isFinite(yearFrom) ? yearFrom : sliderOptions.min,
				yearUntil: Number.isFinite(yearUntil) ? yearUntil : sliderOptions.max
			};
		});
	} catch (error) {
		console.error(error);
	}
}

function attachCollapseTriggers() {
	document.querySelectorAll('.collapse-trigger').forEach((trigger) => {
		trigger.addEventListener('click', () => {
			trigger.classList.toggle('active');
		});
	});
}

function onEachFeature(feature, layer) {
	if (!feature.properties) {
		return;
	}

	const { pid, id, title } = feature.properties;
	let popupContent = title;
	if (typeof pid !== 'undefined') {
		popupContent = '<a href="javascript:pidLink(\'' + pid + '\')">' + title + '</a>';
	} else if (typeof id !== 'undefined') {
		popupContent = '<a target="_blank" href="' + id + '">' + title + '</a>';
	}

	layer.bindPopup(popupContent);
}


function strictPeriodFilter(feature) {
	return periodFilterForFeature(feature, sliderOptions.max + 2);
}

function periodFilter(feature) {
	return periodFilterForFeature(feature, sliderOptions.min);
}

function periodFilterForFeature(feature, fallbackYearFrom) {
	const properties = feature.properties || {};
	const yearFrom = typeof properties.yearFrom !== 'undefined' ? Number(properties.yearFrom) : fallbackYearFrom;
	const yearUntil = typeof properties.yearUntil !== 'undefined' ? Number(properties.yearUntil) : sliderOptions.max;
	return yearFrom <= maxYear && minYear <= yearUntil;
}
