addMap();

function addMap() {
  const mapAdd = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: userParsedLocationStr,
    zoom: 9,
  });

  plantParsedLocationStr.forEach((plant) => {
    new mapboxgl.Marker({}).setLngLat(plant.plantLocation).addTo(mapAdd);
  });
}
