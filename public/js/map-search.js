addMap();

console.log(plantParsedLocationStr);

// bufferUserLocation(userParsedLocationStr, 5);

function addMap() {
  const mapAdd = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: userParsedLocationStr,
    zoom: 9,
  });

  // let plantPopup = new mapboxgl.Popup({ offset: 25 }).setText("Testing popup");

  plantParsedLocationStr.forEach((plant) => {
    let plantPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      '<a href="/plant/view/' + plant.plantId + '">View plant</a>'
      // `<a href="/plant/view/${plant.plantId}>View plant</a>`
    );

    new mapboxgl.Marker({})
      .setLngLat(plant.plantLocation)
      .setPopup(plantPopup)
      .addTo(mapAdd);
  });
}

function bufferUserLocation(userLocation, bufferRadius) {
  let userLocationPoint = turf.point(userLocation);
  let buffered = turf.buffer(userLocationPoint, bufferRadius);
  // console.log(buffered);
  return buffered;
}
