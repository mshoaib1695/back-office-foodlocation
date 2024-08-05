import React, { useState, useEffect } from 'react';

function MapSelector(props) {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${props.apiKey}&libraries=places`;
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 20
      });
      setMap(map);

      const marker = new window.google.maps.Marker({
        map: map,
        draggable: true
      });
      setMarker(marker);

      const infoWindow = new window.google.maps.InfoWindow();

      const handleMapClick = (event) => {
        const { latLng } = event;
        setCurrentLocation({ lat: latLng.lat(), lng: latLng.lng() });
        marker.setPosition(latLng);
        infoWindow.setContent('Selected Location');
        infoWindow.open(map, marker);
      };

      window.google.maps.event.addListener(map, 'click', handleMapClick);
    }
  }, []);

  useEffect(() => {
    // if(props.location.lat && props.location.lng){
    //   setCurrentLocation({ lat: props.location.lat, lng: props.location.lng });
    //   map.setCenter({ lat: props.location.lat, lng: props.location.lng });
    //   marker.setPosition({ lat: props.location.lat, lng: props.location.lng });
    // }
  }, [])
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        map.setCenter({ lat: latitude, lng: longitude });
        marker.setPosition({ lat: latitude, lng: longitude });
        const infoWindow = new window.google.maps.InfoWindow({
          content: 'Current Location'
        });
        infoWindow.open(map, marker);
      }, () => {
        console.log('Error: The Geolocation service failed.');
      });
    } else {
      console.log('Error: Your browser doesn\'t support geolocation.');
    }
  }

  const handleSelectLocation = () => {
    props.onSelectLocation(currentLocation);
  };

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        margin: '10px'
      }}>

        <div onClick={getCurrentLocation} style={{
          backgroundColor: '#7367f0', "color": "#fff",
          "padding": "10px 20px",
          "borderRadius": "5px",
          cursor: 'pointer'
        }}>
          <span className="align-middle ml-50">Use your current location</span>
        </div>
        {
          currentLocation &&
          <div onClick={handleSelectLocation} style={{
            backgroundColor: '#7367f0', "color": "#fff",
            "padding": "10px 5px",
            "borderRadius": "5px",
            cursor: 'pointer'
          }}>
            <span className="align-middle ml-50">Set This Location</span>
          </div>
        }
      </div>
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
    </>
  );
}

export default MapSelector;
