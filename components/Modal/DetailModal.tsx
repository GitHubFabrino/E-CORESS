import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { COLORS } from '@/assets/style/style.color';

interface DetailModalProps {
    isVisible: boolean;
    onClose: () => void;
    item: {
        name: string;
        imageSources: any[];
    } | null;
}

const DetailModal: React.FC<DetailModalProps> = ({ isVisible, onClose, item }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!item) return null;

    const handleNextImage = () => {
        const nextIndex = (currentImageIndex + 1) % item.imageSources.length;
        setCurrentImageIndex(nextIndex);
    };

    const handlePreviousImage = () => {
        const prevIndex = (currentImageIndex - 1 + item.imageSources.length) % item.imageSources.length;
        setCurrentImageIndex(prevIndex);
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
            <View style={styles.modalContent}>
                <Image source={item.imageSources[currentImageIndex]} style={styles.modalImage} resizeMode="cover" />
                <View style={styles.modalOverlay}>
                    <View style={styles.modalHeader}>
                        <ThemedText type="title" style={styles.modalName}>{item.name}</ThemedText>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={30} color={COLORS.bg1} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.navButton} onPress={handlePreviousImage}>
                            <Icon name="chevron-back" size={24} color={COLORS.bg1} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.messageButton}>
                            <Icon name="chatbubble-outline" size={30} color={COLORS.white} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButton} onPress={handleNextImage}>
                            <Icon name="chevron-forward" size={24} color={COLORS.bg1} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        height: '80%',
        backgroundColor: 'transparent',
        position: 'relative',
    },
    modalImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        backgroundColor: COLORS.darkBlue,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    closeButton: {
        backgroundColor: 'transparent',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navButton: {
        backgroundColor: COLORS.white,
        borderRadius: 50,
        padding: 10,
    },
    messageButton: {
        backgroundColor: COLORS.bg1,
        borderRadius: 50,
        padding: 20,
    },
});

export default DetailModal;
