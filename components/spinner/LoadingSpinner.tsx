import React from 'react';
import { StyleSheet, View, ActivityIndicator, Modal, Text } from 'react-native';
import { COLORS } from '@/assets/style/style.color';

type LoadingSpinnerProps = {
    isVisible: boolean;
    text?: string;
    size?: number | 'small' | 'large'; // Ajout d'une propriété pour la taille
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isVisible, text, size }) => { // Taille par défaut de 100
    return (
        <Modal transparent={true} animationType="none" visible={isVisible}>
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator size={size} color={COLORS.jaune} />
                    <Text style={styles.loadingText}>{text}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    activityIndicatorWrapper: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 30,
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default LoadingSpinner;
