
const TABS = ['one', 'two', 'three'];

function openTab(evt, tabNum) {
	let tablinks = document.getElementsByClassName("tablinks");
	for (let i=0; i<tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", ""); // Reset
	}
	for (let i=0; i<TABS.length; i++) {
		document.getElementById(TABS[i]).style.display = (i === tabNum) ? 'block' : 'none';
	}
	evt.currentTarget.className += " active";
}

function getQSPrm(prm) {
	let value;
	let loc = document.location.toString();
	if (loc.indexOf("?") > -1) {
		let qs = loc.substring(loc.indexOf("?") + 1);
		let prms = qs.split('&');
		for (let i=0; i<prms.length; i++) {
			let nv = prms[i].split('=');
			if (nv.length === 2) {
				if (nv[0] === prm) {
					return nv[1];
				}
			}
		}
	}
	return value;
}

function changeBG(value) {
	let bodyStyle = document.getElementsByTagName("body")[0].style;
	let htmlStyle = document.getElementsByTagName("html")[0].style;
	switch (value) {
		case 'WHITE':
			bodyStyle.background = 'white';
			htmlStyle.backgroundColor = 'white';
			break;
		case 'LIGHT':
			bodyStyle.background = 'radial-gradient(at top, white -8%, lightgrey 55%)';
			htmlStyle.backgroundColor = 'lightgrey';
			break;
		case 'DARK':
			bodyStyle.background = 'radial-gradient(at top, DarkGrey -8%, black 55%)';
			htmlStyle.backgroundColor = 'black';
			break;
		case 'BLACK':
			bodyStyle.background = 'black';
			htmlStyle.backgroundColor = 'black';
			break;
		default:
			break;
	}
	// World Map theme worldmap-display-02, worldmap-display, split-flap-display
	switch (value) {
		case "BLACK":
		case "DARK":
			applyClass('world-map-01', 'worldmap-display');
			applyClass('split-flap-display-00', 'split-flap-night');
			applyClass('split-flap-display-01', 'split-flap-night');
			applyClass('split-flap-display-02', 'split-flap-night');
			applyClass('split-flap-display-03', 'split-flap-night');
			break;
		case "LIGHT":
		case "WHITE":
			applyClass('world-map-01', 'worldmap-display-02');
			applyClass('split-flap-display-00', 'split-flap-day');
			applyClass('split-flap-display-01', 'split-flap-day');
			applyClass('split-flap-display-02', 'split-flap-day');
			applyClass('split-flap-display-03', 'split-flap-day');
			break;
	}
}

let headsUpExpanded = false;
function collapseExpandHeadsup() {
	let cmdElem = document.getElementById("head-up-command");
	let slidersElem = document.getElementById("heads-up-sliders");
	if (headsUpExpanded) {
		slidersElem.style.display = 'none';
		cmdElem.innerText = "+ Head up";
	} else {
		slidersElem.style.display = 'block';
		cmdElem.innerText = "- Head up";
	}
	headsUpExpanded = !headsUpExpanded;
}

let boatDataExpanded = true;
function expandCollapseBoatData() {
	boatDataExpanded = !boatDataExpanded;
	if (boatDataExpanded) {
		document.getElementById('row-1').style.display = 'grid';
		document.getElementById('row-2').style.display = 'grid';
		document.getElementById('boat-data-switch').innerText = ' - Boat Data';
	} else {
		document.getElementById('row-1').style.display = 'none';
		document.getElementById('row-2').style.display = 'none';
		document.getElementById('boat-data-switch').innerText = ' + Boat Data';
	}
}
/**
 * Set data to the WebComponents
 * Assume that they all have a 'value' member.
 *
 * @param from The field containing the value to set
 * @param to The WebComponent to set the value to
 */
function setData(id, value) {
	let elem = document.getElementById(id);
	elem.value = value;                            // value corresponds to the 'set value(val) { ...', invokes the setter in the HTMLElement class
	elem.repaint();
}

function setBorder(cb, id) {
	document.getElementById(id).withBorder = cb.checked;
}

function setRose(cb, id) {
	document.getElementById(id).withRose = cb.checked;
}

function setMinMax(cb, id) {
	document.getElementById(id).withMinMax = cb.checked;
}

