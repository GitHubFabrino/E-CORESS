import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import InputText from './InputText';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { COLORS } from '@/assets/style/style.color';

interface AboutSectionProps {
    titre: string,
    aproposValue: string;
    setAproposValue: (text: string) => void;
    modifApropos: boolean;
    setModifApropos: (value: boolean) => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ titre, aproposValue, setAproposValue, modifApropos, setModifApropos }) => {
    return (
        <ThemedView style={styles.containerInfo}>
            <View style={styles.itemTitre}>
                <ThemedText type='defaultSemiBold'>{titre}</ThemedText>
                {modifApropos ? (
                    <TouchableOpacity onPress={() => setModifApropos(!modifApropos)}>
                        <Icon name="create-outline" size={25} color={COLORS.darkBlue} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => setModifApropos(!modifApropos)}>
                        <Icon name="checkmark-done-outline" size={25} color={COLORS.green} />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.infoCard}>
                {modifApropos ? (
                    <ThemedText>Texte</ThemedText>
                ) : (
                    <InputText value={aproposValue} onChangeText={setAproposValue} />
                )}
            </View>
        </ThemedView>
    );
};

export default AboutSection;

const styles = StyleSheet.create({
    containerInfo: {
        width: '100%',
        marginBottom: 10
    },
    itemTitre: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        padding: 10,
        backgroundColor: COLORS.bg3
    },
    infoCard: {
        width: '100%',
        padding: 10
    },
})