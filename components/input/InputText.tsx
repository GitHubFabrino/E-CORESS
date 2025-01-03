import { COLORS } from '@/assets/style/style.color';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type InputProps = {
    label?: string;
    value: string;
    placeholder?: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    isPassword?: boolean;
    style?: object;
    error?: string;
    styleforme?: object;
};

const Input: React.FC<InputProps> = ({ error, label, value, placeholder, styleforme, onChangeText, secureTextEntry, isPassword = false, style }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={[styles.labelInput, style]}>{label}</Text>}
            <View style={[
                styles.inputContainer,
                error ? styles.inputError : null
                , style]}>
                <TextInput
                    style={[styles.input, styleforme]}
                    placeholder={placeholder}
                    secureTextEntry={isPassword && !isPasswordVisible}
                    value={value}
                    onChangeText={onChangeText}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                {isPassword && (
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                        <Icon
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={24}
                            color={COLORS.bg1}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 6,
    },
    labelInput: {
        fontSize: 16,
        color: COLORS.bg1,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginTop: 5,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
});

export default Input;
