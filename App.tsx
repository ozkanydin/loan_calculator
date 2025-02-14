import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from './app/constants/theme';

// Screens
import LoginScreen from './app/screens/auth/LoginScreen';
import HomeScreen from './app/screens/HomeScreen';
import HistoryScreen from './app/screens/HistoryScreen';

type RootStackParamList = {
    Login: undefined;
    MainApp: undefined;
};

type TabParamList = {
    Home: undefined;
    History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName: keyof typeof Ionicons.glyphMap = 'home';

                        if (route.name === 'Home') {
                            iconName = focused ? 'calculator' : 'calculator-outline';
                        } else if (route.name === 'History') {
                            iconName = focused ? 'time' : 'time-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarInactiveTintColor: COLORS.textSecondary,
                    tabBarStyle: {
                        backgroundColor: COLORS.surface,
                        borderTopWidth: 1,
                        borderTopColor: COLORS.border,
                        height: Platform.OS === 'ios' ? 85 : 60,
                        paddingBottom: Platform.OS === 'ios' ? 30 : 8,
                        paddingTop: 8,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
                        fontWeight: '500',
                    },
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Hesaplama' }}
                />
                <Tab.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{ title: 'Geçmiş' }}
                />
            </Tab.Navigator>
        </View>
    );
}

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <StatusBar style="dark" />
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="MainApp" component={TabNavigator} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
} 