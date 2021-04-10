let userLocation = parsedLocationStr.coordinates;

addMap(userLocation);

function addMap(location) {
  const mapAdd = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: location,
    zoom: 9,
  });

  let marker = new mapboxgl.Marker({}).setLngLat(location).addTo(mapAdd);
}
