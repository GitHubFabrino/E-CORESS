

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cookies } from '@react-native-cookies/cookies';
const apiClient = axios.create({
    baseURL: 'https://www.e-coress.com/requests/api.php',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    },
    withCredentials: true,
});

const apiClientLocal = axios.create({
    baseURL: 'https://api.openweathermap.org/geo/1.0/direct',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    },
    withCredentials: true,
});
const apiClientGif = axios.create({
    baseURL: 'https://api.giphy.com/v1/gifs/trending',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    },
    withCredentials: true,
});
const apiClientUser = axios.create({
    baseURL: 'https://www.e-coress.com/requests/user.php',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    },
    withCredentials: true,
});

const apiInitialisationPayement = axios.create({
    baseURL: 'https://www.e-coress.com/pay/testpayement.php',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    },
    withCredentials: true,
});

const apiClientBello = axios.create({
    baseURL: 'https://www.e-coress.com/requests/belloo.php',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    },
    withCredentials: true,
});


const apiClientInterests = axios.create({
    baseURL: 'https://www.e-coress.com/requests/apiInterests.php',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    },
    withCredentials: true,
});


const apiClientImage = axios.create({
    baseURL: 'https://www.e-coress.com/assets/sources/appupload.php',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    },
    withCredentials: true,
});


export const fetchUserData = async (
    age: string,
    gender: string,
    radius: string,
    online: string,
    limit: string,
    username: string
): Promise<any> => {
    const url = 'https://www.e-coress.com/requests/apiService.php';

    // Configurer les paramètres
    const data = new URLSearchParams({
        action: 'meet_filter',
        age,
        gender,
        radius,
        online,
        limit,
        username
    });

    try {
        // Récupérer le cookie depuis AsyncStorage
        const sessionCookie = await AsyncStorage.getItem('session_cookie');
        if (!sessionCookie) {
            throw new Error('Session cookie not found');
        }

        // Configurer les en-têtes avec le cookie récupéré
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': sessionCookie
            }
        };

        // Effectuer la requête
        const response = await axios.post(url, data.toString(), config);
        console.log("fetch data meet:", response.data); // Afficher les données
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { data: [] }
    }
};

export const fetchUserDataWall = async (
    id: string,
    b: string,
): Promise<any> => {
    const url = 'https://www.e-coress.com/requests/belloo.php';

    // Configurer les paramètres
    const data = new URLSearchParams({
        action: 'wall',
        id,
        b
    });

    try {
        // Récupérer le cookie depuis AsyncStorage
        const sessionCookie = await AsyncStorage.getItem('session_cookie');
        if (!sessionCookie) {
            throw new Error('Session cookie not found');
        }

        // Configurer les en-têtes avec le cookie récupéré
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': sessionCookie
            }
        };

        // Effectuer la requête
        const response = await axios.post(url, data.toString(), config);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { data: [] }
    }
};
// https://www.e-coress.com/requests/api.php?action=login_phone&login_email=testuser@example.com&login_pass=password123
// https://www.e-coress.com/requests/api.php?action=login_phone&login_pass=password123&login_phone_number=1234567890
export const authenticateUser = async (email: string, password: string, isEmail: boolean): Promise<any> => {
    try {
        let response
        if (isEmail == true) {
            response = await apiClient.get('', {
                params: {
                    action: 'login',
                    login_email: email,
                    login_pass: password,
                    dID: 0,
                }
            });
        } else {
            response = await apiClient.get('', {
                params: {
                    action: 'login_phone',
                    login_phone_number: email,
                    login_pass: password,
                    dID: 0,
                }
            });
        }
        // Vérifier si la réponse contient des cookies
        const cookies = response?.headers['set-cookie'];
        console.log('Cookies1:', cookies);

        // Stockage de chaque cookie dans AsyncStorage
        if (cookies && cookies.length > 0) {

            await AsyncStorage.setItem('session_cookie', cookies[0]);

        }

        // console.log('storage : ', await AsyncStorage.getItem('session_cookie'));
        // console.log("Raw Response:", response); // Afficher la réponse brute
        const responseData = response?.data;

        // Vérifiez si la réponse est une chaîne et commence par '<' (HTML)
        if (typeof responseData === 'string' && responseData.startsWith('<')) {
            // Extraire le JSON à partir de la réponse
            const jsonMatch = responseData.match(/({.*})/);
            if (jsonMatch && jsonMatch[1]) {
                try {
                    const jsonData = JSON.parse(jsonMatch[1]);

                    console.log('JSON EE', jsonData);

                    return jsonData;
                } catch (e) {
                    console.error('Erreur de parsing des données JSON extraites:', e);
                    throw new Error('Réponse inattendue, impossible de parser la chaîne JSON extraite.');
                }
            } else {
                console.error('Aucune donnée JSON trouvée dans la réponse HTML.');
                throw new Error('Réponse inattendue, aucune donnée JSON trouvée.');
            }
        }

        // Traitement normal si responseData est un objet ou JSON
        if (typeof responseData === 'object') {
            if (responseData.error) {
                return responseData;
            }
            return responseData;
        } else if (typeof responseData === 'string') {
            try {
                const jsonData = JSON.parse(responseData);
                return jsonData;
            } catch (e) {
                console.error('Erreur de parsing des données JSON:', e);
                throw new Error('Réponse inattendue, impossible de parser la chaîne JSON.');
            }
        } else {
            throw new Error('Réponse inattendue.');
        }
    } catch (error) {
        console.error("Erreur lors de l'authentification:", error);
        return { error: 'Une erreur est survenue lors de l\'authentification.' };
    }
};

