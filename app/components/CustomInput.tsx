import React from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TextInputProps,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

interface CustomInputProps extends TextInputProps {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    error?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
    label,
    icon,
    error,
    ...props
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View
                style={[
                    styles.inputContainer,
                    error ? styles.inputError : null,
                ]}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color={error ? COLORS.error : COLORS.textSecondary}
                    style={styles.icon}
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor={COLORS.textSecondary}
                    {...props}
                />
            </View>
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SIZES.medium,
        width: '100%',
    },
    label: {
        ...FONTS.medium,
        fontSize: SIZES.body2,
        color: COLORS.text,
        marginBottom: SIZES.base,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusMedium,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: SIZES.medium,
        height: 56,
        ...SHADOWS.small,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    icon: {
        marginRight: SIZES.small,
    },
    input: {
        flex: 1,
        ...FONTS.regular,
        fontSize: SIZES.body1,
        color: COLORS.text,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    },
    errorText: {
        ...FONTS.regular,
        fontSize: SIZES.caption,
        color: COLORS.error,
        marginTop: SIZES.base,
    },
}); 