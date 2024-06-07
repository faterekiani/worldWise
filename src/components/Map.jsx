import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import Button from "./Button";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/geoLocation";
import { useUrlPosition } from "../hooks/useUrlPosition";

export default function Map() {
  // current selected city position
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { cities } = useCities();
  const {
    isLoading: isLoadinPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  // does'nt render until maplat and maplng changes
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  // useEffect(
  //   function () {
  //     if (GeolocationPosition)
  //       setMapPosition([GeolocationPosition.lat, GeolocationPosition.lng]);
  //   },
  //   [geoLocationPosition]
  // );

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadinPosition ? "is loading..." : "use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

//set data to url- when click on the map, the url will be updated
function DetectClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}
