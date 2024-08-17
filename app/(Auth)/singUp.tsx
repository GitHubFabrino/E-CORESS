import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, router } from 'expo-router';
import ThemedInput from '@/components/input/InputText';
import ThemedButton from '@/components/button/Button';
import { COLORS } from '@/assets/style/style.color';
import { LogoWave } from '@/components/LogoWave';
import ThemedDatePicker from '@/components/input/InputDate';
import GenderSelector from '@/components/input/InputGenreSelector';
import MeetingPreferenceSelector from '@/components/input/InputMeetingPreferenceSelector';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Définir les types pour les champs de formulaire
type FormField =
    | { label: string; value: string; placeholder: string; onChange: React.Dispatch<React.SetStateAction<string>>; isPassword?: boolean }
    | { label: string; value: Date; onChange: React.Dispatch<React.SetStateAction<Date>>; isDatePicker: true }
    | { label: string; value: 'homme' | 'femme' | null; onChange: React.Dispatch<React.SetStateAction<'homme' | 'femme' | null>>; isGenderSelector: true }
    | { label: string; value: 'homme' | 'femme' | 'lesbienne' | 'gay' | null; onChange: React.Dispatch<React.SetStateAction<'homme' | 'femme' | 'lesbienne' | 'gay' | null>>; isMeetingPreferenceSelector: true };

