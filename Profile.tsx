import { View, StyleSheet, Button, Text, Image, SafeAreaView, ScrollView, TextInput, Alert, TouchableOpacity} from 'react-native';
import React from 'react';
import HeaderBar from './HeadBar';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
export default function Profile() {

    return(
        <SafeAreaView style={styles.safe}>
            <HeaderBar />
            <View style={styles.profile_pic}>
                <Text style={{textAlign: 'center', marginTop: 70}}>Put Image here</Text>
            </View>
            <Text style={styles.profile_name}>John Doe</Text>
            <Text style={styles.profile_info}>Email:</Text>
            <Text style={styles.info}>john@gmail.com</Text>
            <Text style={styles.profile_info}>Phone:</Text>
            <Text style={styles.info}>+1 234 567 8901</Text>
            <Text style={styles.profile_info}>Address:</Text>
            <Text style={styles.info}>123 Main St, City, Country</Text>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: 'rgb(16, 16, 16)'
    },

    profile_pic: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignSelf: 'center',
        marginTop: 50,
        marginBottom: 10,
        backgroundColor: 'white'
    },

    profile_name: {
        color: 'white',
        fontSize: 30,
        alignSelf: 'center',
        marginTop: 20,
        fontWeight: 'bold'
    },

    profile_info: {
        color: 'white',
        fontSize: 18,
        textAlign: 'left',
        marginTop: 10,
        marginLeft: 20,
    },

    info: {
        color: 'white',
        fontSize: 18,
        textAlign: 'left',
        marginTop: 10,
        marginLeft: 20,
        backgroundColor: 'rgb(32, 32, 32)',
        borderRadius: 10,
        borderColor: 'grey',
        borderWidth: 1,
        padding: 5,
        width: 350
    }


})