import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import GenderSelector from '@/components/input/InputGenreSelector'; // Assurez-vous d'importer correctement le composant
import { COLORS } from '@/assets/style/style.color';

const PreferenceDisplay: React.FC = () => {
    const [selectedGender, setSelectedGender] = useState<'homme' | 'femme' | null>(null);
    const [isOptionsVisible, setIsOptionsVisible] = useState(true);

    const handleSelectGender = (gender: 'homme' | 'femme') => {
        setSelectedGender(gender);
        setIsOptionsVisible(false); // Masquer les options après sélection
    };

    const handleToggleOptions = () => {
        setIsOptionsVisible(!isOptionsVisible);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.toggleButton}
                onPress={handleToggleOptions}
            >
                <Text style={styles.toggleButtonText}>
                    Je veux rencontrer
                </Text>
            </TouchableOpacity>
            {isOptionsVisible && (
                <GenderSelector
                    selectedGender={selectedGender || 'homme'} // Par défaut, vous pouvez utiliser 'homme'
                    onSelectGender={handleSelectGender}
                />
            )}
            {!isOptionsVisible && selectedGender && (
                <View style={styles.selectedGenderContainer}>
                    <Text style={styles.selectedGenderText}>
                        Vous avez sélectionné : {selectedGender}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    toggleButton: {
        padding: 10,
        backgroundColor: COLORS.lightGray,
        alignItems: 'center',
        borderRadius: 5,
    },
    toggleButtonText: {
        color: COLORS.darkBlue,
        fontSize: 16,
    },
    selectedGenderContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: COLORS.lightGray,
        borderRadius: 5,
    },
    selectedGenderText: {
        fontSize: 16,
        color: COLORS.darkBlue,
    },
});

export default PreferenceDisplay;
