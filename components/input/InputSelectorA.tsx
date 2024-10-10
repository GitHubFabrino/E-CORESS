import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface InputSelectorProps {
    titre?: string;
    options: { value: string; label: string }[];
    selectedValue: string;
    onValueChange: (itemValue: string) => void;
    style?: object;
}

const InputSelectorA: React.FC<InputSelectorProps> = ({ style, titre, options, selectedValue, onValueChange }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{titre}</Text>
            <Picker
                selectedValue={selectedValue}
                style={[styles.picker, style]}
                onValueChange={(itemValue) => onValueChange(itemValue)}
            >
                {options.map((option, index) => (
                    <Picker.Item key={index} label={option.label} value={option.value} /> // Utilisez option.label et option.value ici
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 16,
    },
    picker: {
        height: 50,
        width: 250,
        borderWidth: 1,
        borderColor: 'gray',
    },
});

export default InputSelectorA;
