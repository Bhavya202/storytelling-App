//email - app@admin.com
//password - @admin
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  ScrollView,
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Font from 'expo-font';
import firebase from 'firebase';

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      email: '',
      password: '',
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = (googleUser) => {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(function (result) {
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .database()
                .ref('/users/' + result.user.uid)
                .set({
                  gmail: result.user.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  first_name: result.additionalUserInfo.profile.given_name,
                  last_name: result.additionalUserInfo.profile.family_name,
                  current_theme: 'dark',
                })
                .then(function (snapshot) {});
            }
          })
          .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
          });
      } else {
        console.log('User already signed-in Firebase!!');
      }
    });
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        behavior: 'web',
        androidClientId:
          '239085886650-u43e5bl9g025f6cvnjmgqvsh4t43igcg.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e.message);
      return { error: true };
    }
  };

  handleLogin = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.navigate('Home');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  render() {
    const { email, password } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.droidSafeArea} />
        <View style={styles.appTitle}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.appIcon}></Image>
          <Text style={styles.appTitleText}>{`Storytelling\nApp`}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.screenName}>
            <Text style={styles.screenTitle}>Log In</Text>
          </View>
          <View style={styles.lowerContainer}>
            <TextInput
              style={[
                styles.textInputBtn,
                { fontWeight: 'bold', fontStyle: 'italic', fontSize: 15 },
              ]}
              onChangeText={(text) => this.setState({ email: text })}
              placeholder={'Enter Email...'}
              placeholderTextColor={'black'}
            />
            <TextInput
              style={[
                styles.textInputBtn,
                { fontWeight: 'bold', fontStyle: 'italic', fontSize: 15 },
              ]}
              onChangeText={(text) => this.setState({ password: text })}
              placeholder={'Enter Password...'}
              placeholderTextColor={'black'}
              secureTextEntry={true}
            />
            <View style={styles.responsiveBtn}>
              <TouchableOpacity
                style={styles.responsiveButton}
                onPress={() => {
                  this.handleLogin(email, password);
                }}>
                <Text style={styles.responsiveButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.signInWithGoogleAsync()}>
            <Image
              source={require('../assets/google_icon.png')}
              style={styles.googleIcon}></Image>
            <Text style={styles.googleText}>Sign in with Google</Text>
          </TouchableOpacity>
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
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIcon: {
    width: RFValue(130),
    height: RFValue(130),
    resizeMode: 'contain',
  },
  appTitleText: {
    color: 'white',
    textAlign: 'center',
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
  },
  screenName: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
  },
  lowerContainer: {
    marginBottom: RFValue(40),
  },
  textInputBtn: {
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 5,
    marginVertical: 7,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  responsiveBtn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  responsiveButton: {
    borderRadius: 5,
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 25,
    alignSelf: 'center',
    backgroundColor: '#FED401',
  },
  responsiveButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: RFValue(20),
    backgroundColor: 'white',
  },
  googleIcon: {
    width: RFValue(30),
    height: RFValue(30),
    resizeMode: 'contain',
  },
  googleText: {
    color: 'black',
    fontSize: RFValue(20),
    fontFamily: 'Bubblegum-Sans',
  },
});
