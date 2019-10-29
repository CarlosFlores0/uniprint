$(document).ready(function () {
	$('#menu-icon').on('click', function () {
		$('.navbar').toggleClass('expand');
		return false;
	});
});

var map = L.map('map');

//Add the main map, OpenStreeMap Vector Beta
L.tileLayer('http://esri.maps.arcgis.com/apps/View/index.html?appid=d6b18a2e774c4959ba855f6ac90952a2', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
}).addTo(map);

//Add shadows to the map
var OpenMapSurfer_Hillshade = L.tileLayer('https://maps.heigit.org/openmapsurfer/tiles/asterh/webmercator/{z}/{x}/{y}.png', {
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> | Map data  <a href="https://lpdaac.usgs.gov/products/aster_policies">ASTER GDEM</a>, <a href="http://srtm.csi.cgiar.org/">SRTM</a>'
}).addTo(map);

//Set the map to point at UANL
map.setView(new L.LatLng(25.72650, -100.31180), 16);

// 'control' previously called 'routingControl'
var control = L.Routing.control({
	// geocoder: L.Control.Geocoder.nominatim(),
	createMarker: function () { 
		return null; 
	},
	routeWhileDragging: false,
	addWaypoints: false,
	draggableWaypoints: false,
	router: L.Routing.graphHopper('3513fe12-dd36-42ad-8090-54069cfb7bb1', {
		urlParameters: {
			vehicle: 'foot'
		},
	})
}).addTo(map);

control.hide();

var router = control.getRouter();
router.on('response',function(e){
  console.log('This request consumed ' + e.credits + ' credit(s)');
  console.log('You have ' + e.remaining + ' left');
});

////

function button(label, container) {
	var btn = L.DomUtil.create('button', '', container);
	btn.setAttribute('type', 'button');
	btn.innerHTML = label;
	return btn;
}

var startBtn;
var startmarker = new L.marker([25.72375857, -100.31251645], { draggable: 'false' });
var endmarker = new L.marker([25.72864538, -100.31225252], { draggable: 'false' });
map.on('click', function (e) {
	var container = L.DomUtil.create('div'),
		startBtn = button('Empezar desde aqui', container);
	L.DomEvent.on(startBtn, 'click', function () {
		control.spliceWaypoints(0, 1, e.latlng);
		map.removeLayer(startmarker);
		startmarker = new L.marker(e.latlng, { draggable: 'false', icon: L.AwesomeMarkers.icon({ icon: 'fas fa-user-circle icon-white', prefix: 'fa', markerColor: 'darkpurple' }) });
		startmarker
		startmarker.on('dragend', function (event) {
			startmarker = event.target;
			var position = startmarker.getLatLng();
			control.spliceWaypoints(0, 1, position);
		});
		map.addLayer(startmarker);
		map.closePopup();
	});
	L.popup().setContent(container).setLatLng(e.latlng).openOn(map);
});

L.Routing.errorControl(control).addTo(map);  
