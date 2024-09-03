
import axios from 'axios';

// Créez une instance Axios avec la configuration souhaitée
const apiClient = axios.create({
    baseURL: 'https://www.e-coress.com/requests/api.php',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    },
});

// Fonction pour authentifier un utilisateur
export const authenticateUser = async (email: string, password: string): Promise<any> => {
    try {
        // Effectuer la requête GET avec les paramètres nécessaires
        const response = await apiClient.get('', {
            params: {
                action: 'login',
                login_email: email,
                login_pass: password,
                dID: 0, // Incluez ce paramètre si nécessaire, sinon vous pouvez le retirer
            }
        });

        // Récupérer la réponse sous forme de texte
        const responseText = response.data;

        // Trouver l'index du premier caractère `{`
        const jsonStartIndex = responseText.indexOf('{');
        if (jsonStartIndex === -1) {
            throw new Error('Aucune donnée JSON trouvée dans la réponse.');
        }

        // Extraire la partie JSON de la réponse
        const jsonString = responseText.substring(jsonStartIndex);

        // Nettoyer et parser les données JSON
        try {
            const jsonData = JSON.parse(jsonString);
            if (jsonData.error) {
                return jsonData; // Retourner l'objet d'erreur
            } else {
                // console.log('data ici : ', jsonData);

                return jsonData; // Retourner les données utilisateur
            }
        } catch (e) {
            console.error('Erreur de parsing des données JSON:', e);
            throw e;
        }
    } catch (error) {
        console.error("Erreur lors de l'authentification:", error);
        throw error;
    }
};
