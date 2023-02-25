import { Geolocation } from "@capacitor/geolocation";
import L from "leaflet";
import "leaflet-rotate";
import "leaflet.locatecontrol";
import { alertController } from "@ionic/vue";

const createMapInstance = async (divID) => {
  // Setting up leaflet to display the map inside div#map-home
  console.log("creating map");
  let map = L.map(divID, {
    rotate: true,
    rotateControl: {
      closeOnZeroBearing: false,
    },
    compassBearing: false,
    touchGestures: true,
    touchRotate: true,
    shiftKeyRotate: true,
    // touchZoom: true
  }).setView([27.7166, 85.3485], 16);
  // dark mode tiles link:
  // https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png
  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Adding a circle marker to user's current position
  const locationControl = L.control
    .locate({
      //tries to locate the user using Geolocation api, fires locationfound(sucess) or locationerror
      showCompass: false,
      onLocationError: requestLocationPermissions,
      icon: "leaflet-control-locate-location-arrow",
      clickBehavior: {
        inView: "setView",
        outOfView: "setView",
        inViewNotFollowing: "inView",
      },
      keepCurrentZoomLevel: true,
      locateOptions: {
        enableHighAccuracy: true,
      },
    })
    .addTo(map);
  // Getting the map to fill the screen size
  setTimeout(() => map.invalidateSize(), 500);

  // Displaying the location marker if permissions are already granted
  if ((await Geolocation.checkPermissions()).location == "granted")
    locationControl.start();

  return map;
};

// This function is run if the location permissions have not yet been granted. It is called inside onMounted.
// Once the user pressed OK on the alert, location permissions are requested.
const requestLocationPermissions = async () => {
  const alert = await alertController.create({
    header: "Alert",
    subHeader: "Grant Location Permission",
    message:
      "Please grant location permissions to the application for proper functioning.",
    buttons: [
      {
        text: "OK",
        role: "accept",
        cssClass: "secondary",
        handler: () => {
          Geolocation.requestPermissions();
        },
      },
    ],
  });

  await alert.present();
};

export { createMapInstance };
