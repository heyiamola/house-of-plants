let mapSliderValue = document.getElementById("map-slider").value;

addMap();

let selectCircle = bufferUserLocation(userParsedLocationStr, 5);

function addMap() {
  const myMap = new mapboxgl.Map({
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
      .addTo(myMap);
  });

  myMap.addControl(new mapboxgl.NavigationControl());

  myMap.on("load", function () {
    // Add a data source containing GeoJSON data.
    myMap.addSource("buffer", {
      type: "geojson",
      data: selectCircle,
    });

    // Add a new layer to visualize the polygon.
    myMap.addLayer({
      id: "buffer",
      type: "fill",
      source: "buffer", // reference the data source
      layout: {},
      paint: {
        "fill-color": "#0080ff", // blue color fill
        "fill-opacity": 0.5,
      },
    });
    // Add a black outline around the polygon.
    myMap.addLayer({
      id: "outline",
      type: "line",
      source: "buffer",
      layout: {},
      paint: {
        "line-color": "#000",
        "line-width": 3,
      },
    });
  });
}

function bufferUserLocation(userLocation, bufferRadius) {
  let userLocationPoint = turf.point(userLocation);
  let buffered = turf.buffer(userLocationPoint, bufferRadius);
  console.log(buffered);
  return buffered;
}
