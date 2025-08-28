import React, { useState } from 'react';
import { View, StyleSheet, Button, Text, Image, SafeAreaView, ScrollView } from 'react-native';
import TshirtWhite from './assets/tshirtwhite.png';
import TshirtBlack from './assets/tshirtblack.png';

export default function ComponentShowcase() {
  const [color, setColor] = useState<'white' | 'black'>('white');
  const imageSource = color === 'white' ? TshirtWhite : TshirtBlack;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.textTitle}>Rale.Co</Text>

        <View style={styles.container}>
          <Image source={imageSource} style={styles.product} />

          <View style={styles.actions}>
            <View style={styles.button}>
              <Button title="White" onPress={() => setColor('white')} />
            </View>
            <View style={styles.button}>
              <Button title="Black" onPress={() => setColor('black')} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.aboutText}>
            Rale.Co is a streetwear brand that combines comfort and style. Our mission is to provide high-quality, affordable clothing that allows you to express your individuality. Whether you're hitting the streets or just hanging out, Rale.Co has got you covered.
          </Text>
        <Text style={styles.sectionTitle}>Meet the Team</Text>
        <Text style={styles.aboutText}>
            Our team is a group of passionate designers, creators, and innovators dedicated to bringing you the best in streetwear fashion. From concept to creation, every member of Rale.Co works together to ensure quality, comfort, and style in every piece.
        </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  textTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderColor: 'black',
    backgroundColor: '#f5f5f5',
  },
  container: {
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  product: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    borderWidth: 0.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    minWidth: 120,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '600',
    alignSelf: 'stretch',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  aboutText: {
    textAlign: 'left',
    marginHorizontal: 8,
    alignSelf: 'stretch',
    lineHeight: 20,
    marginBottom: 24,
  },
});
