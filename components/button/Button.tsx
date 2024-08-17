import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { COLORS } from '@/assets/style/style.color';

interface ButtonProps {
    text: string;
    style?: object;
    onClick: () => void;
    disabled?: boolean;
}
const ThemedButton: React.FC<ButtonProps> = ({ text, style, onClick, disabled }) => {
    return (
        <Pressable onPress={onClick} style={[styles.button, style, disabled && styles.disabledButton]}
            disabled={disabled} >
            <Text style={styles.text}>{text}</Text>
        </Pressable>
    );
};
const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 5,
        backgroundColor: COLORS.jaune,
        alignSelf: 'center'
    },
    disabledButton: {
        opacity: 0.5, // Optionnel: styliser le bouton désactivé
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    }
});

export default ThemedButton;
