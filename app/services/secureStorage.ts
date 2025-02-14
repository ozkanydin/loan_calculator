import * as SecureStore from 'expo-secure-store';

const STORAGE_KEYS = {
    PASSWORD: 'user_password',
    IS_FIRST_TIME: 'is_first_time',
    SECURITY_QUESTION: 'security_question',
    SECURITY_ANSWER: 'security_answer',
};

export const SecureStorage = {
    async clearAll(): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(STORAGE_KEYS.PASSWORD);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.IS_FIRST_TIME);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.SECURITY_QUESTION);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.SECURITY_ANSWER);
        } catch (error) {
            console.error('Error clearing storage:', error);
            throw error;
        }
    },

    async savePassword(password: string): Promise<void> {
        try {
            await SecureStore.setItemAsync(STORAGE_KEYS.PASSWORD, password);
        } catch (error) {
            console.error('Error saving password:', error);
            throw error;
        }
    },

    async getPassword(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(STORAGE_KEYS.PASSWORD);
        } catch (error) {
            console.error('Error getting password:', error);
            throw error;
        }
    },

    async isFirstTime(): Promise<boolean> {
        try {
            const password = await this.getPassword();
            const isFirstTimeValue = await SecureStore.getItemAsync(STORAGE_KEYS.IS_FIRST_TIME);

            // Eğer şifre yoksa veya ilk kullanım değeri yoksa, ilk kullanımdır
            return !password || isFirstTimeValue === null;
        } catch (error) {
            console.error('Error checking first time:', error);
            return true;
        }
    },

    async setNotFirstTime(): Promise<void> {
        try {
            await SecureStore.setItemAsync(STORAGE_KEYS.IS_FIRST_TIME, 'false');
        } catch (error) {
            console.error('Error setting first time:', error);
            throw error;
        }
    },

    async setSecurityQuestion(question: string, answer: string): Promise<void> {
        try {
            await SecureStore.setItemAsync(STORAGE_KEYS.SECURITY_QUESTION, question);
            await SecureStore.setItemAsync(STORAGE_KEYS.SECURITY_ANSWER, answer);
        } catch (error) {
            console.error('Error setting security question:', error);
            throw error;
        }
    },

    async getSecurityQuestion(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(STORAGE_KEYS.SECURITY_QUESTION);
        } catch (error) {
            console.error('Error getting security question:', error);
            throw error;
        }
    },

    async verifySecurityAnswer(answer: string): Promise<boolean> {
        try {
            const savedAnswer = await SecureStore.getItemAsync(STORAGE_KEYS.SECURITY_ANSWER);
            return savedAnswer === answer;
        } catch (error) {
            console.error('Error verifying security answer:', error);
            throw error;
        }
    },
}; 