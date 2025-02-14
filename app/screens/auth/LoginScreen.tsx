import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Dimensions,
    ActivityIndicator,
    Platform,
    Keyboard,
    Linking,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SecureStorage } from '../../services/secureStorage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');

// Kurumsal renkler
const COLORS = {
    primary: '#1E3A8A', // Koyu mavi
    secondary: '#3B82F6', // Parlak mavi
    accent: '#0EA5E9', // Açık mavi
    background: '#F8FAFC', // Açık gri
    surface: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    error: '#EF4444',
    border: '#CBD5E1',
};

type RootStackParamList = {
    Login: undefined;
    MainApp: undefined;
};

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const PIN_LENGTH = 4;

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const [pin, setPin] = useState('');
    const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPin, setShowPin] = useState(false);

    const pinInputRef = useRef<TextInput>(null);

    useFocusEffect(
        useCallback(() => {
            checkFirstTime();
            setTimeout(() => pinInputRef.current?.focus(), 500);
        }, [])
    );

    const checkFirstTime = async () => {
        try {
            const firstTime = await SecureStorage.isFirstTime();
            setIsFirstTime(firstTime);
            setIsLoading(false);
        } catch (error) {
            console.error('Error checking first time:', error);
            setIsLoading(false);
            Alert.alert('Hata', 'Sistem başlatılırken bir hata oluştu. Lütfen uygulamayı yeniden başlatın.');
        }
    };

    const handlePinChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        if (numericValue.length <= PIN_LENGTH) {
            setPin(numericValue);
            setError('');
            if (numericValue.length === PIN_LENGTH) {
                Keyboard.dismiss();
            }
        }
    };

    const handleLogin = async () => {
        try {
            setError('');
            if (isFirstTime) {
                if (pin.length !== PIN_LENGTH) {
                    setError('PIN kodunuz 4 haneli olmalıdır');
                    return;
                }
                await SecureStorage.savePassword(pin);
                await SecureStorage.setNotFirstTime();
                Alert.alert('Başarılı', 'PIN kodunuz başarıyla oluşturuldu.');
                navigation.replace('MainApp');
            } else {
                const savedPin = await SecureStorage.getPassword();
                if (pin === savedPin) {
                    navigation.replace('MainApp');
                } else {
                    setError('Hatalı PIN kodu');
                    setPin('');
                    pinInputRef.current?.focus();
                }
            }
        } catch (error) {
            console.error('Error in login:', error);
            Alert.alert('Hata', 'İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.');
            setPin('');
            pinInputRef.current?.focus();
        }
    };

    const handleForgotPin = () => {
        Alert.alert(
            'PIN Sıfırlama',
            'PIN kodunuzu sıfırlamak için lütfen müşteri hizmetleri ile iletişime geçin.',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Müşteri Hizmetlerini Ara',
                    onPress: () => {
                        Linking.openURL('tel:+908508888888');
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
        >
            <LinearGradient
                colors={[COLORS.background, '#EFF6FF', '#DBEAFE']}
                style={styles.container}
            >
                <View style={styles.mainContent}>
                    <BlurView intensity={60} tint="light" style={styles.blurContainer}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoBackground}>
                                <Ionicons name="calculator" size={40} color={COLORS.primary} />
                            </View>
                        </View>

                        <View style={styles.headerContainer}>
                            <Text style={styles.title}>Kredi Hesaplama</Text>
                            <Text style={styles.subtitle}>
                                {isFirstTime
                                    ? '4 haneli güvenlik PIN kodunuzu belirleyin'
                                    : 'PIN kodunuzu girin'}
                            </Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.pinInputWrapper}>
                                <TextInput
                                    ref={pinInputRef}
                                    style={styles.pinInput}
                                    value={pin}
                                    onChangeText={handlePinChange}
                                    keyboardType="numeric"
                                    maxLength={PIN_LENGTH}
                                    secureTextEntry={!showPin}
                                    placeholder="PIN Kodu"
                                    placeholderTextColor={COLORS.textSecondary}
                                />
                                <TouchableOpacity
                                    style={styles.visibilityButton}
                                    onPress={() => setShowPin(!showPin)}
                                >
                                    <Ionicons
                                        name={showPin ? 'eye-off-outline' : 'eye-outline'}
                                        size={24}
                                        color={COLORS.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>

                            {error ? (
                                <View style={styles.errorContainer}>
                                    <Ionicons name="alert-circle" size={20} color={COLORS.error} />
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    pin.length !== PIN_LENGTH && styles.buttonDisabled
                                ]}
                                onPress={handleLogin}
                                disabled={pin.length !== PIN_LENGTH}
                            >
                                <LinearGradient
                                    colors={[COLORS.primary, COLORS.secondary]}
                                    start={{ x: 0, y:   0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradient}
                                >
                                    <Text style={styles.buttonText}>
                                        {isFirstTime ? 'PIN Oluştur' : 'Giriş Yap'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>


                        </View>

                        <View style={styles.securityNote}>
                            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.textSecondary} />
                            <Text style={styles.securityNoteText}>
                                Güvenli ve şifreli bağlantı
                            </Text>
                        </View>
                    </BlurView>
                </View>
            </LinearGradient>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        height: height,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    blurContainer: {
        width: width * 0.9,
        padding: 24,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logoBackground: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(219, 234, 254, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 17,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
    },
    pinInputWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    pinInput: {
        flex: 1,
        fontSize: 20,
        color: COLORS.text,
        letterSpacing: 2,
        paddingVertical: 12,
    },
    visibilityButton: {
        padding: 8,
    },
    button: {
        height: 56,
        borderRadius: 16,
        marginTop: 24,
        overflow: 'hidden',
        width: '100%',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    gradient: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.surface,
        fontSize: 17,
        fontWeight: '600',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 14,
        marginLeft: 8,
        textAlign: 'center',
    },
    forgotPassword: {
        marginTop: 16,
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: COLORS.secondary,
        fontSize: 15,
        fontWeight: '500',
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    securityNoteText: {
        marginLeft: 8,
        color: COLORS.textSecondary,
        fontSize: 14,
    },
}); 