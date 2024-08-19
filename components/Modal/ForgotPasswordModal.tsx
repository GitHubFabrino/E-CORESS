import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importer l'icône
import { COLORS } from '@/assets/style/style.color';

interface ForgotPasswordModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (email: string) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ visible, onClose, onSubmit }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("L'email doit être valide");
            return;
        }
        setError('');
        onSubmit(email);
        setEmail('');
    };

    return (
        <Modal
            transparent
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <Icon name="close" size={24} color={COLORS.bg1} />
                    </Pressable>
                    <Text style={styles.modalTitle}>Récupérer votre mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Votre email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <Pressable onPress={handleSubmit} style={styles.button}>
                        <Text style={styles.buttonText}>Envoyer</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end', // Positionner la modale en bas de l'écran
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '100%', // Utiliser toute la largeur de l'écran
        padding: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 30, // Coins arrondis uniquement en haut
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 20,
        zIndex: 1, // S'assurer que le bouton est au-dessus des autres éléments
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: COLORS.bg1,
    },
    input: {
        height: 45,
        borderColor: COLORS.bg1,
        borderWidth: 1,
        borderRadius: 5,
        width: '80%',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    button: {
        backgroundColor: COLORS.jaune,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginTop: 10, // Ajouter un peu d'espace au-dessus du bouton
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    },
});

export default ForgotPasswordModal;
