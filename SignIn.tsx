// SignIn.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  Button,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

import Logo from './assets/Spotify.png';
import FLogo from './assets/Facebook.png';
import GLogo from './assets/gmail-logo.png';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SignIn() {
  const navigation = useNavigation<Nav>();

  const FacebookPress = () => Alert.alert('Facebook button pressed');
  const GmailPress = () => Alert.alert('Gmail button pressed');

  return (
    <SafeAreaView style={styles.safe}>
      <Image source={Logo} style={styles.head_logo} accessibilityLabel="Spotify Logo" />
      <Text style={styles.text_title}>Spotify</Text>

      <TextInput placeholder="Username" placeholderTextColor="gray" style={styles.input} />
      <TextInput
        placeholder="Password"
        placeholderTextColor="gray"
        style={styles.input}
        secureTextEntry
      />

      <View style={styles.button}>
        <Button title="Sign In" color="white" onPress={() => navigation.navigate('Profile')} />
      </View>

      <Text style={styles.connect_text}>Be Connect With Using</Text>

      <View style={styles.social_container}>
        <TouchableOpacity onPress={FacebookPress}>
          <Image source={FLogo} style={styles.face_logo} accessibilityLabel="Sign In with Facebook" />
        </TouchableOpacity>
        <TouchableOpacity onPress={GmailPress}>
          <Image source={GLogo} style={styles.gmail_logo} accessibilityLabel="Sign In with Gmail" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signup_text}>Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'rgb(16, 16, 16)',
  },
  head_logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  text_title: {
    alignSelf: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 50,
  },
  input: {
    backgroundColor: 'rgb(32, 32, 32)',
    color: 'white',
    borderRadius: 10,
    padding: 10,
    marginTop: 30,
    marginHorizontal: 50,
    fontSize: 18,
    borderColor: 'rgba(126, 126, 126, 0.2)',
    borderWidth: 1,
  },
  button: {
    backgroundColor: 'rgb(63, 194, 78)',
    alignContent: 'center',
    padding: 3.5,
    marginHorizontal: 60,
    marginTop: 40,
    borderWidth: 0.5,
    borderRadius: 30,
    borderColor: 'gray',
  },
  connect_text: {
    color: 'rgb(63, 194, 78)',
    alignSelf: 'center',
    marginTop: 20,
  },
  social_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  face_logo: {
    width: 40,
    height: 40,
    marginHorizontal: 20,
  },
  gmail_logo: {
    width: 40,
    height: 40,
    marginHorizontal: 20,
  },
  signup_text: {
    color: 'rgb(63, 194, 78)',
    alignSelf: 'center',
    marginTop: 50,
  },
});