const formateResponse = (response: any) => {
    // Récupérer la réponse sous forme de texte
    const responseText = response;

    // Trouver l'index du premier caractère `{`
    const jsonStartIndex = responseText.indexOf('{');
    if (jsonStartIndex === -1) {
        throw new Error('Aucune donnée JSON trouvée dans la réponse.');
    }

    // Extraire la partie JSON de la réponse
    return responseText.substring(jsonStartIndex);
}

// https://www.e-coress.com/requests/api.php?action=registerUser&reg_email=test7user51@example.com&reg_pass=password123&reg_name=Test%20User&reg_gender=1&reg_birthday=1990-05-15&reg_looking=1&reg_photo=photo_url&reg_thumb=thumb_url&reg_phone_number=127487890&reg_city=Paris&reg_country=France&reg_lat=48.8566&reg_lng=2.3522&reg_username=testuser90&dID=0&reg_lang=1
// Fonction pour enregistrer un utilisateur
export const registerUser = async (userData: {
    reg_email: string;
    reg_pass: string;
    reg_name: string;
    reg_username: string,
    reg_gender: string | null;
    reg_birthday: string;
    reg_looking: string | null;
    reg_city: string;
    reg_country: string;
    reg_lat: string;
    reg_lng: string;
    reg_photo: string;
    reg_thumb: string;
    reg_phone_number: string;

}): Promise<any> => {
    try {

        console.log("DATA API : ", userData);

        const response = await apiClient.get('', {
            params: {
                action: "registerUser",
                reg_email: userData.reg_email,
                reg_pass: userData.reg_pass,
                reg_name: userData.reg_name,
                reg_gender: userData.reg_gender,
                reg_birthday: userData.reg_birthday,
                reg_looking: userData.reg_looking,
                reg_city: userData.reg_city,
                reg_username: userData.reg_username,
                reg_country: userData.reg_country,
                reg_lat: userData.reg_lat,
                reg_lng: userData.reg_lng,
                reg_photo: userData.reg_photo,
                reg_thumb: userData.reg_thumb,
                reg_phone_number: userData.reg_phone_number
            }
        });
        const responseData = response.data
        console.log('REPONSE REGISTER ', responseData);


        if (typeof responseData === 'object') {
            if (responseData.error) {
                return responseData;
            } else {
                return responseData;
            }
        } else if (typeof responseData === 'string') {
            try {
                const jsonString = formateResponse(response.data)

                try {
                    const jsonData = JSON.parse(jsonString);
                    if (jsonData.error) {
                        console.log("REPONSE API ERROR : ", jsonData);
                        return jsonData;
                    } else {
                        console.log("REPONSE API : ", jsonData);
                        return jsonData;
                    }
                } catch (e) {
                    console.error('Erreur de parsing des données JSON:', e);
                    throw e;
                }
            } catch (e) {
                console.error('Erreur de parsing des données JSON:', e);
                throw new Error('Réponse inattendue, impossible de parser la chaîne JSON.');
            }
        } else {
            throw new Error('Réponse inattendue.');
        }
    } catch (error) {
        console.error('API Error', error);
        throw error;
    }
};

