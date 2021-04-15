let mapLocation;
if (
  parsedLocationStr.coordinates.length === 0 ||
  parsedLocationStr.coordinates.length === ["readonly", "readonly"]
) {
  mapLocation = [13.38792, 52.51704];
} else {
  mapLocation = parsedLocationStr.coordinates;
}

addMap(mapLocation);

function addMap(location) {
  const mapAdd = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: location,
    zoom: 9,
  });

  let marker = new mapboxgl.Marker({}).setLngLat(location).addTo(mapAdd);
}
