import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SliderInput } from '../components/SliderInput';
import { ResultModal } from '../components/ResultModal';
import { calculateLoan, formatCurrency } from '../services/loanCalculator';
import { HistoryStorage } from '../services/historyStorage';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const formatAmount = (value: string) => {
    const number = value.replace(/[^0-9]/g, '');
    if (number === '') return '';
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default function HomeScreen() {
    const [amount, setAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [term, setTerm] = useState('');
    const [result, setResult] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({
        amount: '',
        interestRate: '',
        term: '',
    });

    const resetForm = useCallback(() => {
        setAmount('');
        setInterestRate('');
        setTerm('');
        setResult(null);
        setErrors({
            amount: '',
            interestRate: '',
            term: '',
        });
    }, []);

    useFocusEffect(
        useCallback(() => {
            return () => {
                // Ekrandan çıkıldığında yapılacak temizlik işlemleri
            };
        }, [])
    );

    const validateInputs = useCallback(() => {
        const newErrors = {
            amount: '',
            interestRate: '',
            term: '',
        };

        const amountValue = Number(amount.replace(/\./g, ''));
        if (!amount) newErrors.amount = 'Kredi tutarı gereklidir';
        else if (isNaN(amountValue) || amountValue < 1000)
            newErrors.amount = 'En az 1.000₺ girmelisiniz';
        else if (amountValue > 10000000)
            newErrors.amount = 'En fazla 10.000.000₺ girebilirsiniz';

        if (!interestRate) newErrors.interestRate = 'Faiz oranı gereklidir';
        else if (isNaN(Number(interestRate)) || Number(interestRate) <= 0)
            newErrors.interestRate = 'Geçerli bir faiz oranı girin';
        else if (Number(interestRate) > 100)
            newErrors.interestRate = 'Faiz oranı 100\'den büyük olamaz';

        if (!term) newErrors.term = 'Vade süresi gereklidir';
        else if (isNaN(Number(term)) || Number(term) <= 0 || !Number.isInteger(Number(term)))
            newErrors.term = 'Geçerli bir vade süresi girin';
        else if (Number(term) > 360)
            newErrors.term = 'Vade en fazla 360 ay olabilir';

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    }, [amount, interestRate, term]);

    const handleCalculate = useCallback(() => {
        if (!validateInputs()) return;

        try {
            const amountValue = Number(amount.replace(/\./g, ''));
            const interestRateValue = Number(interestRate);
            const termValue = Number(term);

            const loanResult = calculateLoan(
                amountValue,
                interestRateValue,
                termValue
            );

            setResult(loanResult);
            setShowModal(true);
        } catch (error) {
            console.error('Hesaplama sırasında hata:', error);
            Alert.alert('Hata', 'Hesaplama sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }, [amount, interestRate, term, validateInputs]);

    const handleSave = useCallback(async () => {
        try {
            const amountValue = Number(amount.replace(/\./g, ''));
            const interestRateValue = Number(interestRate);
            const termValue = Number(term);

            await HistoryStorage.saveCalculation(
                amountValue,
                interestRateValue,
                termValue,
                result
            );
            Alert.alert('Başarılı', 'Hesaplama sonuçları kaydedildi.');
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Kaydetme sırasında hata:', error);
            Alert.alert('Hata', 'Hesaplama kaydedilirken bir hata oluştu.');
        }
    }, [amount, interestRate, term, result, resetForm]);

    const handleModalClose = useCallback(() => {
        setShowModal(false);
        resetForm();
    }, [resetForm]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={Platform.OS === 'ios' ? 120 : 140}
                keyboardShouldPersistTaps="handled"
                bounces={false}
            >
                <LinearGradient
                    colors={[COLORS.background, '#EFF6FF', '#DBEAFE']}
                    style={styles.gradient}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Kredi Hesaplama</Text>
                        <Text style={styles.subtitle}>
                            Kredi tutarı, faiz oranı ve vade süresini girerek ödeme planınızı hesaplayın
                        </Text>
                    </View>

                    <BlurView intensity={60} tint="light" style={styles.formContainer}>
                        <SliderInput
                            label="Kredi Tutarı"
                            icon="cash-outline"
                            value={amount}
                            onChangeText={setAmount}
                            error={errors.amount}
                            prefix="₺ "
                            min={1000}
                            max={10000000}
                            step={1000}
                            formatValue={formatAmount}
                        />

                        <SliderInput
                            label="Yıllık Faiz Oranı"
                            icon="trending-up-outline"
                            value={interestRate}
                            onChangeText={setInterestRate}
                            error={errors.interestRate}
                            suffix=" %"
                            min={0.1}
                            max={100}
                            step={0.1}
                        />

                        <SliderInput
                            label="Vade (Ay)"
                            icon="calendar-outline"
                            value={term}
                            onChangeText={setTerm}
                            error={errors.term}
                            suffix=" Ay"
                            min={1}
                            max={360}
                            step={1}
                        />

                        <TouchableOpacity
                            style={styles.calculateButton}
                            onPress={handleCalculate}
                        >
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.buttonText}>Hesapla</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </BlurView>

                    {result && (
                        <ResultModal
                            visible={showModal}
                            onClose={handleModalClose}
                            onSave={handleSave}
                            result={result}
                            formatCurrency={formatCurrency}
                        />
                    )}
                </LinearGradient>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    gradient: {
        flex: 1,
        paddingHorizontal: SIZES.medium,
        paddingTop: SIZES.medium,
        paddingBottom: SIZES.large,
    },
    header: {
        marginBottom: SIZES.xlarge,
    },
    title: {
        ...FONTS.bold,
        fontSize: SIZES.h1,
        color: COLORS.text,
        marginBottom: SIZES.small,
    },
    subtitle: {
        ...FONTS.regular,
        fontSize: SIZES.body2,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    formContainer: {
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radiusLarge,
        padding: SIZES.large,
        ...SHADOWS.medium,
    },
    calculateButton: {
        height: 56,
        borderRadius: SIZES.radiusMedium,
        overflow: 'hidden',
        marginTop: SIZES.medium,
    },
    gradientButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        ...FONTS.bold,
        fontSize: SIZES.body1,
        color: COLORS.surface,
    },
}); 