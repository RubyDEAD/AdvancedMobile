import { View, StyleSheet, Button, Text, Image, SafeAreaView, ScrollView, TextInput, Alert, TouchableOpacity} from 'react-native';
import Logo from './assets/Spotify.png';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

export default function SignUp(){

    return(
        <SafeAreaView style={styles.safe}>
            <Image source={Logo} style={styles.head_logo} alt='Spotify Logo'></Image>
                <Text style={styles.text_title}>Spotify</Text>
                <Text style={styles.text_label}>Enter Username:</Text>          
                <TextInput placeholder='Username' style={styles.input}></TextInput>
                <Text style={styles.text_label}>Enter Email:</Text>   
                <TextInput placeholder='Email' style={styles.input}></TextInput>
                <Text style={styles.text_label}>Enter Password:</Text>   
                <TextInput placeholder='Password' style={styles.input} secureTextEntry={true}></TextInput>
            <View style={styles.button}>
                    <Button title='Sign Up'
                    color='white'
                    onPress={SignUp}
                    ></Button>
            </View>
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
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20,
    },
    text_label: {
        color: 'white',
        fontSize: 15,
        marginLeft: 30,
        marginTop: 20,
    },
    input: {
        height: 50,
        width: 350,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'rgb(32, 32, 32)',
        color: 'white',
        paddingHorizontal: 5,
        marginVertical: 10,
        alignSelf: 'center',
    },
    button: {
        backgroundColor: 'rgb(63, 194, 78)',
        borderRadius: 10,
        width: 350,
        height: 50,
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
});