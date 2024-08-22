import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/assets/style/style.color';

interface DatePickerProps {
    label: string;
    value: Date;
    onChange: (date: Date) => void;
    error?: string;
}

const ThemedDatePicker: React.FC<DatePickerProps> = ({ label, value, onChange, error }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const showDatePickerHandler = () => {
        setShowDatePicker(true);
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day} / ${month} / ${year}`;
    };

    return (
        <View style={styles.datePickerContainer}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                onPress={showDatePickerHandler}
                style={[
                    styles.dateInput,
                    error ? styles.dateInputError : null
                ]}
            >
                <Text style={[styles.textColor, styles.textfontSize]}>
                    {formatDate(value)}
                </Text>
                <Icon name="calendar-outline" size={20} color={COLORS.bg1} style={styles.icon} />
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={value}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    datePickerContainer: {
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
    },
    label: {
        color: COLORS.bg1,
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.bg1,
        padding: 10,
        borderRadius: 5,
    },
    dateInputError: {
        borderColor: 'red',
    },
    textColor: {
        color: COLORS.bg1,
    },
    textfontSize: {
        fontSize: 16,
    },
    icon: {
        marginLeft: 10,
    },
});

export default ThemedDatePicker;
