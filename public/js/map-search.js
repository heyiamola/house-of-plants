let mapSlider = document.getElementById("map-slider");
let mapSliderValue = mapSlider.value;
mapSlider.addEventListener("click", function () {
  mapSliderValue = mapSlider.value;
  updateCircle(myMap, mapSliderValue);
  arePointsInPolygon(
    plantParsedLocationStr,
    bufferUserLocation(userParsedLocationStr, mapSliderValue)
  );
});
let myMap;
let selectCircle;

addMap();

function addMap() {
  myMap = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: userParsedLocationStr,
    zoom: 9,
  });
  addMarkerToMap(myMap);
  myMap.addControl(new mapboxgl.NavigationControl());
  myMap.on("load", function () {
    renderCircle(myMap, mapSliderValue);
    document.getElementById("slidecontainer").style.display = "";
  });
}

function updateCircle(myMap, radius) {
  selectCircle = bufferUserLocation(userParsedLocationStr, radius);
  if (!selectCircle) {
    console.log("exit function, no buffer");
    return;
  }
  if (myMap.getLayer("bufferArea")) {
    myMap.removeLayer("bufferArea");
  }
  if (myMap.getLayer("bufferOutline")) {
    myMap.removeLayer("bufferOutline");
  }
  if (myMap.getSource("buffer")) {
    myMap.removeSource("buffer");
  }
  myMap.addSource("buffer", {
    type: "geojson",
    data: selectCircle,
  });
  // Add a new layer to visualize the polygon.
  myMap.addLayer({
    id: "bufferArea",
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
    id: "bufferOutline",
    type: "line",
    source: "buffer",
    layout: {},
    paint: {
      "line-color": "#000",
      "line-width": 3,
    },
  });
}

function renderCircle(myMap, radius) {
  selectCircle = bufferUserLocation(userParsedLocationStr, radius);
  if (!selectCircle) {
    console.log("exit function, no buffer");
    return;
  }
  // Add a data source containing GeoJSON data.
  myMap.addSource("buffer", {
    type: "geojson",
    data: selectCircle,
  });

  // Add a new layer to visualize the polygon.
  myMap.addLayer({
    id: "bufferArea",
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
    id: "bufferOutline",
    type: "line",
    source: "buffer",
    layout: {},
    paint: {
      "line-color": "#000",
      "line-width": 3,
    },
  });
}

function bufferUserLocation(userLocation, bufferRadius) {
  let userLocationPoint = turf.point(userLocation);
  let buffered = turf.buffer(userLocationPoint, bufferRadius);
  // console.log(buffered);
  return buffered;
}

function arePointsInPolygon(plantPointLocations, polygon) {
  plantArray = plantPointLocations.map((value) => value.plantLocation);
  let points = turf.points(plantArray);
  // console.log(polygon);
  let pointsWithin = turf.pointsWithinPolygon(points, polygon);
  console.log(pointsWithin);
}

function addMarkerToMap(myMap) {
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
}
