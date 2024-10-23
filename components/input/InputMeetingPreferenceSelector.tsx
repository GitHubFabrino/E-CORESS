import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/assets/style/style.color';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assurez-vous d'installer cette bibliothèque
import { translations } from '@/service/translate';

type Preference = 'homme' | 'femme' | 'lesbienne' | 'gay';

interface MeetingPreferenceSelectorProps {
    selectedPreference: Preference | null;
    onSelectPreference: (preference: Preference) => void;
    onToggleShowPreferences: () => void;
    isPreferencesVisible: boolean;
    error?: string;
    lang: 'FR' | 'EN';
}

const MeetingPreferenceSelector: React.FC<MeetingPreferenceSelectorProps> = ({
    selectedPreference,
    onSelectPreference,
    onToggleShowPreferences,
    isPreferencesVisible,
    error,
    lang
}) => {
    const t = translations[lang];
    const preferences: Preference[] = ['homme', 'femme', 'lesbienne', 'gay'];

    return (
        <View>
            <TouchableOpacity
                style={styles.button}
                onPress={onToggleShowPreferences}
            >
                <Text style={styles.buttonText}>{t.meet}</Text>
            </TouchableOpacity>
            {isPreferencesVisible && (
                <View style={styles.preferencesContainer}>
                    {preferences.map((preference) => (
                        <TouchableOpacity
                            key={preference}
                            style={[
                                styles.preferenceItem,
                                {
                                    backgroundColor:
                                        preference === selectedPreference
                                            ? COLORS.lightGray
                                            : 'transparent',
                                },
                            ]}
                            onPress={() => onSelectPreference(preference)}
                        >
                            <Text
                                style={[
                                    styles.preferenceText,
                                    {
                                        color:
                                            preference === selectedPreference
                                                ? COLORS.white
                                                : COLORS.bg1,
                                    },
                                ]}
                            >
                                {t[preference].charAt(0).toUpperCase() + t[preference].slice(1)}
                            </Text>
                            {preference === selectedPreference && (
                                <Icon name="check" size={20} color={COLORS.bg1} style={styles.icon} />
                            )}
                        </TouchableOpacity>


                    ))}

                </View>

            )}
            {selectedPreference && (

                <View
                    style={styles.option}

                >
                    <Text style={styles.optionText}>{t[selectedPreference]}</Text>

                    <Icon name="check" size={20} color={COLORS.bg1} style={styles.icon} />

                </View>


            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        color: COLORS.bg1,
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
        backgroundColor: '#f0f0f08b',
        paddingVertical: 10,
        borderRadius: 10
    },
    buttonText: {
        color: COLORS.bg1,
        fontSize: 16,
        fontWeight: 'bold',
    },
    preferencesContainer: {
        marginTop: 10,
    },
    preferenceItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderGray,
        flexDirection: 'row',
        alignItems: 'center',
    },
    preferenceText: {
        fontSize: 16,
        flex: 1,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
        backgroundColor: COLORS.lightGray,
    },
    optionText: {
        color: COLORS.bg1,
        fontSize: 16,
        flex: 1,
    },
    checkIcon: {
        fontSize: 20,
    },
    selectedPreferenceContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: COLORS.lightGray,
        borderRadius: 5,
    },
    selectedPreferenceText: {
        fontSize: 16,
        color: COLORS.darkBlue,
    },
    icon: {
        marginLeft: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
    },
});

export default MeetingPreferenceSelector;