function setTransparency(wcId, cb) {
	document.getElementById(wcId).transparentGlobe = (cb.checked ? 'true' : 'false');
	document.getElementById(wcId).repaint();
}

function setSun(wcId, cb) {
	document.getElementById(wcId).withSun = (cb.checked ? 'true' : 'false');
	document.getElementById(wcId).repaint();
}

function setGrid(wcId, cb) {
	document.getElementById(wcId).withGrid = (cb.checked ? 'true' : 'false');
	document.getElementById(wcId).repaint();
}

function setMoon(wcId, cb) {
	document.getElementById(wcId).withMoon = (cb.checked ? 'true' : 'false');
	document.getElementById(wcId).repaint();
}

function setSunlight(wcId, cb) {
	document.getElementById(wcId).withSunlight = (cb.checked ? 'true' : 'false');
	document.getElementById(wcId).repaint();
}

function setMoonlight(wcId, cb) {
	document.getElementById(wcId).withMoonlight = (cb.checked ? 'true' : 'false');
	document.getElementById(wcId).repaint();
}

function setWanderingBodies(wcId, cb) {
	document.getElementById(wcId).withWanderingBodies = (cb.checked ? 'true' : 'false');
	document.getElementById(wcId).repaint();
}

function setStars(wcId, cb) {
	document.getElementById(wcId).withStars = (cb.checked ? 'true' : 'false');
	document.getElementById(wcId).repaint();
}

function setTropics(wcId, cb) {
	document.getElementById(wcId).withTropics = (cb.checked ? 'true' : 'false');
	document.getElementById(wcId).repaint();
}

function setProjection(id, radio) {
	document.getElementById(id).projection = radio.value;
	document.getElementById(id).repaint();
}

function setMapType(id, list) {
	document.getElementById(id).type = list.value;
	document.getElementById(id).repaint();
}

function setStarNames(id, cb) {
	document.getElementById(id).starNames = cb.checked;
	document.getElementById(id).repaint();
}

function setConstNames(id, cb) {
	document.getElementById(id).constellationNames = cb.checked;
	document.getElementById(id).repaint();
}

function setVisibleSky(id, cb) {
	document.getElementById(id).visibleSky = cb.checked;
	document.getElementById(id).repaint();
}

function setSkyGrid(id, cb) {
	document.getElementById(id).skyGrid = cb.checked;
	document.getElementById(id).repaint();
}

// Depends on the user position... Would not turn with the globe.
let gpsSatelliteData = undefined;

function plotSatellite(context, worldMap, userPos, satColor, name, satellite) {
	let sat = worldMap.getPanelPoint(satellite.lat, satellite.lng);
	let thisPointIsBehind = worldMap.isBehind(worldMap.toRadians(satellite.lat), worldMap.toRadians(satellite.lng - worldMap.globeViewLngOffset));
	if (!thisPointIsBehind || worldMap.transparentGlobe) {
		// Draw Satellite
		worldMap.plot(context, sat, satColor);
		context.fillStyle = satColor;
		context.fillText(name, Math.round(sat.x) + 3, Math.round(sat.y) - 3);
		// Arrow, to the satellite
		context.setLineDash([2]);
		context.strokeStyle = satColor;
		context.beginPath();
		context.moveTo(userPos.x, userPos.y);
		context.lineTo(sat.x, sat.y);
		context.stroke();
		context.closePath();
		context.setLineDash([0]); // Reset
		context.strokeStyle = satColor;
		let deltaX = sat.x - userPos.x;
		let deltaY = sat.y - userPos.y;
		context.beginPath();
		context.moveTo(sat.x, sat.y);
		context.lineTo(sat.x + deltaX, sat.y + deltaY);
		context.stroke();
		context.closePath();
		worldMap.fillCircle(context, {x: sat.x + deltaX, y: sat.y + deltaY}, 6, satColor);
	}
}

// More colors at https://www.w3schools.com/colors/colors_picker.asp
function getSNRColor(snr) {
	var c = 'lightGray';
	if (snr !== undefined && snr !== null) {
		if (snr > 0) {
			c = 'red';
		}
		if (snr > 10) {
			c = 'orange';
		}
		if (snr > 20) {
			c = 'yellow';
		}
		if (snr > 30) {
			c = 'lightGreen';
		}
		if (snr > 40) {
			c = 'lime';
		}
	}
	return c;
}