// Fonction pour deconnection un utilisateur
export const logoutUser = async (idApp: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: 'logout',
                query: 0,
            }
        });

    } catch (error) {
        console.error("Erreur lors de deconnextion:", error);
        throw error;
    }
};




// Fonction pour extraire le JSON depuis la réponse brute
const extractJsonFromResponse = (response: string) => {
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = response.substring(jsonStart, jsonEnd + 1);
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Erreur lors de l\'analyse du JSON :', error);
            return null;
        }
    }

    return null;
};
export const userProfil = async (userId: string): Promise<any> => {
    try {
        const response = await apiClient.get('', {
            params: {
                action: 'userProfile',
                id: userId
            }
        });
        console.log('USER DATA ', response.data);

        if (typeof response.data === 'string') {
            try {
                const jsonData = JSON.parse(response.data);
                //      console.log('Parsed JSON Data: ', jsonData);
                return jsonData;
            } catch (e) {
                console.error('Erreur de parsing des données JSON:', e);
                throw new Error('Réponse inattendue, impossible de parser la chaîne JSON.');
            }
        } else if (typeof response.data === 'object') {
            //         console.log("RESPONSE QUESTION: ", response.data.user.question);
            return response.data;
        } else {
            throw new Error('Réponse inattendue.');
        }
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        throw error;
    }
};




// Fonction pour enregistrer un utilisateur
export const getMessage = async (userId1: string, userId2: string): Promise<any> => {
    try {
        const response = await apiClient.get('', {
            params: {
                action: "userChat",
                uid1: userId1,
                uid2: userId2
            }
        });
        const responseData = response.data
        console.log('TYPE OF CHAT', typeof responseData);
        console.log('DATA Message ALL ', responseData);



        if (typeof responseData === 'object') {
            if (responseData.error) {
                return responseData;
            } else {
                return responseData;
            }
        } else if (typeof responseData === 'string') {
            try {
                const jsonString = formateResponse(response.data)

                try {
                    const jsonData = JSON.parse(jsonString);
                    if (jsonData.error) {
                        console.log("REPONSE API ERROR : ", jsonData);
                        return jsonData;
                    } else {
                        console.log("REPONSE API : ", jsonData);
                        return jsonData;
                    }
                } catch (e) {
                    console.error('Erreur de parsing des données JSON:', e);
                    throw e;
                }
            } catch (e) {
                console.error('Erreur de parsing des données JSON:', e);
                throw new Error('Réponse inattendue, impossible de parser la chaîne JSON.');
            }
        } else {
            throw new Error('Réponse inattendue.');
        }
    } catch (error) {
        console.error('API Error', error);
        throw error;
    }
};



// Fonction pour enregistrer un utilisateur
export const sendMessage = async (Query: string): Promise<any> => {
    console.log('Query before sending:', Query);
    try {
        const response = await apiClient.get('', {
            params: {
                action: "sendMessage",
                query: Query
            }
        });
        const responseData = response.data
        console.log('TYPE OF SEND MESSAGE', typeof responseData);
        console.log('DATA OF SEND Message ALL ', responseData);
        if (response.status === 200) {

            console.log('Message envoyé avec succès:', response.status);
            return response.status
        } else {
            console.error('Erreur lors de l\'envoi du message:', response.statusText);
            throw new Error('Réponse inattendue.');
        }
    } catch (error) {
        console.error('API Error', error);
        throw error;
    }
};

