import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, TouchableHighlight, View, Alert, Button, Image, SafeAreaView } from 'react-native';
import { useRef, useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = process.env.GOOGLE_MAPS_APIKEY;

export default function App() {
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE = 6.58099;
  const LONGITUDE = 3.35445;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [state, setState] = useState({
    // Rider starting from Chowdeck office to pick up order at Mega chicken, Alausa 
    // and Delivering to customer at College road, Ogba
    coordinates: [
      {
        latitude: 6.58099,
        longitude: 3.35445
      },
      {
        latitude: 6.62642,
        longitude: 3.35358
      },
      {
        latitude: 6.64465,
        longitude: 3.32843
      }
    ],
    pickupCoords: {
      latitude: 6.62642,
      longitude: 3.35358,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    dropLocationCoords: {
      latitude: 6.64465,
      longitude: 3.32843,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    officeCoords: {
      latitude: 6.58099,
      longitude: 3.35445,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  });

  const { coordinates } = state;
  const mapRef = useRef()

  onMapPress = (e) => {
    this.setState({
      coordinates: [
        ...coordinates,
        e.nativeEvent.coordinate,
      ],
    });
  }

  return (
      <MapView provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        onPress={onMapPress}
        ref={mapRef}
        >
          
        {coordinates.map((coordinate, index) => <Marker key={`coordinate_${index}`} coordinate={coordinate} /> )}

        <MapViewDirections
          origin={coordinates[0]}
          waypoints={coordinates.length > 2 ? coordinates.slice(1, -1): undefined}
          destination={coordinates[coordinates.length-1]}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="blue"
          optimizeWaypoints={true}
          onStart={(params) => {
            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
          }}
          onReady={result => {
            console.log(`Distance: ${result.distance} km`);
            console.log(`Duration: ${result.duration} min.`);
            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: (width / 20),
                bottom: ( height / 20),
                left:  ( width / 20),
                top: ( height / 20),
              }
            });
          }}
          onError={(errorMessage) => {
            console.error('GOT AN ERROR', errorMessage);
          }}
          >
        </MapViewDirections>
      </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