// Example of callback on WorldMap
function callAfter(id) {
	document.getElementById(id).setDoAfter(function(worldMap, context) {
		if (Object.keys(worldMap.userPosition).length > 0) {
			let userPos = worldMap.getPanelPoint(worldMap.userPosition.latitude, worldMap.userPosition.longitude);
			/*
			 * Display 4 geostationary satellites. Data provided below.
			 */
			const sats = [
				{name: "I-4 F1 Asia-Pacific", lng: 143.5},
				{name: "I-4 F2 EMEA", lng: 63.0},
				{name: "I-4 F3 Americas", lng: -97.6},
				{name: "Alphasat", lng: 24.9}];
			if (document.getElementById('geo-sat-01').checked) {
				let satColor = 'cyan';
				sats.forEach(gs => {
					plotSatellite(context, worldMap, userPos, satColor, gs.name, {lat: 0, lng: gs.lng});
				});
			}

			// GPS Satellites in view
			if (document.getElementById('gps-sat-01').checked && gpsSatelliteData !== undefined) {
				for (var sat in gpsSatelliteData) {
					let satellite = gpsSatelliteData[sat];
					let satellitePosition = worldMap.deadReckoningRadians({
						lat: worldMap.toRadians(worldMap.userPosition.latitude),
						lng: worldMap.toRadians(worldMap.userPosition.longitude)
					}, (90 - satellite.elevation) * 60, satellite.azimuth);
					plotSatellite(context, worldMap, userPos, getSNRColor(satellite.snr), sat, {
						lat: worldMap.toDegrees(satellitePosition.lat),
						lng: worldMap.toDegrees(satellitePosition.lng)
					});
				}
			}
		}
	});
	document.getElementById(id).repaint();
}

const DURATION_FMT = "Y-m-dTH:i:s";
const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

const BODIES = [{
		name: "sun",
		display: {
			name: "Sun",
			symbol: "\u2609"
		}
	},{
		name: "moon",
		display: {
			name: "Moon",
			symbol: "\u263D"
		}
	},{
		name: "venus",
		display: {
			name: "Venus",
			symbol: "\u2640"
		}
	},
	{
		name: "mars",
		display: {
			name: "Mars",
			symbol: "\u2642"
		}
	}, {
		name: "jupiter",
		display: {
			name: "Jupiter",
			symbol: "\u2643"
		}
	}, {
		name: "saturn",
		display: {
			name: "Saturn",
			symbol: "\u2644"
		}
	}];

function bodyName(name) {
	for (let i=0; i<BODIES.length; i++) {
		if (name === BODIES[i].name) {
			return BODIES[i].display.name + ' ' + BODIES[i].display.symbol;
		}
	}
	return name;
}

function getLHA(gha, longitude) {
	let lha = gha + longitude;
	while (lha < 0) lha +=360;
	while (lha > 360) lha -= 360;
	return lha;
}

