import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '@/assets/style/style.color';
import { ThemedText } from '@/components/ThemedText';




const MostPopular: React.FC = () => {

    return (
        <View style={styles.container}>
            <ThemedText>MostPopular</ThemedText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginTop: 25
    },

});

export default MostPopular;
