import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Image,c
  Pressable,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import MapView, {Marker} from 'react-native-maps';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {first, isNull} from 'lodash';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentImg, setCurrentImage] = useState<string | null>(null);
  const [currentLat, setCurrentLat] = useState<number | null>(null);
  const [currentLong, setCurrentLong] = useState<number | null>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    if (!isNull(currentImg)) {
      Geolocation.getCurrentPosition(
        (position: GeolocationResponse) => {
          if (
            position.coords &&
            position.coords.longitude &&
            position.coords.latitude
          ) {
            setCurrentLong(position.coords.longitude);
            setCurrentLat(position.coords.latitude);
          }
        },
        error => {
          console.log(error.message);
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 1000,
        },
      );
    }
  }, [currentImg]);

  const handleClick = async () => {
    const result: any = await launchImageLibrary({
      mediaType: 'photo',
    });
    if (result && result.assets) {
      const element: any = first(result.assets);
      if (element) {
        setCurrentImage(element?.uri);
      }
    }
  };

  const handleReset = () => {
    setCurrentLat(null);
    setCurrentLong(null);
    setCurrentImage(null);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Lunch Camera" />
          {!isNull(currentImg) &&
            !isNull(currentLat) &&
            !isNull(currentLong) && (
              <MapView
                style={{width: '100%', height: 200, marginBottom: 10}}
                initialRegion={{
                  latitude: currentLat,
                  longitude: currentLong,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}>
                <Marker
                  coordinate={{
                    latitude: currentLat,
                    longitude: currentLong,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                />
              </MapView>
            )}
          {
            !isNull(currentImg) && <Pressable onPress={() => handleClick()}>
              <Image
                source={{uri: currentImg}}
                resizeMode={'cover'}
                style={{
                  width: 200,
                  height: 200,
                  borderWidth: 2,
                  marginBottom: 20,
                  borderRadius: 8,
                }}
              />
            </Pressable>
          }
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                marginTop: 10,
                marginBottom: 10,
                width: '40%',
                height: 40,
                borderWidth: 2,
                borderColor: 'gray',
                borderRadius: 10,
                padding: 10,
              }}
              onPress={() => handleClick()}>
              <Text>Lunch Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 10,
                marginBottom: 10,
                width: '40%',
                height: 40,
                borderWidth: 2,
                borderColor: 'red',
                backgroundColor: 'red',
                borderRadius: 10,
                padding: 10,
              }}
              onPress={() => handleReset()}>
              <Text style={{color: 'white'}}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
