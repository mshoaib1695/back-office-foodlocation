import React from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow, DirectionsRenderer } from 'google-maps-react';
import {
    Button,
} from "reactstrap"
const mapStyles = {
    width: '100%',
    height: '100%'
};

class MapContainer extends React.Component {
    state = {
        directions: null,
        currentLocation: {
            lat: null,
            lng: null,
        },
    };
    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.setState({
                        currentLocation: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                    }, () => {
                        this.getDirections()
                    });
                },
                (error) => {
                    console.error(error);
                }
            );
        }
    }
    onMapReady = (mapProps, map) => {
        this.directionsRenderer = new this.props.google.maps.DirectionsRenderer();
        this.directionsService = new this.props.google.maps.DirectionsService();
        this.directionsRenderer.setMap(map);
    };

    getDirections = () => {
        const { currentLocation } = this.state;
        const { destination } = this.props;
        const request = {
            origin: new this.props.google.maps.LatLng(currentLocation.lat, currentLocation.lng),
            destination,
            travelMode: 'DRIVING',
        };
        this.directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                this.setState({ directions: result });
                this.directionsRenderer.setDirections(result);
            }
        });
    };
    render() {
        const { directions, currentLocation } = this.state;
        const { destination } = this.props;

        return (
            <div style={{ height: '500px', margin: '50px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                    <h1>Customer Location</h1>
                    <Button onClick={() => {
                        var url = "https://maps.google.com/?q=" + destination.lat + "," + destination.lng;
                        window.open(url, '_blank')
                    }} color="primary" >Open Location On Map</Button>
                </div>
                <Map
                    onReady={this.onMapReady}
                    google={this.props.google}
                    zoom={14}
                    style={mapStyles}
                    initialCenter={currentLocation}
                >
                    {/* {directions && <DirectionsRenderer directions={directions} />} */}

                    <Marker position={destination}>
                        <InfoWindow>
                            <div>
                                <h1>Delivery Address</h1>
                                <p>{"Address here"}</p>
                            </div>
                        </InfoWindow>
                    </Marker>
                </Map>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_MAP_KEY)
})(MapContainer)
