import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import InputText from './InputText';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { COLORS } from '@/assets/style/style.color';
import InputSelector from './InputSelector';

interface AboutSectionProps {
    titre?: String;
    aproposValue: string;
    setAproposValue?: (text: string) => void;
    modifApropos?: boolean;
    setModifApropos?: (value: boolean) => void;
    isSelector?: boolean;
    options?: string[];
    see?: boolean,
    updateApropos?: () => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({
    titre,
    aproposValue,
    setAproposValue,
    modifApropos,
    setModifApropos,
    isSelector = false,
    options = [],
    see = true,
    updateApropos
}) => {

    const [modifier, setmodifier] = useState(true);
    const [dataInitial, setdataInitial] = useState(aproposValue);  // Initialize with aproposValue
    const [newData, setnewData] = useState('');

    useEffect(() => {
        // If aproposValue changes externally, update dataInitial to reflect the changes
        setdataInitial(aproposValue);
    }, [aproposValue]);

    const handleSave = () => {
        if (newData && setAproposValue) {
            setAproposValue(newData); // Update aproposValue with newData
        }
        setmodifier(true); // Switch back to view mode
    };

    return (
        <ThemedView style={styles.containerInfo}>
            <View style={styles.itemTitre}>
                <ThemedText type='defaultSemiBold'>{titre}</ThemedText>
                {see && <TouchableOpacity onPress={() => {
                    setmodifier(false)
                    if (modifier) {
                        // In edit mode, save the new data
                        handleSave();
                    } else {
                        setmodifier(!modifier);
                    }
                }}>
                    <Icon name={modifier ? "create-outline" : "checkmark-done-outline"} size={25} color={modifApropos ? COLORS.darkBlue : COLORS.green} />
                </TouchableOpacity>}
            </View>
            <View style={styles.infoCard}>
                {modifier ? (
                    <ThemedText>{dataInitial}</ThemedText> // Display the initial value
                ) : (
                    isSelector ? (
                        <InputSelector
                            options={options}
                            selectedValue={aproposValue}
                            onValueChange={(itemValue) => {
                                setAproposValue!(itemValue); // Update aproposValue on selection
                            }}
                        />
                    ) : (
                        <InputText value={newData || dataInitial} onChangeText={(text) => setnewData(text)} />
                    )
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
        padding: 10,
    },
});
