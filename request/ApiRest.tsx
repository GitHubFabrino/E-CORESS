

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
// export const authenticateUser = async (email: string, password: string): Promise<any> => {
//     try {
//         const response = await apiClient.get('', {
//             params: {
//                 action: 'login',
//                 login_email: email,
//                 login_pass: password,
//                 dID: 0,
//             }
//         });

//         const responseData = response.data;
//         console.log("DATA", responseData);

//         if (typeof responseData === 'object') {
//             if (responseData.error) {
//                 return responseData;
//             } else {
//                 return responseData;
//             }
//         } else if (typeof responseData === 'string') {
//             try {
//                 const jsonData = JSON.parse(responseData);
//                 if (jsonData.error) {
//                     return jsonData;
//                 } else {
//                     return jsonData;
//                 }
//             } catch (e) {
//                 console.error('Erreur de parsing des données JSON:', e);
//                 throw new Error('Réponse inattendue, impossible de parser la chaîne JSON.');
//             }
//         } else {
//             throw new Error('Réponse inattendue.');
//         }
//     } catch (error) {
//         console.error("Erreur lors de l'authentification:", error);
//         throw error;
//     }
// };


// export const fetchUserData = async (): Promise<string> => {
//     const url = 'https://www.e-coress.com/requests/apiService.php';
//     const data = new URLSearchParams({
//         action: 'meet_filter',
//         age: '18,57',
//         gender: '2',
//         radius: '36',
//         online: '0',
//         limit: '0',
//         username: ''
//     });

//     const config = {
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Cookie': 'user=49; Path=/requests; Expires=Tue, 19 Jan 2038 03:14:07 GMT;'
//         }
//     };

//     try {
//         const response = await axios.post(url, data.toString(), config);
//         console.log("fetch data meet : ", response.data); // Traiter les données ici
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return ''
//     }
// };

export const fetchUserData = async (
    age: string,
    gender: string,
    radius: string,
    online: string,
    limit: string,
    username: string
): Promise<string> => {
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
        return '';
    }
};
const extractData = (html: string) => {
    const data = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const userCards = tempDiv.getElementsByClassName('search');
    for (let i = 0; i < userCards.length; i++) {
        const card = userCards[i];

        const profileLinkElement = card.querySelector('h1 a') as HTMLAnchorElement | null;
        const nameElement = card.querySelector('h1 a') as HTMLAnchorElement | null;
        const locationElement = card.querySelector('.loc span') as HTMLSpanElement | null;
        const photoElement = card.querySelector('.profile-photo') as HTMLImageElement | null;

        const profileLink = profileLinkElement ? profileLinkElement.href : 'Link unknown';
        const name = nameElement ? nameElement.innerText : 'Name unknown';
        const age = name.split(',')[1]?.trim() || 'Age unknown';
        const location = locationElement ? locationElement.innerText : 'Location unknown';
        const photoUrl = photoElement ? photoElement.getAttribute('data-src') || '' : '';

        data.push({ profileLink, name, age, location, photoUrl });
    }
    return data;
};
// Appel de la fonction


export const authenticateUser = async (email: string, password: string): Promise<any> => {
    try {
        const response = await apiClient.get('', {
            params: {
                action: 'login',
                login_email: email,
                login_pass: password,
                dID: 0,
            }
        });
        // Vérifier si la réponse contient des cookies
        const cookies = response.headers['set-cookie'];
        const cookies2 = response.headers;
        console.log('Cookies1:', cookies);
        console.log('Cookies2:', cookies2);

        // Stockage de chaque cookie dans AsyncStorage
        if (cookies && cookies.length > 0) {

            await AsyncStorage.setItem('session_cookie', cookies[0]);

        }

        // console.log('storage : ', await AsyncStorage.getItem('session_cookie'));
        // console.log("Raw Response:", response); // Afficher la réponse brute
        const responseData = response.data;

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

}): Promise<any> => {
    try {

        console.log("DATA API : ", userData);

        const response = await apiClient.get('', {
            params: {
                action: "register",
                reg_email: userData.reg_email,
                reg_pass: userData.reg_pass,
                reg_name: userData.reg_name,
                reg_gender: userData.reg_gender,
                reg_birthday: userData.reg_birthday,
                reg_looking: userData.reg_looking,
                reg_city: userData.reg_city,
                reg_username: userData.reg_username
            }
        });
        const responseData = response.data

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
        // console.log("RESPONSE BRUTE : ", response.data);
        // console.log("RESPONSE BRUTE : ", JSON.stringify(response.data, null, 2));

        // console.log('RESPONSE TYPE ', typeof response.data);
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

                    console.log('JSON spoteeee', jsonData);

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



export const getChats = async (userId: string): Promise<any> => {
    try {
        const response = await apiClient.get('', {
            params: {
                action: "getChat",
                id: userId
            }
        });
        const responseData = response.data
        console.log('TYPE OF CHAT', typeof responseData);
        console.log('DATA CHATS ALL', responseData);



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


// //solution 1
// // console.log("RESPONSE BRUTE : ", response.data);
// console.log("RESPONSE BRUTE : ", JSON.stringify(response.data, null, 2));
// const jsonString = JSON.stringify(response.data, null, 2)
// // Supprimer toutes les balises HTML
// const a = jsonString.replace(/<\/?[^>]+>/g, "");
// //  console.log("JSON SANS HTML", a);
// const cleanString = a.replace(/\s/g, "");
// const withoutBracesString = cleanString.replace(/^\{|\}$/g, "");
// // Parse the cleaned string into a JavaScript object
// const jsonObject = JSON.parse(cleanString);
// console.log("JSON OK", jsonObject.user.question);




     // const jsonString = formateResponse(response.data)



        // // Nettoyer et parser les données JSON
        // try {
        //     const jsonData = JSON.parse(jsonString);
        //     const json2 = extractJsonFromResponse(response.data)

        //     console.log('JSONDATAERROR : ', jsonData.error);
        //     console.log('JSONDATA1: ', jsonData);
        //     console.log('JSONDATA2: ', json2);


        //     if (jsonData.error) {
        //         return jsonData; // Retourner l'objet d'erreur
        //     } else {
        //         // console.log('data ici : ', jsonData);

        //         return jsonData; // Retourner les données utilisateur
        //     }
        // } catch (e) {
        //     console.error('Erreur de parsing des données JSON:', e);
        //     throw e;
        // }