// Définir les types pour les pages du formulaire
type FormPage = {
    fields: FormField[];
};

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [emailUser, setEmailUser] = useState('');
    const [passwordUser, setPasswordUser] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [adress, setAdress] = useState('');
    const [gender, setGender] = useState<'homme' | 'femme' | null>(null);
    const [selectedPreference, setSelectedPreference] = useState<'homme' | 'femme' | 'lesbienne' | 'gay' | null>(null);
    const [isPreferencesVisible, setIsPreferencesVisible] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const [errorName, seterrorName] = useState(false);
    const [errorUsername, seterrorUsername] = useState(false);
    const [errorEmail, seterrorEmail] = useState(false);
    const [errorPassWord, seterrorPassWord] = useState(false);
    const [errorBirthDate, seterrorBirthDate] = useState(false);
    const [errorAdress, seterrorAdress] = useState(false);
    const [errorGender, seterrorGender] = useState(false);
    const [errorSelectedPreference, seterrorSelectedPreference] = useState(false);
    const [errorIsTermesAccepted, seterrorIsTermesAccepted] = useState(false);


    const handleSelectPreference = (preference: 'homme' | 'femme' | 'lesbienne' | 'gay') => {
        setSelectedPreference(preference);
        setIsPreferencesVisible(false);
    };

    const [errors, setErrors] = useState<{ [key: string]: string }>({});



    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};

        // Exemple de validation : vérifier si le champ "name" est vide
        if (name == '') newErrors.name = "Le nom ou pseudo est requis.";
        if (!userName) newErrors.userName = "Le prénom est requis.";
        if (!emailUser) newErrors.emailUser = "L'email est requis.";
        if (!passwordUser) newErrors.passwordUser = "Le mot de passe est requis.";
        if (!adress) newErrors.adress = "L'adresse est requise.";
        if (!gender) newErrors.gender = "Le genre est requis.";
        if (!selectedPreference) newErrors.selectedPreference = "La préférence de rencontre est requise.";
        if (!isTermsAccepted) newErrors.terms = "Vous devez accepter les termes et conditions.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleToggleShowPreferences = () => {
        setIsPreferencesVisible(!isPreferencesVisible);
    };
    const formPages: FormPage[] = [
        {
            fields: [
                { label: 'Nom ou pseudo', value: name, placeholder: 'Votre nom ou pseudo', onChange: setName },
                { label: 'Prénom', value: userName, placeholder: 'Votre prénom', onChange: setUserName },
            ]
        },
        {
            fields: [
                { label: 'Email', value: emailUser, placeholder: 'Votre email', onChange: setEmailUser },
                { label: 'Mot de passe', value: passwordUser, placeholder: 'Votre mot de passe', onChange: setPasswordUser, isPassword: true }
            ]
        },
        {
            fields: [
                { label: 'Date de naissance', value: birthDate, onChange: setBirthDate, isDatePicker: true },
                { label: 'Où habites-tu?', value: adress, placeholder: 'Votre adresse', onChange: setAdress }
            ]
        },
        {
            fields: [
                { label: 'Genre', value: gender, onChange: setGender, isGenderSelector: true },
                { label: 'Préférence de rencontre', value: selectedPreference, onChange: setSelectedPreference, isMeetingPreferenceSelector: true }
            ]
        }
    ];

    const handleNextPage = () => {
        // Vérification du nom
        const isNameValid = name !== '';
        seterrorName(!isNameValid);  // Définir l'erreur si le nom est invalide

        // Si le nom est valide et qu'il reste des pages, passer à la suivante
        if (isNameValid && currentPage < formPages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const renderFields = () => {
        const page = formPages[currentPage];
        return page.fields.map((field, index) => {
            if ('isDatePicker' in field) {
                return <ThemedDatePicker key={index} label={field.label} value={field.value} onChange={field.onChange} />;
            }
            if ('isGenderSelector' in field) {
                return <GenderSelector key={index} selectedGender={field.value} onSelectGender={field.onChange} />;
            }
            if ('isMeetingPreferenceSelector' in field) {
                return <MeetingPreferenceSelector key={index}
                    selectedPreference={selectedPreference}
                    onSelectPreference={handleSelectPreference}
                    onToggleShowPreferences={handleToggleShowPreferences}
                    isPreferencesVisible={isPreferencesVisible}
                />
            }
            return (
                <View key={index}>
                    <ThemedInput

                        label={field.label}
                        value={field.value}
                        placeholder={field.placeholder}
                        onChangeText={field.onChange}
                        isPassword={field.isPassword}
                        style={styles.textColor}
                        error={errorName}
                    />
                    {errorName && <Text style={styles.errorText}>"Le nom ou pseudo est requis."</Text>}

                </View>
            );
        });
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#fff', dark: '#1D3D47' }}
            headerImage={<LogoWave />}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={styles.textColor}>
                    Créez votre compte
                </ThemedText>
            </ThemedView>

            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${((currentPage + 1) / formPages.length) * 100}%` }]} />
                </View>
                {renderFields()}


                <View style={styles.navigationContainer}>
                    {currentPage > 0 && (
                        <TouchableOpacity onPress={handlePreviousPage} style={styles.navButton}>
                            <Icon name="chevron-left" size={30} color={COLORS.bg1} />
                        </TouchableOpacity>
                    )}
                    {currentPage < formPages.length - 1 && (
                        <TouchableOpacity onPress={handleNextPage} style={styles.navButton}>
                            <Icon name="chevron-right" size={30} color={COLORS.bg1} />
                        </TouchableOpacity>
                    )}
                </View>
                {currentPage >= formPages.length - 1 && <View>
                    <View style={styles.termsContainer}>
                        <TouchableOpacity
                            onPress={() => setIsTermsAccepted(!isTermsAccepted)}
                            style={styles.checkboxContainer}
                        >
                            <Icon
                                name={isTermsAccepted ? 'check-box' : 'check-box-outline-blank'}
                                size={24}
                                color={COLORS.bg1}
                            />
                        </TouchableOpacity>
                        <Text style={styles.termsText}>
                            En continuant, vous confirmez que vous avez lu et accepté notre{' '}
                            <Text style={styles.link} onPress={() => {/* Navigate to terms and conditions */ }}>Termes et conditions</Text> et{' '}
                            <Text style={styles.link} onPress={() => {/* Navigate to privacy policy */ }}>politique de confidentialité</Text>.
                        </Text>
                    </View>
                    <ThemedButton
                        onClick={() => {
                            if (isTermsAccepted) {
                                router.navigate('/(Auth)/singin');
                            }
                        }}
                        text={'Créer votre compte'}
                        style={{ marginTop: 30, color: '#232B57' }}
                    />
                </View>}

            </ScrollView>


        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
    },
    scrollContainer: {
        paddingHorizontal: 20,
    },
    textColor: {
        color: COLORS.bg1,
    },
    progressContainer: {
        marginVertical: 20,
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.jaune,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navButton: {
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 10,
        elevation: 5,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    checkboxContainer: {
        marginRight: 10,
    },
    termsText: {
        color: COLORS.bg1,
    },
    link: {
        color: COLORS.jaune,
    },
});