// ************************** 03/12/24
export const updateCredits = async (idUser: string, type: string, credits: string, reason: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: 'updateCredits',
                // query: `${idUser},1,1,Credits for like,`
                query: `${idUser},${type},${credits},${reason},`
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Mise à jour des crédits réussie:", response.data);
            return response.status;
        } else {
            console.error("Échec de la mise à jour des crédits:", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error) {
        console.error("Erreur lors de la mise à jour des crédits:", error);
        throw error;
    }
};
export const updateCreditsNewUser = async (idUser: string): Promise<any> => {
    try {
        const query = `${idUser},120,reward,Reward credits for register,newAccountFreeCredit`;

        const response = await apiClient.get('', {
            params: {
                action: 'updateCredits',
                query: query
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Mise à jour des crédits réussie:", response.status);
            return response.status;
        } else {
            console.error("Échec de la mise à jour des crédits:", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error) {
        console.error("Erreur lors de la mise à jour des crédits:", error);
        throw error;
    }
};
export const rt = async (query: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: 'message',
                query: query
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("message réussie:", response.data);
            return response.status;
        } else {
            console.error("Échec message:", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error) {
        console.error("Erreur lors de message:", error);
        throw error;
    }
};


export const gameLike = async (uid1: string, uid2: string, type: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: 'game_like',
                uid1: uid1,
                uid2: uid2,
                uid3: type

            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'game_like' réussie :", response.data);
            return response.status;
        } else {
            console.error("Échec de l'action 'game_like':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error) {
        console.error("Erreur lors de l'action 'game_like':", error);
        throw error;
    }
};


export const addVisit = async (uid1: string, uid2: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: 'addVisit',
                uid1: uid1,
                uid2: uid2
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'addVisit' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'addVisit':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error) {
        console.error("Erreur lors de l'action 'addVisit':", error);
        throw error;
    }
};


export const meet = async (uid1: string, uid2: string, uid3: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "meetpremium",
                uid1: uid1,
                uid2: uid2,
                uid3: uid3,
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'meet' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'meet':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'meet':", error.message || error);
        throw new Error(`Erreur lors de l'action 'meet': ${error.message || error}`);
    }
};


export const cuser = async (uid1: string, uid2: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "cuser",
                uid1: uid1,
                uid2: uid2,
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'cuser' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'cuser':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'cuser':", error.message || error);
        throw new Error(`Erreur lors de l'action 'cuser': ${error.message || error}`);
    }
};

// modifier query
// export const message = async (idSend: string, idReceve: string, photo: string, name: string, credit: number): Promise<any> => {
export const message = async (Query: string): Promise<any> => {

    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "message",
                query: Query
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'message' réussie :", response.data);
            return response.status;
        } else {
            console.error("Échec de l'action 'message':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'message':", error.message || error);
        throw new Error(`Erreur lors de l'action 'message': ${error.message || error}`);
    }
};

export const sendMessageCredit = async (idSend: string, idReceve: string, credit: number): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "sendMessage",
                query: `${idSend}[message]${idReceve}[message]Credits[message]credits[message]${credit}`
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'Sendmessage' réussie :", response.data);
            return response.status;
        } else {
            console.error("Échec de l'action 'Sendmessage':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'Sendmessage':", error.message || error);
        throw new Error(`Erreur lors de l'action 'Sendmessage': ${error.message || error}`);
    }
};


export const updateSRadius = async (uid1: string, radius: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "updateSRadius",
                query: `${uid1},${radius}`
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'updateSRadius' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'updateSRadius':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'updateSRadius':", error.message || error);
        throw new Error(`Erreur lors de l'action 'updateSRadius': ${error.message || error}`);
    }
};

export const updateGender = async (uid1: string, genre: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "updateGender",
                query: `${uid1},${genre}`
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'updateGender' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'updateGender':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'updateGender':", error.message || error);
        throw new Error(`Erreur lors de l'action 'updateGender': ${error.message || error}`);
    }
};

