import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, Platform, StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class LoadingScreen extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.navigate('DashboardScreen');
      } else {
        this.props.navigation.navigate('LoginScreen');
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.droidSafeArea} />
        <View style={styles.appTitle}>
          <View style={styles.appIcon}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.iconImage}></Image>
          </View>
          <View style={styles.appTitleTextContainer}>
            <Text style={styles.appTitleText}>Storytelling App</Text>
          </View>
        </View>
        <View style={styles.screenName}>
          <Text style={styles.screenText}>Loading...</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15193c',
  },
  droidSafeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.5,
  },
  appIcon: {
    flex: 0.4,
    marginTop: RFValue(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '100%',
    height: '150%',
    resizeMode: 'contain',
    marginTop: -10,
    marginBottom: 10,
  },
  appTitleTextContainer: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(45),
    fontFamily: 'Bubblegum-Sans',
    textAlign: 'center',
    marginTop: -10,
    marginBottom: 10,
  },
  screenName: {
    flex: 0.25,
    justifyContent: 'center'
  },
  screenText: {
    color: 'white',
    fontSize: RFValue(35),
    fontFamily: 'Bubblegum-Sans',
    textAlign: 'center',
    marginTop: -10,
    marginBottom: 10,
    fontStyle: 'italic',
  },
});
