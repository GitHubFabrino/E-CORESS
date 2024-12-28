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
        raise: string,
        errors: {
            required: string;
            nameRequired: string;
            firstNameRequired: string;
            emailRequired: string;
            invalidEmail: string;
            passwordRequired: string;
            phoneRequired: string;
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
        pop: string
        ubication: String
        infoPer: String
        partenaire: String
        interest: String
        request: String
        myPartener: String
        noAnswer: String
        username: String
        Name: String
        birthday: string
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
        langage: string,
        logOut: string,
        profil: string,
        emailOrPhoneError: string,
        story: string,

        delete: string,
        locked: string,
        unlocked: string,
        raiseText: string,
        increase: string,
        increaseText: string,
        Highlights: string,
        HighlightsText: string,
        textModalRaise: string,
        textModalRaise2: string,
        textModalRaise3: string,
        textModalIncrease: string,
        textModalIncrease2: string,
        textModalIncrease3: string,

        textModalHightlight: string,
        textModalHightlight2: string,
        textModalHightlight3: string,

        matches: string,
        visited: string,
        likes: string,
        likesMe: string,
        becomePremium: string,
        textpremium: string,
        noCorrespondance: string,
        offre: string,
        interactions: string,
        dec: string,
        day: string,
        durring: string,
        textpay: string,
        securtyText: string,
        selectPayText: string,
        selectPayText1: string,
        selectPayText2: string,
        saveOffre: string,
        emailOrPhone: string,
        placeholderEmailOrPhone: string,
        textp: string,
        aproximite1: string,
        aboutme: string,
        curentLocal: string,
        phonePlace: string,
        byeCredit: string,
        activation: string,
        Increase: string,
        yes: string,
        no: string,
        notAct: string,
        Act: string,
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
        male: "Home",
        femelle: "Femme",
        lesbian: "Lesbienne",
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
            phoneRequired: 'Numéro invalide',
            emailRequired: "Email ou Phone ",
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
        emailOrPhone: 'Email ou Numéro téléphone',
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
        emailOrPhoneError: 'Veuillez entrer un email ou un numéro de téléphone valide.',
        sendGift2: 'Ce cadeau a coûté',
        credit: 'Crédits',
        Langue: 'Francais',
        langage: 'Langue',
        logOut: 'Voulez-vous vraiment se déconnécter ?',
        profil: 'Profile',
        story: 'Storie',
        yes: 'Oui',
        no: 'Non',
        phonePlace: 'Votre numero téléphone',
        placeholderEmailOrPhone: 'Votre email ou téléphone',
        delete: 'Supprimer',
        locked: 'Privée',
        unlocked: 'Public',
        Highlights: 'Points forts',
        HighlightsText: 'être vu par toutes les filles de',
        raise: 'Lever',
        raiseText: 'Allez en haut et faites en sorte que plus de personnes voient votre profil.'
        , increase: 'Augmentez votre visibilité',
        increaseText: 'Faites en sorte que davantage de filles votent pour vous en montrant votre photo lors des réunions.',
        textModalRaise: 'Faites-vous voir par plus de gens !',
        textModalRaise2: 'Montez à la première place dans Personnes à proximité et obtenez des visiteurs comme Vanesa, Anna et 15 616 autres personnes de votre région',
        textModalRaise3: 'Coût du service : 150 crédits',

        textModalIncrease: 'Soyez vu 100 fois dans Discover!',
        textModalIncrease2: 'Vous souhaitez connaître un moyen vraiment simple d\'obtenir rapidement de nouveaux matchs? Nous pouvons vous présenter 100 fois dans Discover, afin que d\'autres puissent facilement vous trouver !',
        textModalIncrease3: 'Coût du service : 200 crédits',

        textModalHightlight: 'Faits saillants instantanés!',
        textModalHightlight2: 'Mettez votre photo au premier plan et faites en sorte que Fernanda, Tamara Mendina et 25.178 filles vous voient dans votre région.',
        textModalHightlight3: 'Coût du service : 182 crédits',
        matches: 'Mes matches',
        visited: 'J\'ai visité mon profil',
        likes: 'M\'aime',
        likesMe: 'Mes gouts',
        becomePremium: 'Devenez Premium',
        textpremium: 'Devenez premium pour voir qui vous aime et obtenez des super pouvoirs dans E-coress',
        noCorrespondance: 'Vous n\'avez pas encore de correspondances',
        offre: 'Offres',
        interactions: 'Interactions',
        dec: 'Déconnexion',
        day: 'Jours',
        durring: 'Pendant',
        textpay: 'Choisissez votre mode de paiement',
        securtyText: 'Paiement sécurisé crypté 256 bits',
        selectPayText: 'Vous avez sélectionné l\'offre',
        selectPayText1: 'pour',
        aproximite1: 'A proximité',
        selectPayText2: 'mois',
        saveOffre: 'Enregistrer l\'offre',
        aboutme: 'A Propos de Moi',
        curentLocal: 'Actuel Localisation',
        byeCredit: 'Acheter Crédits',
        Increase: 'Améliorer',
        pop: 'Popularité',
        activation: 'Activation',
        notAct: 'Non activé',
        Act: 'Activé',
        textp: 'Finalisation sécurisée de l\'achat.Vendu et fabriqué par E- coress, un distributeur agréé et un commerçant enregistré.E-coress utilise des problèmes courants de l\'industrie en matière de cryptage pour protéger la confidentialité de vos informations personnelles.'
    },
    EN: {
        phonePlace: 'Your phone number',
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
        male: "Male",
        femelle: "Female",
        lesbian: "Lesbian",
        name: "Name or Nickname",
        firstName: "First Name",
        namePlaceholder: "Your name or nickname",
        firstNamePlaceholder: "Your first name",
        passwordPlaceholder: "Your password",
        confirmPasswordPlaceholder: "Confirm your password",
        birthDateLabel: "Date of birth",
        address: "Where do you live?",
        addressPlaceholder: "Your address",
        emailOrPhoneError: 'Enter an email or phone validated',
        genderLabel: "Gender",
        meetingPreferenceLabel: "Meeting preference",
        termsText: "By continuing, you confirm that you have read and accepted our ",
        termsText1: "Terms and conditions and privacy policy.",
        createAccountButton: "Create your account",
        emailOrPhone: 'Email or Phone',
        errors: {
            required: "is required",
            nameRequired: "Name or nickname",
            firstNameRequired: "First name",
            emailRequired: "Email or Phone",
            invalidEmail: "Invalid email",
            phoneRequired: 'No validate number phone',
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
        placeholderEmailOrPhone: 'Your email or phone',
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
        langage: 'Language',
        logOut: "Do you really want to log out?",
        profil: 'Profil',
        story: 'Story',
        delete: 'Delete',
        locked: 'Private',
        unlocked: 'Public',
        Highlights: 'Highlights',
        HighlightsText: 'get seen by all the girls of',
        raise: 'Raise Up',
        raiseText: 'Go to the top and make more people see your profile.',
        increase: 'Increase your visibility',
        increaseText: 'Make more girls vote for you by showing your photo on meetings.',
        textModalRaise: 'Get seen by more people!',
        textModalRaise2: 'Rise up to first place in People nearby and get visitors like Vanesa, Anna and 15,616 other people in your area',
        textModalRaise3: 'Service cost: 150 Credits',

        textModalIncrease: 'Get seen 100 times in Discover !',
        textModalIncrease2: 'Want to know a really easy way to get new matches fast? We can feature you 100 times in Discover, so others can easily find you!',
        textModalIncrease3: 'Service cost: 200 Credits',

        textModalHightlight: 'Instant Highlights!',
        textModalHightlight2: 'Put your photo in the foreground and make Fernanda, Tamara Mendina y 25.178 girls see you in your area .',
        textModalHightlight3: 'Service cost: 182 Credits',

        matches: 'My matches',
        visited: 'Visited my profile',
        likes: 'Likes me',
        likesMe: 'My likes',
        becomePremium: 'Become Premium',
        textpremium: 'Become premium for see who likes you and get super powers in E-coress',
        noCorrespondance: 'You don\'t have any matches yet',
        offre: 'Offers',
        interactions: 'Interactions',
        dec: 'Logout',
        day: 'Days',
        durring: 'Durring',
        textpay: 'Choose your payment method',
        securtyText: 'Secure 256-bit encrypted payment',
        selectPayText: 'You have selected the',
        selectPayText1: 'offer for',
        selectPayText2: 'months',
        aproximite1: 'Near',
        saveOffre: 'Save Offer',
        aboutme: 'About me',
        curentLocal: 'Current Location',
        byeCredit: 'Buy credits',
        Increase: 'Increase',
        pop: 'Popularity',
        activation: 'Activation',
        notAct: 'No activite',
        Act: 'Activeted',
        yes: 'Yes',
        no: 'No',
        textp: 'Secure completion of the purchase. Sold and made by  E-coress  an authorized distributor and registration trader. E- coress uses common industry problems in encryption to protect the confidentiality of your personal information.'



    }
};
