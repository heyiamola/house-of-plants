editMap(getUserLatLng());

function editMap(userLocation) {
  const mapEdit = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: userLocation,
    zoom: 9,
  });

  let marker = new mapboxgl.Marker({
    draggable: true,
  })
    .setLngLat(userLocation)
    .addTo(mapEdit);

  function onDragEnd() {
    let lngLat = marker.getLngLat();
    document.getElementById("latitude").value = lngLat.lat;
    document.getElementById("longitude").value = lngLat.lng;
  }

  marker.on("dragend", onDragEnd);
}

function getUserLatLng() {
  if (
    document.getElementById("latitude").value === "readonly" ||
    document.getElementById("longitude").value === "readonly"
  ) {
    document.getElementById("latitude").value = 52.51704;
    document.getElementById("longitude").value = 13.38792;
  }
  userLat = document.getElementById("latitude").value;
  userLng = document.getElementById("longitude").value;
  let userLocation = [userLng, userLat];
  return userLocation;
}
