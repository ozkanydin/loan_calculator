import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl,
    Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HistoryStorage, HistoryItem } from '../services/historyStorage';
import { ResultModal } from '../components/ResultModal';
import { formatCurrency } from '../services/loanCalculator';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { Swipeable } from 'react-native-gesture-handler';

export default function HistoryScreen() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadHistory = useCallback(async () => {
        try {
            const items = await HistoryStorage.getHistory();
            setHistory(items);
        } catch (error) {
            console.error('Geçmiş yüklenirken hata oluştu:', error);
            Alert.alert('Hata', 'Geçmiş yüklenirken bir hata oluştu.');
        }
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    }, [loadHistory]);

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [loadHistory])
    );

    const handleDeleteItem = useCallback(async (id: string) => {
        Alert.alert(
            'Hesaplamayı Sil',
            'Bu hesaplama kaydını silmek istediğinize emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await HistoryStorage.deleteHistoryItem(id);
                            setHistory(prev => prev.filter(item => item.id !== id));
                        } catch (error) {
                            Alert.alert('Hata', 'Hesaplama silinirken bir hata oluştu.');
                        }
                    },
                },
            ]
        );
    }, []);

    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, []);

    const renderRightActions = useCallback((id: string) => {
        return (
            <TouchableOpacity
                style={styles.deleteAction}
                onPress={() => handleDeleteItem(id)}
            >
                <Ionicons name="trash-outline" size={24} color={COLORS.surface} />
                <Text style={styles.deleteActionText}>Sil</Text>
            </TouchableOpacity>
        );
    }, [handleDeleteItem]);

    const renderItem = useCallback(({ item }: { item: HistoryItem }) => (
        <Swipeable
            renderRightActions={() => renderRightActions(item.id)}
            overshootRight={false}
        >
            <TouchableOpacity
                style={styles.historyItem}
                onPress={() => {
                    setSelectedItem(item);
                    setShowModal(true);
                }}
            >
                <BlurView intensity={80} tint="light" style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
                        <View style={styles.detailIndicator}>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
                        </View>
                    </View>

                    <View style={styles.itemDetails}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Faiz Oranı:</Text>
                            <Text style={styles.detailValue}>%{item.interestRate}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Vade:</Text>
                            <Text style={styles.detailValue}>{item.term} Ay</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Aylık Taksit:</Text>
                            <Text style={styles.detailValue}>
                                {formatCurrency(item.result.monthlyPayment)}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.date}>{formatDate(item.date)}</Text>
                </BlurView>
            </TouchableOpacity>
        </Swipeable>
    ), [formatDate, renderRightActions]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <LinearGradient
                colors={[COLORS.background, '#EFF6FF', '#DBEAFE']}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Geçmiş Hesaplamalar</Text>
                </View>

                {history.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="calculator-outline"
                            size={64}
                            color={COLORS.textSecondary}
                        />
                        <Text style={styles.emptyText}>
                            Henüz hesaplama geçmişiniz bulunmuyor
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={history}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={COLORS.primary}
                            />
                        }
                    />
                )}

                {selectedItem && (
                    <ResultModal
                        visible={showModal}
                        onClose={() => {
                            setShowModal(false);
                            setSelectedItem(null);
                        }}
                        onSave={null}
                        result={selectedItem.result}
                        formatCurrency={formatCurrency}
                    />
                )}
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    gradient: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.medium,
    },
    title: {
        ...FONTS.bold,
        fontSize: SIZES.h1,
        color: COLORS.text,
    },
    list: {
        padding: SIZES.medium,
        paddingBottom: SIZES.xxlarge,
    },
    historyItem: {
        marginBottom: SIZES.medium,
        borderRadius: SIZES.radiusLarge,
        overflow: 'hidden',
    },
    itemContent: {
        padding: SIZES.medium,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.small,
    },
    amount: {
        ...FONTS.bold,
        fontSize: SIZES.h2,
        color: COLORS.text,
    },
    detailIndicator: {
        padding: SIZES.small,
    },
    itemDetails: {
        marginBottom: SIZES.small,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.base,
    },
    detailLabel: {
        ...FONTS.medium,
        fontSize: SIZES.body2,
        color: COLORS.textSecondary,
    },
    detailValue: {
        ...FONTS.bold,
        fontSize: SIZES.body2,
        color: COLORS.text,
    },
    date: {
        ...FONTS.regular,
        fontSize: SIZES.caption,
        color: COLORS.textSecondary,
        textAlign: 'right',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.xlarge,
    },
    emptyText: {
        ...FONTS.medium,
        fontSize: SIZES.body1,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: SIZES.medium,
    },
    deleteAction: {
        backgroundColor: COLORS.error,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
        borderTopRightRadius: SIZES.radiusLarge,
        borderBottomRightRadius: SIZES.radiusLarge,
    },
    deleteActionText: {
        ...FONTS.medium,
        fontSize: SIZES.caption,
        color: COLORS.surface,
        marginTop: 4,
    },
}); 