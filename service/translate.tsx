// Typage explicite de l'objet translations
export const translations: {
    [key in 'FR' | 'EN']: {
        welcome: string;
        description: string;
        connect: string;
        email: string;
        phone: string;
        facebook: string;
        password: string;
        forgotPassword: string;
        login: string;
        alreadyHaveAccount: string;
        signUp: string;
        loading: string;
        invalidEmail: string;
        requiredPassword: string;
        createAccount: string;
        namePlaceholder: string;
        firstNamePlaceholder: string;
        passwordPlaceholder: string;
        confirmPasswordPlaceholder: string;
        birthDateLabel: string;
        addressPlaceholder: string;
        genderLabel: string;
        meetingPreferenceLabel: string;
        termsText: string;
        createAccountButton: string;
        errors: {
            required: string;
            nameRequired: string;
            firstNameRequired: string;
            emailRequired: string;
            invalidEmail: string;
            passwordRequired: string;
            minPasswordLength: string;
            confirmPasswordRequired: string;
            passwordMismatch: string;
            birthDateRequired: string;
            addressRequired: string;
            genderRequired: string;
            preferenceRequired: string;
            ageRestriction: string;
            termsAccepted: string;
        };
        name: string;
        firstName: string;
        placeholderEmail: string;
        address: string;
        termsText1: string;
        alreadyHaveAccount1: string;
        singIn: string;
        male: string;
        femelle: string;
        lesbian: string;
        genderLabel1: string;
        errorgenre: string;
        meet: string;
        homme: string;
        femme: string;
        lesbienne: string;
        gay: string;
        meeting: String;
        aproximite: String
        allUsers: String
        onLigneNow: String
        popular: string
        recent: String
        profile: String
        years: String
        about: String
        ubication: String
        infoPer: String
        partenaire: String
        interest: String
        request: String
        myPartener: String
        noAnswer: String
        username: String
        Name: String
        birthday: String
        noData: String
        suggestion: String
        All: string
        showMe: String
        age: String
        applyFilter: String
        findByEmail: string
        local: String
        localisationInconu: string,
        spend1: string,
        spend2: string,
        transfert: string,
        sendCredit: string,
        cancel: string,
        sug1: string,
        sug2: string,
        sug3: string,
        sug4: string,
        notNow: string,
        pack: string,
        all: string,
        notread: string,
        online: string,
        send: string,
        noMessages: string,
        on: string,
        off: string,
        sendGift1: string,
        sendGift2: string,
        credit: string,
        Langue: string,
        langage: string
    };
} = {
    FR: {
        welcome: "BIENVENU SUR",
        description: "Une belle opportunité de nouer des liens à la fois amicaux et romantiques avec de vraies personnes.",
        connect: "Connecter par",
        email: "Email",
        placeholderEmail: "Votre email",
        phone: "Numéro de téléphone",
        facebook: "Numéro tel ou email Facebook",
        password: "Mot de passe",
        forgotPassword: "Mot de passe oublié ?",
        login: "Connecte-toi maintenant",
        alreadyHaveAccount: "Avez-vous déjà un compte?",
        alreadyHaveAccount1: "J'ai déjà un compte?",
        signUp: "S'inscrire",
        singIn: "Se connecté",
        loading: "En cours de chargement...",
        invalidEmail: "L'email est requis et doit être valide",
        requiredPassword: "Le mot de passe est requis",
        createAccount: "Créez votre compte",
        male: "home",
        femelle: "femme",
        lesbian: "lesbienne",
        name: "Nom ou pseudo",
        namePlaceholder: "Votre nom ou pseudo",
        firstName: "Prénom",
        firstNamePlaceholder: "Votre prénom",
        passwordPlaceholder: "Votre mot de passe",
        confirmPasswordPlaceholder: "Confirmez votre mot de passe",
        birthDateLabel: "Date de naissance",
        address: "Où habites-tu?",
        addressPlaceholder: "Votre adresse",
        genderLabel: "Genre",
        meetingPreferenceLabel: "Préférence de rencontre",
        termsText: "En continuant, vous confirmez que vous avez lu et accepté nos",
        termsText1: "Termes et conditions et politique de confidentialité.",
        createAccountButton: "Créer votre compte",
        errors: {
            required: 'est requis',
            nameRequired: "Nom ou pseudo ",
            firstNameRequired: "Prénom ",
            emailRequired: "Email ",
            invalidEmail: "Email invalide",
            passwordRequired: "Mot de passe ",
            minPasswordLength: "Le mot de passe doit comporter au moins 8 caractères",
            confirmPasswordRequired: "La confirmation du mot de passe est requise",
            passwordMismatch: "Les mots de passe ne correspondent pas",
            birthDateRequired: "Date de naissance ",
            addressRequired: "Où habites-tu? ",
            genderRequired: "Le genre est requis",
            preferenceRequired: "La préférence de rencontre est requis",
            ageRestriction: "Vous devez avoir au moins 18 ans",
            termsAccepted: "Vous devez accepter les termes et conditions "
        },
        genderLabel1: 'Vous êtes :',
        errorgenre: 'Veuillez sélectionner un genre',
        meet: "Je veux rencontrer",
        homme: "Homme",
        femme: "Femme",
        lesbienne: "Lesbienne",
        gay: "Gay",
        meeting: 'Rencontre',
        aproximite: 'Les gens à proximité',
        allUsers: 'Tous les utilisateurs',
        onLigneNow: 'Maintenant en ligne',
        recent: 'Récents',
        profile: 'Profil',
        years: 'Ans',
        about: 'A Propos',
        ubication: 'Emplacement',
        infoPer: 'Informations personnelles',
        partenaire: 'Choisissez un partenaire',
        interest: 'Intérèts',
        request: 'Envoyer la demande',
        myPartener: 'Mes partenaires',
        noAnswer: 'Pas de réponse',
        username: 'Nom d\'utilisateur',
        Name: 'Nom',
        birthday: 'Anniversaire',
        noData: "Rien n'a été trouvé",
        All: "Tous",
        showMe: "Montre-Moi",
        age: "Âge",
        applyFilter: "Appliquer les filtres",
        findByEmail: "Recherche par email",
        local: "Localisation",
        localisationInconu: "Localisation inconnue",
        suggestion: "Veuillez élargir votre filtre de recherche pour obtenir plus de résultats",
        spend1: "Vous dépensez",
        spend2: "Crédit(s)",
        transfert: 'Transférer des crédits de vous à ',
        sendCredit: 'Envoyer',
        cancel: 'Annuller',
        popular: 'Les plus populaires',
        sug1: 'Élargissez votre recherche',
        sug2: 'Désolé, personne ne correspond à vos préférences',
        sug3: 'Rechercher des personnes d\'autres âges?',
        sug4: 'Changez vos préférences',
        notNow: 'Pas Maintenant',
        pack: 'Forfaits de crédits',
        all: 'Tous',
        notread: 'Non lu',
        online: 'En ligne',
        noMessages: 'Aucun Message',
        on: 'En ligne',
        off: 'Hors ligne',
        send: 'Envoyer',
        sendGift1: 'J\'ai envoyé ce cadeau à',
        sendGift2: 'Ce cadeau a coûté',
        credit: 'Crédits',
        Langue: 'Francais',
        langage: 'Langue'
    },
    EN: {
        welcome: "WELCOME TO",
        description: "A great opportunity to build both friendly and romantic connections with real people.",
        connect: "Connect via",
        email: "Email",
        placeholderEmail: "Your Email",
        phone: "Phone number",
        facebook: "Facebook email or phone",
        password: "Password",
        forgotPassword: "Forgot password?",
        login: "Log in now",
        alreadyHaveAccount: "Already have an account?",
        alreadyHaveAccount1: "Already have an account?",
        signUp: "Sign up",
        singIn: "Sign in",
        loading: "Loading...",
        invalidEmail: "Email is required and must be valid",
        requiredPassword: "Password is required",
        createAccount: "Create your account",
        male: "male",
        femelle: "female",
        lesbian: "lesbian",
        name: "Name or Nickname",
        firstName: "First Name",
        namePlaceholder: "Your name or nickname",
        firstNamePlaceholder: "Your first name",
        passwordPlaceholder: "Your password",
        confirmPasswordPlaceholder: "Confirm your password",
        birthDateLabel: "Date of birth",
        address: "Where do you live?",
        addressPlaceholder: "Your address",
        genderLabel: "Gender",
        meetingPreferenceLabel: "Meeting preference",
        termsText: "By continuing, you confirm that you have read and accepted our ",
        termsText1: "Terms and conditions and privacy policy.",
        createAccountButton: "Create your account",
        errors: {
            required: "is required",
            nameRequired: "Name or nickname",
            firstNameRequired: "First name",
            emailRequired: "Email",
            invalidEmail: "Invalid email",
            passwordRequired: "Password ",
            minPasswordLength: "Password must be at least 8 characters long",
            confirmPasswordRequired: "Confirm password ",
            passwordMismatch: "Passwords do not match",
            birthDateRequired: "Date of birth ",
            addressRequired: "Where do you live? ",
            genderRequired: "Gender is required",
            preferenceRequired: "Meeting preference ",
            ageRestriction: "You must be at least 18 years old",
            termsAccepted: "You must accept the terms and conditions"
        },
        genderLabel1: 'You are:',
        errorgenre: 'Please select a gender',
        meet: "I want to meet",
        homme: "Male",
        femme: "Female",
        lesbienne: "Lesbian",
        gay: "Gay",
        meeting: 'Encounters',
        aproximite: 'People nerby',
        allUsers: 'All users',
        onLigneNow: 'Online now',
        recent: 'Recent',
        profile: 'Profile',
        years: 'years',
        about: 'About',
        ubication: 'Ubication',
        infoPer: 'Personal Information',
        partenaire: 'Choose a partner',
        interest: 'Interests',
        request: 'Send the request',
        myPartener: 'My partners',
        noAnswer: 'No answer',
        username: 'Username',
        Name: 'Name',
        birthday: 'Birthday',
        noData: "Nothing has been found ",
        All: "All",
        showMe: "Show me",
        age: "Age",
        applyFilter: "Apply the filters",
        findByEmail: "Search by email",
        local: "Localisation",
        localisationInconu: "Localisation unknow",
        suggestion: "Please expand your search filter to get more results",
        spend1: "You spend",
        spend2: "Credit(s)",
        transfert: 'Transfer credits from you to',
        sendCredit: 'Send Credit',
        cancel: 'Cancel',
        popular: 'Users most populars',
        sug1: 'Expand you search',
        sug2: 'Sorry, no one fits you preferences',
        sug3: 'Search for people of other ages?',
        sug4: 'Change you preferences',
        notNow: 'Not Now',
        pack: 'Credits packages',
        all: 'All',
        notread: 'Not Read',
        online: 'On Line',
        noMessages: 'No Message',
        on: 'Online',
        off: 'Offline',
        send: 'Send',
        sendGift1: 'Sent this gift to',
        sendGift2: 'This gift cost',
        credit: 'Credits',
        Langue: 'English',
        langage: 'Language'

    }
};