export const updateAge = async (uid1: string, age: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "updateSRadius",
                query: `${uid1},18,${age}`
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'updateAge' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'updateAge':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'updateAge':", error.message || error);
        throw new Error(`Erreur lors de l'action 'updateAge': ${error.message || error}`);
    }
};

export const game = async (uid1: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "game",
                id: uid1
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'game' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'game':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'game':", error.message || error);
        throw new Error(`Erreur lors de l'action 'game': ${error.message || error}`);
    }
};

export const unreadMessageCount = async (uid1: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "unreadMessageCount",
                dID: '',
                id: uid1
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            // console.log("Action 'unreadMessageCount' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'unreadMessageCount':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'unreadMessageCount':", error.message || error);
        throw new Error(`Erreur lors de l'action 'unreadMessageCount': ${error.message || error}`);
    }
};



export const getChats = async (userId: string): Promise<any> => {
    try {
        const response = await apiClient.get('', {
            params: {
                action: "getChat",
                id: userId
            }
        });
        const responseData = response.data
        // console.log('TYPE OF CHAT', typeof responseData);
        // console.log('DATA CHATS ALL', responseData);



        if (typeof responseData === 'object') {
            if (responseData.error) {
                return responseData;
            } else {
                return responseData;
            }
        } else if (typeof responseData === 'string') {
            try {
                const jsonString = formateResponse(response.data)

                try {
                    const jsonData = JSON.parse(jsonString);
                    if (jsonData.error) {
                        // console.log("REPONSE API ERROR : ", jsonData);
                        return jsonData;
                    } else {
                        // console.log("REPONSE API : ", jsonData);
                        return jsonData;
                    }
                } catch (e) {
                    console.error('Erreur de parsing des données JSON:', e);
                    throw e;
                }
            } catch (e) {
                console.error('Erreur de parsing des données JSON:', e);
                throw new Error('Réponse inattendue, impossible de parser la chaîne JSON.');
            }
        } else {
            throw new Error('Réponse inattendue.');
        }
    } catch (error) {
        console.error('API Error', error);
        throw error;
    }
};



export const spotlight = async (userId: string): Promise<any> => {
    try {
        const response = await apiClient.get('', {
            params: {
                action: 'spotlight',
                id: userId
            }
        });
        ;

        if (typeof response.data === 'string' && response.data.startsWith('<')) {
            // Extraire le JSON à partir de la réponse
            const jsonMatch = response.data.match(/({.*})/);
            if (jsonMatch && jsonMatch[1]) {
                try {
                    const jsonData = JSON.parse(jsonMatch[1]);

                    // console.log('JSON spoteeee', jsonData);

                    return jsonData;
                } catch (e) {
                    console.error('Erreur de parsing des données JSON extraites:', e);
                    throw new Error('Réponse inattendue, impossible de parser la chaîne JSON extraite.');
                }
            } else {
                console.error('Aucune donnée JSON trouvée dans la réponse HTML.');
                throw new Error('Réponse inattendue, aucune donnée JSON trouvée.');
            }
        }

        if (typeof response.data === 'string') {
            try {
                const jsonData = JSON.parse(response.data);
                //  console.log('Parsed JSON Data: ', jsonData);
                return jsonData;
            } catch (e) {
                //    console.error('Erreur de parsing des données JSON:', e);
                throw new Error('Réponse inattendue, impossible de parser la chaîne JSON.');
            }
        } else if (typeof response.data === 'object') {
            //       console.log("RESPONSE QUESTION: ", response.data.user.question);
            return response.data;
        } else {
            throw new Error('Réponse inattendue.');
        }
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        throw error;
    }
};

