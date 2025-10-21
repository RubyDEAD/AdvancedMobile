// App.tsx
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import SignIn from './SignIn'
import SignUp from './SignUp'
import Profile from './Profile'
import Playlist from './Playlist'
import Settings from './Settings'
import AnimatedBackground from './components/AnimatedBackground'
import CameraActivity from './CameraActivity'
import PokemonList from './PokemonList'
const Stack = createStackNavigator()

export default function App() {
  return (
    // <Provider store={store}>
    //   <AnimatedBackground>
    //     <NavigationContainer>
    //       <Stack.Navigator screenOptions={{ headerShown: false }}>
    //         <Stack.Screen name="Settings" component={Settings} />
    //         <Stack.Screen name="Playlist" component={Playlist} />
    //         <Stack.Screen name="SignIn" component={SignIn} />
    //         <Stack.Screen name="SignUp" component={SignUp} />
    //         <Stack.Screen name="Profile" component={Profile} />
    //       </Stack.Navigator>
    //     </NavigationContainer>
    //   </AnimatedBackground>
    // </Provider>
    <PokemonList />
  )
}
