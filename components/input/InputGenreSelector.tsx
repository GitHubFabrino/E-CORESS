import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/assets/style/style.color';
import { translations } from '@/service/translate';

interface GenderSelectorProps {
    selectedGender: 'homme' | 'femme' | null;
    onSelectGender: (gender: 'homme' | 'femme') => void;
    lang: 'FR' | 'EN';
    error?: string;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ selectedGender, onSelectGender, error, lang }) => {
    const t = translations[lang];
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{t.genderLabel1}</Text>
            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={[styles.card]}
                    onPress={() => onSelectGender('homme')}
                >
                    <View style={styles.optionContent}>
                        <Text style={styles.optionText}>{t.male}</Text>
                        <View style={[styles.radioCircle, selectedGender === 'homme' && styles.selectedRadioCircle]}>
                            {selectedGender === 'homme' && <View style={styles.selectedRadio} />}
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.card]}
                    onPress={() => onSelectGender('femme')}
                >
                    <View style={styles.optionContent}>
                        <Text style={styles.optionText}>{t.femelle}</Text>
                        <View style={[styles.radioCircle, selectedGender === 'femme' && styles.selectedRadioCircle]}>
                            {selectedGender === 'femme' && <View style={styles.selectedRadio} />}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    label: {
        color: COLORS.bg1,
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    optionsContainer: {
        flexDirection: 'column',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: COLORS.lightGray,
        marginBottom: 10,
        elevation: 3, // Ombre pour Android
        shadowColor: '#000', // Ombre pour iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    optionText: {
        color: COLORS.bg1,
        fontSize: 16,
        flex: 1,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.bg1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRadioCircle: {
        borderColor: COLORS.bg1,
    },
    selectedRadio: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.bg1,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
    },
});

export default GenderSelector;
