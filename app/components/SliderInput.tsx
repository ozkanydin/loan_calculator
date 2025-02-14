import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    ViewStyle,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

interface SliderInputProps {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    prefix?: string;
    suffix?: string;
    min: number;
    max: number;
    step?: number;
    containerStyle?: ViewStyle;
    formatValue?: (value: string) => string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
    label,
    icon,
    value,
    onChangeText,
    error,
    prefix = '',
    suffix = '',
    min,
    max,
    step = 1,
    containerStyle,
    formatValue,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [sliderValue, setSliderValue] = useState(Number(value) || min);

    useEffect(() => {
        const numValue = Number(value.replace(/[^0-9.]/g, ''));
        if (!isNaN(numValue)) {
            setSliderValue(numValue);
        }
    }, [value]);

    const handleTextChange = (text: string) => {
        const numericValue = text.replace(/[^0-9.]/g, '');
        if (numericValue === '' || !isNaN(Number(numericValue))) {
            const formattedValue = formatValue ? formatValue(numericValue) : numericValue;
            onChangeText(formattedValue);
        }
    };

    const handleSliderChange = (newValue: number) => {
        const roundedValue = Math.round(newValue / step) * step;
        const formattedValue = formatValue ? formatValue(roundedValue.toString()) : roundedValue.toString();
        onChangeText(formattedValue);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.label}>{label}</Text>
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                ]}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color={error ? COLORS.error : isFocused ? COLORS.primary : COLORS.textSecondary}
                    style={styles.icon}
                />
                <TextInput
                    style={styles.input}
                    value={prefix + value + suffix}
                    onChangeText={text => handleTextChange(text.replace(prefix, '').replace(suffix, ''))}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    keyboardType="numeric"
                    placeholderTextColor={COLORS.textSecondary}
                />
            </View>

            <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>{prefix + min + suffix}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={min}
                    maximumValue={max}
                    step={step}
                    value={sliderValue}
                    onValueChange={handleSliderChange}
                    minimumTrackTintColor={COLORS.primary}
                    maximumTrackTintColor={COLORS.border}
                    thumbTintColor={COLORS.primary}
                />
                <Text style={styles.sliderValue}>{prefix + max + suffix}</Text>
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
    inputFocused: {
        borderColor: COLORS.primary,
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
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SIZES.small,
        paddingHorizontal: SIZES.small,
    },
    slider: {
        flex: 1,
        marginHorizontal: SIZES.small,
        height: 40,
    },
    sliderValue: {
        ...FONTS.regular,
        fontSize: SIZES.caption,
        color: COLORS.textSecondary,
        minWidth: 60,
        textAlign: 'center',
    },
    errorText: {
        ...FONTS.regular,
        fontSize: SIZES.caption,
        color: COLORS.error,
        marginTop: SIZES.base,
    },
}); 