export const getGif = async (): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClientGif.get('', {
            params: {
                api_key: '2n2rOkvKWUwIVyydayTpL52AK4iD9qeo'
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            // console.log("Action 'apiClientGif' réussie :", response.data);
            return response.data.data;
        } else {
            console.error("Échec de l'action 'apiClientGif':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'apiClientGif':", error.message || error);
        throw new Error(`Erreur lors de l'action 'apiClientGif': ${error.message || error}`);
    }
};

export const today = async (uid1: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "today",
                query: uid1
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'today' réussie :", response.data);
            return response.status;
        } else {
            console.error("Échec de l'action 'today':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'today':", error.message || error);
        throw new Error(`Erreur lors de l'action 'today': ${error.message || error}`);
    }
};
export const sendImage = async (base64Image: string, uid: string, rid: string): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('action', 'sendChat');
        formData.append('base64', base64Image);
        formData.append('uid', uid);
        formData.append('rid', rid);

        const response = await axios.post(
            'https://www.e-coress.com/assets/sources/appupload.php',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (response.status === 200) {
            console.log('Image envoyée avec succès :', response.data);
            return response.status;
        } else {
            console.error('Erreur lors de l\'envoi :', response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
    } catch (error: any) {
        console.error('Erreur lors de l\'envoi de l\'image :', error);
        throw error;
    }
};


export const updateUserExtendeds = async (query: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "updateUserExtended",
                query: query
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'updateUserExtended' réussie :", response.data);
            return response.status;
        } else {
            console.error("Échec de l'action 'updateUserExtended':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'updateUserExtended':", error.message || error);
        throw new Error(`Erreur lors de l'action 'updateUserExtended': ${error.message || error}`);
    }
};

export const getAllInterests = async (): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "getInterests",
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'getInterests' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'getInterests':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'getInterests':", error.message || error);
        throw new Error(`Erreur lors de l'action 'getInterests': ${error.message || error}`);
    }
};

export const getUserCredits = async (userId: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "getUserCredits",
                id: userId
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            // console.log("Action 'getUserCredits' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'getUserCredits':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'getUserCredits':", error.message || error);
        throw new Error(`Erreur lors de l'action 'getUserCredits': ${error.message || error}`);
    }
};

export const getConfigAbonnement = async (): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "getConfigAbonnementData",
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'getConfigAbonnementData' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'getConfigAbonnementData':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'getConfigAbonnementData':", error.message || error);
        throw new Error(`Erreur lors de l'action 'getConfigAbonnementData': ${error.message || error}`);
    }
};



export const add_interest = async (uid: string, uidInteret: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "add_interest",
                query: `${uid},${uidInteret}`
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'add_interest' réussie :", response.data);
            return response.status;
        } else {
            console.error("Échec de l'action 'add_interest':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'add_interest':", error.message || error);
        throw new Error(`Erreur lors de l'action 'add_interest': ${error.message || error}`);
    }
};


export const updateUserBio = async (uid: string, bio: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "updateUserBio",
                query: `${uid}[divider]${bio}[divider]** message **`
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'updateUserBio' réussie :", response.data);
            return response.status;
        } else {
            console.error("Échec de l'action 'updateUserBio':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'updateUserBio':", error.message || error);
        throw new Error(`Erreur lors de l'action 'updateUserBio': ${error.message || error}`);
    }
};

export const updateProfilAll = async (
    username: string,
    email: string,
    name: string,
    day: string,
    month: string,
    year: string,
    gender: string,
    lang: string,
    city: string,
    country: string,
    lat: string,
    lng: string,
    editEmail: string,
    editUsername: string,
    editId: string
): Promise<any> => {
    try {
        // Création de l'objet FormData
        const formData = new FormData();
        formData.append('action', 'updateApp');
        formData.append('username', username);
        formData.append('email', email);
        formData.append('name', name);
        formData.append('day', day);
        formData.append('month', month);
        formData.append('year', year);
        formData.append('gender', gender);
        formData.append('lang', lang);
        formData.append('city', city);
        formData.append('country', country);
        formData.append('lat', lat);
        formData.append('lng', lng);
        formData.append('editEmail', editEmail);
        formData.append('editUsername', editUsername);
        formData.append('editId', editId);



        // Effectuer la requête POST avec FormData
        const response = await apiClientUser.post('', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("UPDATE envoyée avec succès :", response.data);
            return response.data; // Retourner les données de la réponse
        } else {
            console.error("Échec de l'envoi de l'UPDATE:", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
    } catch (error: any) {
        console.error("Erreur lors de l'envoi de l'UPDATE:", error.message || error);
        throw new Error(`Erreur lors de l'envoi de l'UPDATE: ${error.message || error}`);
    }
};

export const uploadImage = async (file: { uri: string; name: string; type: string }) => {
    const formData = new FormData();

    formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type,
    } as any);

    try {
        const response = await axios.post('https://www.e-coress.com/assets/sources/upload.php', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
            },
        });

        console.log('Image uploadée avec succès:', response.data);
    } catch (error: any) {
        console.error('Erreur lors de l\'envoi de l\'image:', error.response?.data || error.message);
    }
};


