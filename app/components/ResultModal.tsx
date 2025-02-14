import React from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { LoanSummary } from '../services/loanCalculator';

const { width } = Dimensions.get('window');

interface ResultModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (() => void) | null;
    result: LoanSummary;
    formatCurrency: (amount: number) => string;
}

export const ResultModal: React.FC<ResultModalProps> = ({
    visible,
    onClose,
    onSave,
    result,
    formatCurrency,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <BlurView intensity={20} tint="dark" style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Hesaplama Sonucu</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Aylık Taksit</Text>
                                <Text style={styles.summaryValue}>
                                    {formatCurrency(result.monthlyPayment)}
                                </Text>
                            </View>

                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Toplam Geri Ödeme</Text>
                                <Text style={styles.summaryValue}>
                                    {formatCurrency(result.totalPayment)}
                                </Text>
                            </View>

                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Toplam Faiz</Text>
                                <Text style={[styles.summaryValue, { color: COLORS.warning }]}>
                                    {formatCurrency(result.totalInterest)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.paymentsCard}>
                            <Text style={styles.paymentsTitle}>Ödeme Planı</Text>
                            {result.payments.map((payment, index) => (
                                <View key={index} style={styles.paymentItem}>
                                    <View style={styles.paymentHeader}>
                                        <Text style={styles.paymentMonth}>{payment.month}. Ay</Text>
                                        <Text style={styles.paymentAmount}>
                                            {formatCurrency(payment.payment)}
                                        </Text>
                                    </View>
                                    <View style={styles.paymentDetails}>
                                        <View style={styles.paymentDetail}>
                                            <Text style={styles.detailLabel}>Anapara</Text>
                                            <Text style={styles.detailValue}>
                                                {formatCurrency(payment.principal)}
                                            </Text>
                                        </View>
                                        <View style={styles.paymentDetail}>
                                            <Text style={styles.detailLabel}>Faiz</Text>
                                            <Text style={[styles.detailValue, { color: COLORS.warning }]}>
                                                {formatCurrency(payment.interest)}
                                            </Text>
                                        </View>
                                        <View style={styles.paymentDetail}>
                                            <Text style={styles.detailLabel}>Kalan</Text>
                                            <Text style={styles.detailValue}>
                                                {formatCurrency(payment.remainingBalance)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, styles.closeButton]}
                            onPress={onClose}
                        >
                            <Text style={[styles.buttonText, styles.closeButtonText]}>
                                Kapat
                            </Text>
                        </TouchableOpacity>
                        {onSave && (
                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={onSave}
                            >
                                <Text style={[styles.buttonText, styles.saveButtonText]}>
                                    Kaydet
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContainer: {
        width: width * 0.9,
        maxHeight: '80%',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusLarge,
        ...SHADOWS.large,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SIZES.medium,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        ...FONTS.bold,
        fontSize: SIZES.h2,
        color: COLORS.text,
    },
    closeButton: {
        padding: SIZES.small,
    },
    content: {
        padding: SIZES.medium,
    },
    summaryCard: {
        backgroundColor: COLORS.background,
        borderRadius: SIZES.radiusMedium,
        padding: SIZES.medium,
        marginBottom: SIZES.medium,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SIZES.small,
    },
    summaryLabel: {
        ...FONTS.medium,
        fontSize: SIZES.body2,
        color: COLORS.textSecondary,
    },
    summaryValue: {
        ...FONTS.bold,
        fontSize: SIZES.h3,
        color: COLORS.text,
    },
    paymentsCard: {
        backgroundColor: COLORS.background,
        borderRadius: SIZES.radiusMedium,
        padding: SIZES.medium,
    },
    paymentsTitle: {
        ...FONTS.bold,
        fontSize: SIZES.h3,
        color: COLORS.text,
        marginBottom: SIZES.medium,
    },
    paymentItem: {
        marginBottom: SIZES.medium,
        padding: SIZES.small,
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusSmall,
        ...SHADOWS.small,
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.small,
    },
    paymentMonth: {
        ...FONTS.bold,
        fontSize: SIZES.body1,
        color: COLORS.primary,
    },
    paymentAmount: {
        ...FONTS.bold,
        fontSize: SIZES.body1,
        color: COLORS.text,
    },
    paymentDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paymentDetail: {
        flex: 1,
        alignItems: 'center',
    },
    detailLabel: {
        ...FONTS.regular,
        fontSize: SIZES.caption,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    detailValue: {
        ...FONTS.medium,
        fontSize: SIZES.body2,
        color: COLORS.text,
    },
    footer: {
        flexDirection: 'row',
        padding: SIZES.medium,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    button: {
        flex: 1,
        height: 48,
        borderRadius: SIZES.radiusMedium,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: SIZES.small,
    },
    closeButton: {
        backgroundColor: COLORS.background,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
    },
    buttonText: {
        ...FONTS.medium,
        fontSize: SIZES.body2,
    },
    closeButtonText: {
        color: COLORS.text,
    },
    saveButtonText: {
        color: COLORS.surface,
    },
}); 