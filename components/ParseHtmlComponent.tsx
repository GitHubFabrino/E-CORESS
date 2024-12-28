import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import { COLORS } from '@/assets/style/style.color';
import he from 'he';

const ParseHtmlToComponents: React.FC<{ html: string, isMe: boolean }> = ({ html, isMe }) => {
    const [htmltext, setHtmltext] = useState<string>('');
    const [imageSrc, setImageSrc] = useState<string | null>(null); // Déclarer comme null pour mieux gérer les cas sans image
    // const [isme, setisMe] = useState(isMe);

    useEffect(() => {
        // Regex pour trouver les balises HTML
        const hasHtmlTags = /<\/?[a-zA-Z][\s\S]*>/;

        if (hasHtmlTags.test(html)) {
            // Regex pour trouver le texte entre les balises <b>
            const textRegex = /<b>(.*?)<\/b>/;
            const textMatch = textRegex.exec(html);
            if (textMatch) {
                const textCorrect = he.decode(textMatch[1]);
                setHtmltext(textMatch[1]);
                console.log(textMatch[1]); // Affiche "Just sent you 100 Credits!"
            } else {
                // Si aucune balise <b> n'est trouvée, afficher le texte brut sans balises
                setHtmltext(html.replace(/<\/?[^>]+>/g, ''));
                console.log("Aucun texte trouvé entre les balises <b>, texte brut affiché");
            }

            // Regex pour trouver l'attribut src dans les balises <img>
            const imgRegex = /<img\s+src="([^"]+)"[^>]*>/;
            const imgMatch = imgRegex.exec(html);

            if (imgMatch) {
                setImageSrc(imgMatch[1]);
                console.log(imgMatch[1]); // Affiche l'URL de l'image
            } else {
                console.log("Aucun src trouvé dans les balises <img>");
            }
        } else {
            // Si aucune balise HTML, afficher le texte brut

            setHtmltext(he.decode(html));
            console.log("Pas de balises HTML trouvées, texte brut affiché");
        }
    }, [html]);

    return (
        <View style={[styles.container, isMe ? { backgroundColor: COLORS.jaune } : { backgroundColor: COLORS.bg1 }]} >
            <Text style={[isMe ? { color: COLORS.bg1 } : { color: COLORS.white }]}>{htmltext}</Text>
            {imageSrc ? <Image source={{ uri: imageSrc }} style={{ width: 34, height: 34, marginHorizontal: 10 }} /> : null}
        </View>
    );
};

// StyleSheet (si nécessaire)
const styles = StyleSheet.create({

    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: COLORS.jaune,
        padding: 10,
        borderRadius: 10
    }

});

export default ParseHtmlToComponents;