export const uploadBase64Image = async (base64Image: string) => {
    try {
        const response = await axios.post('https://www.e-coress.com/assets/sources/appBase64upload.php', {
            base64: base64Image,
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Upload response:', response.data);
        if (response.data.status === 'ok') {
            console.log('Image URL:', response.data.path);
            console.log('Thumbnail URL:', response.data.thumb);
            return response.data
        } else {
            console.error('Upload failed:', response.data.message);
        }
    } catch (error) {
        console.error('Error uploading image:', error);
    }
};


export const uploadMedia = async (
    path: string,
    thumb: string,
): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('action', 'uploadMedia');
        formData.append('media[0][status]', 'ok');
        formData.append('media[0][video]', '0');
        formData.append('media[0][path]', `https://www.e-coress.com/assets/sources/${path}`);
        formData.append('media[0][thumb]', `https://www.e-coress.com/assets/sources/${thumb}`);


        // Effectuer la requête POST avec FormData
        const response = await apiClientBello.post('', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("uploadMedia envoyée avec succès :", response.data);
            return response.data; // Retourner les données de la réponse
        } else {
            console.error("Échec de l'envoi de l'uploadMedia:", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
    } catch (error: any) {
        console.error("Erreur lors de l'envoi de l'uploadMedia:", error.message || error);
        throw new Error(`Erreur lors de l'envoi de l'uploadMedia: ${error.message || error}`);
    }
};

export const messageChat = async (Query: string): Promise<any> => {

    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "message",
                query: Query
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'message' réussie :", response.data);
            return response.status;
        } else {
            console.error("Échec de l'action 'message':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'message':", error.message || error);
        throw new Error(`Erreur lors de l'action 'message': ${error.message || error}`);
    }
};


export const manageImage = async (
    uid: string,
    pid: string,
    profile: string,
    block: string,
    unblock: string,
    story: string,
    del: string,
): Promise<any> => {
    try {
        // Création de l'objet FormData
        const formData = new FormData();
        formData.append('action', 'manage');
        formData.append('uid', uid);
        formData.append('pid', pid);
        formData.append('profile', profile);
        formData.append('block', block);
        formData.append('unblock', unblock);
        formData.append('story', story);
        formData.append('del', del);


        // Effectuer la requête POST avec FormData
        const response = await apiClient.post('', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("UPDATE envoyée avec succès :", response.data);
            return response.status; // Retourner les données de la réponse
        } else {
            console.error("Échec de l'envoi de l'UPDATE:", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
    } catch (error: any) {
        console.error("Erreur lors de l'envoi de l'UPDATE:", error.message || error);
        throw new Error(`Erreur lors de l'envoi de l'UPDATE: ${error.message || error}`);
    }
};



export const discover100 = async (id: string): Promise<any> => {

    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "discover100",
                query: `${id},200`
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'discover100' réussie :", response.data);
            return response.status;
        } else {
            console.error("Échec de l'action 'discover100':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'discover100':", error.message || error);
        throw new Error(`Erreur lors de l'action 'discover100': ${error.message || error}`);
    }
};

export const addToSpotlight = async (id: string): Promise<any> => {

    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "addToSpotlight",
                query: id
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'discover100' réussie :", response.data);
            return response.status;
        } else {
            console.error("Échec de l'action 'discover100':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'discover100':", error.message || error);
        throw new Error(`Erreur lors de l'action 'discover100': ${error.message || error}`);
    }
};

export const raiseUpF = async (id: string): Promise<any> => {

    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "riseUp",
                query: `${id},150`
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'raiseUp' réussie :", response.data);
            return response.status;
        } else {
            console.error("Échec de l'action 'raiseUp':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'raiseUp':", error.message || error);
        throw new Error(`Erreur lors de l'action 'raiseUp': ${error.message || error}`);
    }
};

