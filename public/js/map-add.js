let initialLocation = [13.3891, 52.5161];

addMap(initialLocation);

function addMap(initialLocation) {
  const mapAdd = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: initialLocation,
    zoom: 9,
  });

  var marker = new mapboxgl.Marker({
    draggable: true,
  })
    .setLngLat(initialLocation)
    .addTo(mapAdd);

  function onDragEnd() {
    let lngLat = marker.getLngLat();
    document.getElementById("latitude").value = lngLat.lat;
    document.getElementById("longitude").value = lngLat.lng;
  }

  marker.on("dragend", onDragEnd);
}