function astroCallback(data) {
//console.log("Astro Data:", data);

	let worldMap = document.getElementById('world-map-01');
	let skyMap = document.getElementById('sky-map-01');

	let lhaAries = getLHA(data.ghaAries, data.from.longitude);

	let sunLHA = getLHA(data.sun.gha, data.from.longitude);
	let moonLHA = getLHA(data.moon.gha, data.from.longitude);
	let dataTable =
			'<table border="1" class="raw-table">' + '<tr><th>Body</th><th>D</th><th>GHA</th><th>LHA</th><th>Alt</th><th>Z</th></tr>' +
			'<tr><td align="left">' + bodyName("sun") + '</td><td>' + worldMap.decToSex(data.sun.decl, "NS") + '</td><td align="right">' + worldMap.decToSex(data.sun.gha) + '</td><td align="right">' + worldMap.decToSex(sunLHA) + '</td><td align="right">' +	worldMap.decToSex(data.sunObs.alt) + '</td><td align="right">' + worldMap.decToSex(data.sunObs.z) + '</td></tr>' +
			'<tr><td align="left">' + bodyName("moon") + '</td><td>' + worldMap.decToSex(data.moon.decl, "NS") + '</td><td align="right">' + worldMap.decToSex(data.moon.gha) + '</td><td align="right">' + worldMap.decToSex(moonLHA) + '</td><td align="right">' +	worldMap.decToSex(data.moonObs.alt) + '</td><td align="right">' + worldMap.decToSex(data.moonObs.z) + '</td></tr>';

	if (data.wanderingBodies !== undefined) {
		for (let i=0; i<data.wanderingBodies.length; i++) {
			if (data.wanderingBodies[i].name !== "aries") {
				dataTable +=
				'<tr><td align="left">' + bodyName(data.wanderingBodies[i].name) + '</td><td align="right">' + worldMap.decToSex(data.wanderingBodies[i].decl, "NS") + '</td><td align="right">' + worldMap.decToSex(data.wanderingBodies[i].gha) + '</td><td>' + worldMap.decToSex(getLHA(data.wanderingBodies[i].gha, data.from.longitude)) + '</td><td align="right">' + worldMap.decToSex(data.wanderingBodies[i].fromPos.observed.alt) + '</td><td align="right">' + worldMap.decToSex(data.wanderingBodies[i].fromPos.observed.z) + '</td></tr>';
			}
		}
	}

	dataTable +=
			'<tr><td align="left">Aries &gamma;</td><td></td><td align="right">' + worldMap.decToSex(data.ghaAries) + '</td><td align="right">' + worldMap.decToSex(lhaAries) + '</td></tr>' + '</table>';

	document.getElementById("sun-moon-data").innerHTML = dataTable;

	// Display solar date & time
	let solarDate = new Date(data.solarDate.year, data.solarDate.month - 1, data.solarDate.day, data.solarDate.hour, data.solarDate.min, data.solarDate.sec);
	let time = solarDate.format("H:i:s");
	setData('analog-watch-02', time);
	let date = solarDate.format("d-m-Y-l");
	setData('calendar-02', date);

	let utcDate = new Date(data.epoch);

	let sysDateFmt = utcDate.format('D d-M-Y H:i:s Z');
//console.log("Ststem date %s", sysDateFmt);

	document.getElementById("split-flap-display-01")
			.value = sysDateFmt;

	// utc-date
	document.getElementById("utc-date").innerHTML = 'UTC: ' +
			utcDate.getUTCFullYear() + ' ' +
			months[utcDate.getUTCMonth()] + ' ' +
			(utcDate.getUTCDate() < 10 ? '0' : '') + utcDate.getUTCDate() + ' ' +
			(utcDate.getUTCHours() < 10 ? '0' : '') + utcDate.getUTCHours() + ':' +
			(utcDate.getUTCMinutes() < 10 ? '0' : '') + utcDate.getUTCMinutes() + ':' +
			(utcDate.getUTCSeconds() < 10 ? '0' : '') + utcDate.getUTCSeconds();

	document.getElementById("solar-date").innerHTML = 'Solar Time: ' +
			data.solarDate.year + ' ' +
			months[data.solarDate.month - 1] + ' ' +
			(data.solarDate.day < 10 ? '0' : '') + data.solarDate.day + ' ' +
			(data.solarDate.hour < 10 ? '0' : '') + data.solarDate.hour + ':' +
			(data.solarDate.min < 10 ? '0' : '') + data.solarDate.min + ':' +
			(data.solarDate.sec < 10 ? '0' : '') + data.solarDate.sec;

	// Display transit time
	document.getElementById("sun-transit").innerHTML = 'Sun Transit: ' +
			(data.tPass.hour < 10 ? '0' : '') + data.tPass.hour + ':' +
			(data.tPass.min < 10 ? '0' : '') + data.tPass.min + ':' +
			(data.tPass.sec < 10 ? '0' : '') + data.tPass.sec + ' ' +
			data.tPass.tz;

	worldMap.setAstronomicalData(data);
	worldMap.repaint();

	if (data.wanderingBodies !== undefined) {
		let wb = data.wanderingBodies;
		wb.push({ name: "sun", decl: data.sun.decl, gha: data.sun.gha});
		wb.push({ name: "moon", decl: data.moon.decl, gha: data.moon.gha});
		skyMap.wanderingBodies = true;
		skyMap.wanderingBodiesData = wb;
	} else {
		skyMap.withWanderingBodies = false;
	}

	skyMap.hemisphere = (data.from.latitude > 0 ? 'N' : 'S');
	skyMap.lhaAries = lhaAries;
	skyMap.latitude = Math.abs(data.from.latitude);
	skyMap.repaint();
}

