import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoanSummary } from './loanCalculator';

const HISTORY_KEY = 'loan_calculator_history';

export interface HistoryItem {
    id: string;
    date: string;
    amount: number;
    interestRate: number;
    term: number;
    result: LoanSummary;
}

export const HistoryStorage = {
    async saveCalculation(
        amount: number,
        interestRate: number,
        term: number,
        result: LoanSummary
    ): Promise<void> {
        try {
            const history = await this.getHistory();
            const newItem: HistoryItem = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                amount,
                interestRate,
                term,
                result,
            };

            const updatedHistory = [newItem, ...history].slice(0, 50);
            await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        } catch (error) {
            console.error('Hesaplama kaydedilirken hata oluştu:', error);
            throw error;
        }
    },

    async getHistory(): Promise<HistoryItem[]> {
        try {
            const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
            return historyJson ? JSON.parse(historyJson) : [];
        } catch (error) {
            console.error('Geçmiş yüklenirken hata oluştu:', error);
            return [];
        }
    },

    async clearHistory(): Promise<void> {
        try {
            await AsyncStorage.removeItem(HISTORY_KEY);
        } catch (error) {
            console.error('Geçmiş temizlenirken hata oluştu:', error);
            throw error;
        }
    },

    async deleteHistoryItem(id: string): Promise<void> {
        try {
            const history = await this.getHistory();
            const updatedHistory = history.filter(item => item.id !== id);
            await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        } catch (error) {
            console.error('Geçmiş öğesi silinirken hata oluştu:', error);
            throw error;
        }
    },
}; 