export const getMatches = async (iduser: string): Promise<any> => {

    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "getMatches",
                id: iduser
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'getMatches' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'getMatches':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'getMatches':", error.message || error);
        throw new Error(`Erreur lors de l'action 'getMatches': ${error.message || error}`);
    }
};

export const getVisitors = async (iduser: string): Promise<any> => {

    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "getVisitors",
                id: iduser
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'getMatches' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'getMatches':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'getMatches':", error.message || error);
        throw new Error(`Erreur lors de l'action 'getMatches': ${error.message || error}`);
    }
};

export const initiatePayement = async (
    amount: string,
): Promise<any> => {
    try {
        // Création de l'objet FormData
        const formData = new FormData();
        formData.append('amount', amount);

        // Effectuer la requête POST avec FormData
        const response = await apiInitialisationPayement.post('', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("initiatePayement envoyée avec succès :", response.data);
            return response.data; // Retourner les données de la réponse
        } else {
            console.error("Échec de l'envoi de l'initiatePayement:", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
    } catch (error: any) {
        console.error("Erreur lors de l'envoi de l'initiatePayement:", error.message || error);
        throw new Error(`Erreur lors de l'envoi de l'initiatePayement: ${error.message || error}`);
    }
};

export const getGifts = async (): Promise<any> => {

    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: "getGifts",
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'getGifts' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'getGifts':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'getGifts':", error.message || error);
        throw new Error(`Erreur lors de l'action 'getGifts': ${error.message || error}`);
    }
};


export const getLocal = async (local: string): Promise<any> => {

    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClientLocal.get('', {
            params: {
                q: local,
                limit: '10',
                appid: '96bd8d6bc5ab8c519e9dfff3c684a3d0'
            }
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log("Action 'getLocal' réussie :", response.data);
            return response.data;
        } else {
            console.error("Échec de l'action 'getLocal':", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

    } catch (error: any) {
        console.error("Erreur lors de l'action 'getLocal':", error.message || error);
        throw new Error(`Erreur lors de l'action 'getLocal': ${error.message || error}`);
    }
};



export const registerUserNew = async (
    name: string,
    username: string,
    email: string,
    pass: string,
    day: string,
    month: string,
    year: string,
    gender: string,
    looking: string,
    city: string,
    country: string,
    lat: string,
    lng: string
): Promise<any> => {
    try {
        // Création de l'objet FormData
        const formData = new FormData();
        formData.append('action', 'register');
        formData.append('username', username);
        formData.append('pass', pass);
        formData.append('email', email);
        formData.append('name', name);
        formData.append('day', day);
        formData.append('month', month);
        formData.append('year', year);
        formData.append('gender', gender);
        formData.append('city', city);
        formData.append('country', country);
        formData.append('lat', lat);
        formData.append('lng', lng);
        formData.append('looking', looking);
        formData.append('ref', '');
        formData.append('photo', '');
        formData.append('checkbox', 'OK');



        // Effectuer la requête POST avec FormData
        const response = await apiClientUser.post('', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Vérification du statut de la réponse
        if (response.status === 200) {
            console.log('Name : ', name);
            console.log("register envoyée avec succès :", response.data);
            return response.status; // Retourner les données de la réponse
        } else {
            console.error("Échec de l'envoi de l'register:", response.status, response.statusText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
    } catch (error: any) {
        console.error("Erreur lors de l'envoi de l'register:", error.message || error);
        throw new Error(`Erreur lors de l'envoi de l'register: ${error.message || error}`);
    }
};