function setTheme(className) {
	applyClass('compass-01', className);
	applyClass('tw-01', className);
	applyClass('bsp-01', className);
	applyClass('aw-01', className);
	applyClass('compass-rose-01', className);
	applyClass('analog-watch-01', className);
	applyClass('analog-watch-02', className);
}

function applyClass(id, className) {
	let widget = document.getElementById(id);
	if (widget !== null) {
		widget.className = className;
		widget.repaint();
	}
}

function toggleHeadsUp() {
	document.getElementById('nmea-widgets-1').classList.toggle('mirror-upside-down');
	document.getElementById('nmea-widgets-2').classList.toggle('mirror-upside-down');
	document.getElementById('sky-maps-1').classList.toggle('mirror-upside-down');
}

function setPadding(range) {
	var v = range.value;
	document.getElementById('nmea-widgets-1').style.setProperty("--padding", v + "px");
	document.getElementById('nmea-widgets-2').style.setProperty("--padding", v + "px");
	document.getElementById('sky-maps-1').style.setProperty("--padding", v + "px");
}

function setPerspective(range) {
	var v = range.value;
	document.getElementById('nmea-widgets-1').style.setProperty("--perspective", v + "em");
	document.getElementById('nmea-widgets-2').style.setProperty("--perspective", v + "em");
	document.getElementById('sky-maps-1').style.setProperty("--perspective", v + "em");
}

function setRotateX(range) {
	var v = range.value;
	document.getElementById('nmea-widgets-1').style.setProperty("--rotateX", v + "deg");
	document.getElementById('nmea-widgets-2').style.setProperty("--rotateX", v + "deg");
	document.getElementById('sky-maps-1').style.setProperty("--rotateX", v + "deg");
}

let aws = 0;
let awa = 0;
let tws = 0;
let twa = 0;

let gpsPosition = undefined;
let withStars = false;
let withWanderingBodies = false;

const THEMES = {
	"day":        "analogdisplay-day",
	"night":      "analogdisplay-night",
	"cyan":       "analogdisplay-monochrome-cyan",
	"orange":     "analogdisplay-monochrome-orange",
	"yellow":     "analogdisplay-monochrome-yellow",
	"flat-gray":  "analogdisplay-flat-gray",
	"flat-black": "analogdisplay-flat-black"
};
const DISPLAYS = [
	'compass-01',
	'tw-01',
	'bsp-01',
	'aw-01',
	'analog-watch-01',
	'analog-watch-02'
];
window.onload = function() {
	/* global initAjax */
	initAjax(); // Default. See later for a WebSocket option

	callAfter('world-map-01'); // Adding Satellites plot.

	// Query String prms, border, bg, style, like ?border=n&bg=black&style=orange&boat-data=n
	let style = getQSPrm('style');
	let border = getQSPrm('border');
	let bg = getQSPrm('bg');
	let boatData = getQSPrm('boat-data');

	if (style !== undefined) {
		if (style === 'day' || style === 'night' || style === 'cyan' || style === 'orange' || style === 'yellow' || style === 'flat-gray' || style === 'flat-black') {
			setTheme(THEMES[style]);
			// Set selected value
			document.getElementById("widgets-style").value = THEMES[style];
		} else {
			console.log("Unknown style", style);
		}
	}

	if (bg !== undefined) {
		if (bg === 'black' || bg === 'dark' || bg === 'light' || bg === 'white') {
			changeBG(bg.toUpperCase());
			document.getElementById(bg).checked = true;
		} else {
			console.log("Unknown background", bg);
		}
	}

	if (border !== undefined) {
		if (border === 'y' || border === 'n') {
			DISPLAYS.forEach(function (id, idx) {
				let element = document.getElementById(id);
				if (element !== null) {
					element.withBorder = (border === 'y');
				}
			});
			// Check/uncheck boxes
			let cbs = document.getElementsByClassName('border-cb');
			for (let i = 0; i < cbs.length; i++) {
				cbs[i].checked = (border === 'y');
			}
		} else {
			console.log("Unknown border", border);
		}
	}

	if (boatData !== undefined) {
		if (boatData === 'y' || boatData === 'n') {
			expandCollapseBoatData();
		}
	}

}

function displayErr(err) {
	if (err !== undefined) {
		console.log(err);
	}
}
