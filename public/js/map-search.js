let mapSliderValue = document.getElementById("map-slider").value;

addMap();

bufferUserLocation(userParsedLocationStr, mapSliderValue);

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

// map.on("load", function () {
//   // Add a data source containing GeoJSON data.
//   map.addSource("maine", {
//     type: "geojson",
//     data: {
//       type: "Feature",
//       geometry: {
//         type: "Polygon",
//         // These coordinates outline Maine.
//         coordinates: [
//           [
//             [-67.13734, 45.13745],
//             [-66.96466, 44.8097],
//             [-68.03252, 44.3252],
//             [-69.06, 43.98],

//             [-67.79141, 45.70258],
//             [-67.13734, 45.13745],
//           ],
//         ],
//       },
//     },
//   });

//   // Add a new layer to visualize the polygon.
//   map.addLayer({
//     id: "maine",
//     type: "fill",
//     source: "maine", // reference the data source
//     layout: {},
//     paint: {
//       "fill-color": "#0080ff", // blue color fill
//       "fill-opacity": 0.5,
//     },
//   });
//   // Add a black outline around the polygon.
//   map.addLayer({
//     id: "outline",
//     type: "line",
//     source: "maine",
//     layout: {},
//     paint: {
//       "line-color": "#000",
//       "line-width": 3,
//     },
//   });
// });

function bufferUserLocation(userLocation, bufferRadius) {
  let userLocationPoint = turf.point(userLocation);
  let buffered = turf.buffer(userLocationPoint, bufferRadius);
  console.log(buffered);
  return buffered;
}
