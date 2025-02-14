import { Platform } from "react-native";

export const COLORS = {
    primary: '#1E3A8A', // Koyu mavi
    secondary: '#3B82F6', // Parlak mavi
    accent: '#0EA5E9', // Açık mavi
    success: '#10B981', // Yeşil
    warning: '#F59E0B', // Turuncu
    error: '#EF4444', // Kırmızı
    background: '#F8FAFC', // Açık gri
    surface: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#CBD5E1',
    card: 'rgba(255, 255, 255, 0.8)',
    shadow: '#000000',
};

export const FONTS = {
    regular: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        fontWeight: '400',
    },
    medium: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        fontWeight: '500',
    },
    bold: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        fontWeight: '700',
    },
};

export const SIZES = {
    // Genel boyutlar
    base: 8,
    small: 12,
    medium: 16,
    large: 24,
    xlarge: 32,
    xxlarge: 40,

    // Font boyutları
    h1: 32,
    h2: 24,
    h3: 20,
    body1: 16,
    body2: 14,
    caption: 12,

    // Border radius
    radiusSmall: 8,
    radiusMedium: 16,
    radiusLarge: 24,
    radiusXLarge: 32,
};

export const SHADOWS = {
    small: {
        ...Platform.select({
            ios: {
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    medium: {
        ...Platform.select({
            ios: {
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    large: {
        ...Platform.select({
            ios: {
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
            },
            android: {
                elevation: 6,
            },
        }),
    },
}; 