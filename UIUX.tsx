import { View, StyleSheet, Button, Text, Image, SafeAreaView, ScrollView, TextInput, Alert, TouchableOpacity} from 'react-native';
import React from 'react';
import Logo from './assets/Spotify.png';
import FLogo from './assets/Facebook.png';
import GLogo from './assets/gmail-logo.png';

export default function UIUX(){
    const FacbookPress = () => {
        Alert.alert('Facebook button pressed');
    };
    const GmailPress = () => {
        Alert.alert('Gmail button pressed');
    };
    const SignUp = () => {
        Alert.alert('Sign Up button pressed');
    }
    return(
        <SafeAreaView style={styles.safe}>
            <Image source={Logo} style={styles.head_logo} alt='Spotify Logo'></Image>
                <Text style={styles.text_title}>Spotify</Text>          
                <TextInput placeholder='Username' style={styles.input}></TextInput>
                <TextInput placeholder='Password' style={styles.input} secureTextEntry={true}></TextInput>
            <View style={styles.button}>
                    <Button title='Sign In'
                    color='white'
                    onPress={() => Alert.alert('Sign In button pressed')}
                    ></Button>
            </View>
            
            <Text style={{ color: 'rgb(63, 194, 78)', alignSelf: 'center', marginTop: 20,}}>Be Connect With Using</Text>
              <TouchableOpacity onPress={FacbookPress}>
                <Image source={FLogo} style={styles.face_logo} alt='Sign In with Facebook'>
                </Image>
              </TouchableOpacity>
              <TouchableOpacity onPress={GmailPress}>
                <Image source={GLogo} style={styles.gmail_logo} alt='Sign In with Gmail'>
                </Image>
              </TouchableOpacity>
             <TouchableOpacity onPress={SignUp}>
            <Text style={{ color: 'rgb(63, 194, 78)', alignSelf: 'center', marginTop: 50, marginLeft: 200}}>Sign Up</Text>
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
        marginBottom: 50
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
        borderWidth: 1
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
        fontSize: 20,
    
    },

    face_logo: {
        width: 30,
        height: 30,
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 100, 
        marginRight: 100,
        alignSelf: 'center',
    },

    gmail_logo: {
        width: 30,
        height: 30,
        marginTop: -30,
        marginLeft: 150,
        backgroundColor: 'white',
        borderRadius: 1,
        alignSelf: 'center',
        marginRight: 100
    }

    

});
