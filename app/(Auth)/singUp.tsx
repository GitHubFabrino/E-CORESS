import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, router } from 'expo-router';
import ThemedInput from '@/components/input/InputText';
import ThemedButton from '@/components/button/Button';
import { COLORS } from '@/assets/style/style.color';
import ThemedDatePicker from '@/components/input/InputDate';
import GenderSelector from '@/components/input/InputGenreSelector';
import MeetingPreferenceSelector from '@/components/input/InputMeetingPreferenceSelector';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoadingSpinner from '@/components/spinner/LoadingSpinner';

export default function SignUpScreen() {
    const [name, setName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [emailUser, setEmailUser] = useState<string>('');
    const [passwordUser, setPasswordUser] = useState<string>('');
    const [birthDate, setBirthDate] = useState<Date | null>(new Date());
    const [adress, setAdress] = useState<string>('');
    const [gender, setGender] = useState<'homme' | 'femme' | null>(null);
    const [selectedPreference, setSelectedPreference] = useState<'homme' | 'femme' | 'lesbienne' | 'gay' | null>(null);
    const [isPreferencesVisible, setIsPreferencesVisible] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectPreference = (preference: 'homme' | 'femme' | 'lesbienne' | 'gay') => {
        setSelectedPreference(preference);
        setIsPreferencesVisible(false);
    };

    const handleToggleShowPreferences = () => {
        setIsPreferencesVisible(!isPreferencesVisible);
    };

    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};

        const fields = [
            { label: 'Nom ou pseudo', value: name, placeholder: 'Votre nom ou pseudo', onChange: setName },
            { label: 'Prénom', value: userName, placeholder: 'Votre prénom', onChange: setUserName },
            { label: 'Email', value: emailUser, placeholder: 'Votre email', onChange: setEmailUser },
            { label: 'Mot de passe', value: passwordUser, placeholder: 'Votre mot de passe', onChange: setPasswordUser, isPassword: true },
            { label: 'Date de naissance', value: birthDate || new Date(), onChange: setBirthDate, isDatePicker: true },
            { label: 'Où habites-tu?', value: adress, placeholder: 'Votre adresse', onChange: setAdress },
            { label: 'Genre', value: gender, onChange: setGender, isGenderSelector: true },
            { label: 'Préférence de rencontre', value: selectedPreference, onChange: setSelectedPreference, isMeetingPreferenceSelector: true }
        ];

        fields.forEach((field) => {
            if ('value' in field && typeof field.value === 'string') {
                if (field.value.trim() === '') {
                    newErrors[field.label] = `${field.label} est requis`;
                } else if (field.label === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                    newErrors[field.label] = 'Email invalide';
                } else if ('isPassword' in field && field.isPassword && field.value.length < 8) {
                    newErrors[field.label] = 'Le mot de passe doit comporter au moins 8 caractères';
                }
            } else if ('isGenderSelector' in field && field.value === null) {
                newErrors['Genre'] = 'Le genre est requis';
            } else if ('isMeetingPreferenceSelector' in field && field.value === null) {
                newErrors['Préférence de rencontre'] = 'La préférence de rencontre est requise';
            } else if ('isDatePicker' in field && field.value instanceof Date) {
                const age = new Date().getFullYear() - field.value.getFullYear();
                if (age < 18) {
                    newErrors['Date de naissance'] = 'Vous devez avoir au moins 18 ans';
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateAccount = () => {
        if (validateFields() && isTermsAccepted) {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                router.navigate('/importImage');
            }, 2000);
        } else {
            setErrors((prev) => ({ ...prev, termsAccepted: 'Vous devez accepter les termes et conditions' }));
        }
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#fff', dark: '#1D3D47' }}
            height={100}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={styles.textColor}>
                    Créez votre compte
                </ThemedText>
            </ThemedView>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View>
                    <ThemedInput
                        label="Nom ou pseudo"
                        value={name}
                        placeholder="Votre nom ou pseudo"
                        onChangeText={setName}
                        error={errors['Nom ou pseudo']}
                    />
                    <ThemedInput
                        label="Prénom"
                        value={userName}
                        placeholder="Votre prénom"
                        onChangeText={setUserName}
                        error={errors['Prénom']}
                    />
                    <ThemedInput
                        label="Email"
                        value={emailUser}
                        placeholder="Votre email"
                        onChangeText={setEmailUser}
                        error={errors['Email']}
                    />
                    <ThemedInput
                        label="Mot de passe"
                        value={passwordUser}
                        placeholder="Votre mot de passe"
                        onChangeText={setPasswordUser}
                        isPassword={true}
                        error={errors['Mot de passe']}
                    />
                    <ThemedDatePicker
                        label="Date de naissance"
                        value={birthDate || new Date()}
                        onChange={setBirthDate}
                        error={errors['Date de naissance']}
                    />

                    <ThemedInput
                        label="Où habites-tu?"
                        value={adress}
                        placeholder="Votre adresse"
                        onChangeText={setAdress}
                        error={errors['Où habites-tu?']}
                    />
                    <GenderSelector
                        selectedGender={gender}
                        onSelectGender={setGender}
                        error={errors['Genre']}
                    />
                    <MeetingPreferenceSelector
                        selectedPreference={selectedPreference}
                        onSelectPreference={handleSelectPreference}
                        onToggleShowPreferences={handleToggleShowPreferences}
                        isPreferencesVisible={isPreferencesVisible}
                        error={errors['Préférence de rencontre']}
                    />
                </View>
                <View style={styles.termsContainer}>
                    <TouchableOpacity onPress={() => setIsTermsAccepted(!isTermsAccepted)} style={styles.checkboxContainer}>
                        <Icon name={isTermsAccepted ? 'check-box' : 'check-box-outline-blank'} size={24} color={COLORS.bg1} />
                    </TouchableOpacity>
                    <Text style={styles.termsText}>
                        En continuant, vous confirmez que vous avez lu et accepté notre{' '}
                        <Text style={styles.link} onPress={() => {/* Navigate to terms and conditions */ }}>Termes et conditions</Text> et{' '}
                        <Text style={styles.link} onPress={() => {/* Navigate to privacy policy */ }}>politique de confidentialité</Text>.
                    </Text>
                </View>
                {errors['termsAccepted'] && <Text style={styles.errorText}>{errors['termsAccepted']}</Text>}

                <ThemedButton
                    onClick={handleCreateAccount}
                    text="Créer votre compte"
                    style={{ marginTop: 30 }}
                />

                <ThemedView style={styles.accountContainer}>
                    <ThemedText style={styles.textContainer}>J'ai déjà un compte?</ThemedText>
                    <Link href="/(Auth)/singin">
                        <ThemedText type="link" style={styles.link}>
                            S'inscrire
                        </ThemedText>
                    </Link>
                </ThemedView>
            </ScrollView>

            <LoadingSpinner isVisible={isLoading} text="En cours de création..." size={60} />
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 50,
    },
    accountContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 10,
    },
    textContainer: {
        color: COLORS.bg1,
        marginHorizontal: 5,
    },
    titleContainer: {
        paddingVertical: 30,
        marginVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textColor: {
        color: COLORS.bg1,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    checkboxContainer: {
        marginRight: 8,
    },
    termsText: {
        fontSize: 12,
        textAlign: 'center',
        width: '90%'
    },
    link: {
        color: COLORS.jaune,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
});





// import React, { useState } from 'react';
// import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { router } from 'expo-router';
// import ThemedInput from '@/components/input/InputText';
// import ThemedButton from '@/components/button/Button';
// import { COLORS } from '@/assets/style/style.color';
// import { LogoWave } from '@/components/LogoWave';
// import ThemedDatePicker from '@/components/input/InputDate';
// import GenderSelector from '@/components/input/InputGenreSelector';
// import MeetingPreferenceSelector from '@/components/input/InputMeetingPreferenceSelector';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LoadingSpinner from '@/components/spinner/LoadingSpinner';

// type FormField =
//     | { label: string; value: string; placeholder: string; onChange: React.Dispatch<React.SetStateAction<string>>; isPassword?: boolean }
//     | { label: string; value: Date; onChange: React.Dispatch<React.SetStateAction<Date>>; isDatePicker: true }
//     | { label: string; value: 'homme' | 'femme' | null; onChange: React.Dispatch<React.SetStateAction<'homme' | 'femme' | null>>; isGenderSelector: true }
//     | { label: string; value: 'homme' | 'femme' | 'lesbienne' | 'gay' | null; onChange: React.Dispatch<React.SetStateAction<'homme' | 'femme' | 'lesbienne' | 'gay' | null>>; isMeetingPreferenceSelector: true };


// type FormPage = {
//     fields: FormField[];
// };
// export default function SignUpScreen() {
//     const [name, setName] = useState('');
//     const [userName, setUserName] = useState('');
//     const [emailUser, setEmailUser] = useState('');
//     const [passwordUser, setPasswordUser] = useState('');
//     const [birthDate, setBirthDate] = useState(new Date());
//     const [adress, setAdress] = useState('');
//     const [gender, setGender] = useState<'homme' | 'femme' | null>(null);
//     const [selectedPreference, setSelectedPreference] = useState<'homme' | 'femme' | 'lesbienne' | 'gay' | null>(null);
//     const [isPreferencesVisible, setIsPreferencesVisible] = useState(false);
//     const [isTermsAccepted, setIsTermsAccepted] = useState(false);
//     const [currentPage, setCurrentPage] = useState(0);

//     const [errors, setErrors] = useState<{ [key: string]: string }>({});
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSelectPreference = (preference: 'homme' | 'femme' | 'lesbienne' | 'gay') => {
//         setSelectedPreference(preference);
//         setIsPreferencesVisible(false);
//     };

//     const handleToggleShowPreferences = () => {
//         setIsPreferencesVisible(!isPreferencesVisible);
//     };
//     const formPages: FormPage[] = [
//         {
//             fields: [
//                 { label: 'Nom ou pseudo', value: name, placeholder: 'Votre nom ou pseudo', onChange: setName },
//                 { label: 'Prénom', value: userName, placeholder: 'Votre prénom', onChange: setUserName },
//             ]
//         },
//         {
//             fields: [
//                 { label: 'Email', value: emailUser, placeholder: 'Votre email', onChange: setEmailUser },
//                 { label: 'Mot de passe', value: passwordUser, placeholder: 'Votre mot de passe', onChange: setPasswordUser, isPassword: true }
//             ]
//         },
//         {
//             fields: [
//                 { label: 'Date de naissance', value: birthDate, onChange: setBirthDate, isDatePicker: true },
//                 { label: 'Où habites-tu?', value: adress, placeholder: 'Votre adresse', onChange: setAdress }
//             ]
//         },
//         {
//             fields: [
//                 { label: 'Genre', value: gender, onChange: setGender, isGenderSelector: true },
//                 { label: 'Préférence de rencontre', value: selectedPreference, onChange: setSelectedPreference, isMeetingPreferenceSelector: true }
//             ]
//         }
//     ];

//     const validateFields = () => {
//         const newErrors: { [key: string]: string } = {};

//         formPages[currentPage].fields.forEach((field) => {
//             if ('value' in field && typeof field.value === 'string') {
//                 if (field.value.trim() === '') {
//                     newErrors[field.label] = `${field.label} est requis`;
//                 } else if (field.label === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
//                     newErrors[field.label] = 'Email invalide';
//                 } else if ('isPassword' in field && field.isPassword && field.value.length < 8) {
//                     newErrors[field.label] = 'Le mot de passe doit comporter au moins 8 caractères';
//                 }
//             } else if ('isGenderSelector' in field && field.value === null) {
//                 newErrors['Genre'] = 'Le genre est requis';
//             } else if ('isMeetingPreferenceSelector' in field && field.value === null) {
//                 newErrors['Préférence de rencontre'] = 'La préférence de rencontre est requise';
//             } else if ('isDatePicker' in field && field.value instanceof Date) {
//                 const age = new Date().getFullYear() - field.value.getFullYear();
//                 if (age < 18) {
//                     newErrors['Date de naissance'] = 'Vous devez avoir au moins 18 ans';
//                 }
//             }
//         });

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const renderFields = () => {
//         const page = formPages[currentPage];
//         return page.fields.map((field, index) => {
//             if ('isDatePicker' in field) {
//                 return (
//                     <View key={index}>
//                         <ThemedDatePicker label={field.label} value={field.value} onChange={field.onChange}
//                             error={errors[field.label]}
//                         />
//                     </View>
//                 );
//             }
//             if ('isGenderSelector' in field) {
//                 return (
//                     <View key={index}>
//                         <GenderSelector
//                             selectedGender={field.value}
//                             onSelectGender={field.onChange}
//                             error={errors['Genre']}
//                         />
//                     </View>
//                 );
//             }
//             if ('isMeetingPreferenceSelector' in field) {
//                 return (
//                     <View key={index}>
//                         <MeetingPreferenceSelector
//                             selectedPreference={selectedPreference}
//                             onSelectPreference={handleSelectPreference}
//                             onToggleShowPreferences={handleToggleShowPreferences}
//                             isPreferencesVisible={isPreferencesVisible}
//                             error={errors['Préférence de rencontre']}
//                         />
//                     </View>
//                 );
//             }
//             return (
//                 <View key={index}>
//                     <ThemedInput
//                         label={field.label}
//                         value={field.value}
//                         placeholder={field.placeholder}
//                         onChangeText={field.onChange}
//                         isPassword={field.isPassword}
//                         style={styles.textColor}
//                         error={errors[field.label]}
//                     />

//                 </View>
//             );
//         });
//     };

//     const handleNextPage = () => {
//         if (validateFields() && currentPage < formPages.length - 1) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     const handlePreviousPage = () => {
//         if (currentPage > 0) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     const handleCreateAccount = () => {
//         if (validateFields() && isTermsAccepted) {
//             setIsLoading(true);
//             setTimeout(() => {
//                 setIsLoading(false);
//                 router.navigate('/(Auth)/singin');
//             }, 2000);
//         } else {
//             setErrors((prev) => ({ ...prev, termsAccepted: 'Vous devez accepter les termes et conditions' }));
//         }
//     };

//     return (
//         <ParallaxScrollView headerBackgroundColor={{ light: '#fff', dark: '#1D3D47' }} headerImage={<LogoWave />}>
//             <ThemedView style={styles.titleContainer}>
//                 <ThemedText type="title" style={styles.textColor}>
//                     Créez votre compte
//                 </ThemedText>
//             </ThemedView>

//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 <View style={styles.progressContainer}>
//                     <View style={[styles.progressBar, { width: `${((currentPage + 1) / formPages.length) * 100}%` }]} />
//                 </View>
//                 {renderFields()}

//                 <View style={styles.navigationContainer}>
//                     {currentPage > 0 && (
//                         <TouchableOpacity onPress={handlePreviousPage} style={styles.navButton}>
//                             <Icon name="chevron-left" size={35} color={COLORS.bg1} />
//                         </TouchableOpacity>
//                     )}
//                     {currentPage < formPages.length - 1 && (
//                         <TouchableOpacity onPress={handleNextPage} style={styles.navButton}>
//                             <Icon name="chevron-right" size={35} color={COLORS.bg1} />
//                         </TouchableOpacity>
//                     )}
//                 </View>

//                 {currentPage >= formPages.length - 1 && (
//                     <View>
//                         <View style={styles.termsContainer}>
//                             <TouchableOpacity onPress={() => setIsTermsAccepted(!isTermsAccepted)} style={styles.checkboxContainer}>
//                                 <Icon name={isTermsAccepted ? 'check-box' : 'check-box-outline-blank'} size={24} color={COLORS.bg1} />
//                             </TouchableOpacity>
//                             <Text style={styles.termsText}>
//                                 En continuant, vous confirmez que vous avez lu et accepté notre{' '}
//                                 <Text style={styles.link} onPress={() => {/* Navigate to terms and conditions */ }}>Termes et conditions</Text> et{' '}
//                                 <Text style={styles.link} onPress={() => {/* Navigate to privacy policy */ }}>politique de confidentialité</Text>.
//                             </Text>
//                         </View>
//                         {errors['termsAccepted'] && <Text style={styles.errorText}>{errors['termsAccepted']}</Text>}

//                         <ThemedButton
//                             onClick={handleCreateAccount}
//                             text={'Créer votre compte'}
//                             style={{ marginTop: 30, color: '#232B57' }}
//                         />
//                     </View>
//                 )}
//             </ScrollView>

//             <LoadingSpinner isVisible={isLoading} text='En cours de création...' size={60} />
//         </ParallaxScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     scrollContainer: {
//         flexGrow: 1,
//         padding: 20,
//     },
//     titleContainer: {
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     textColor: {
//         color: COLORS.bg1,
//     },
//     progressContainer: {
//         height: 10,
//         backgroundColor: '#e0e0e0',
//         borderRadius: 5,
//         overflow: 'hidden',
//         marginBottom: 20,
//     },
//     progressBar: {
//         height: '100%',
//         backgroundColor: COLORS.jaune,
//     },
//     navigationContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginTop: 20,
//     },
//     navButton: {
//         backgroundColor: '#fff',
//         borderRadius: 50,
//         padding: 15,
//         elevation: 5,
//     },
//     termsContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop: 20,
//     },
//     checkboxContainer: {
//         marginRight: 10,
//     },
//     termsText: {
//         fontSize: 14,
//         color: COLORS.bg1,
//     },
//     link: {
//         color: COLORS.jaune,
//         textDecorationLine: 'underline',
//     },
//     errorText: {
//         color: 'red',
//         marginTop: 10,
//     },
//     modalBackground: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     activityIndicatorWrapper: {
//         padding: 20,
//     },
// });

