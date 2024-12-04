import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, View, Animated, Text, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '@/service/translate';
import { router } from 'expo-router';
import { Image, TouchableOpacity } from 'react-native';
import Input from '@/components/input/InputText';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/assets/style/style.color';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { game, gameLike, updateAge, updateCredits, updateGender, updateSRadius, userProfil } from '@/request/ApiRest';
import { login } from '@/store/userSlice';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
interface GameDataItem {
  age: string;
  bio: string;
  city: string;
  discoverPhoto: string;
  distance: string;
  error: number;
  full: object; // Remplacez par un type précis si disponible
  id: string;
  isFan: number;
  name: string;
  photo: string;
  photos: any[]; // Remplacez par un type précis si nécessaire
  status: number;
  stories: string;
  story: string;
  total: string;
}

interface GameResponse {
  game: GameDataItem[];
}
export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.user);
  const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);

  const t = translations[lang];
  const [liked, setLiked] = useState(false);
  const [scaleValue] = useState(new Animated.Value(0));

  const [heartShown, setHeartShown] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const floatingHeart = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current; // Rotation de la carte
  const [isEnd, setIsEnd] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const [gender, setGender] = useState('');
  const [maxAge, setMaxAge] = useState<number>(18);
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState<number>(1);
  const [gameData, setGameData] = useState<GameDataItem[]>([]);
  const [gameDataError, setgameDataError] = useState('');

  const [isAlert, setisAlert] = useState(false);
  const [creditSend, setcreditSend] = useState<number | null>(null);

  const [setSolde, setsetSolde] = useState<number>(0);
  const [soldeInsuffisant, setSoldeInsuffisant] = useState(false);

  const dataImage = [
    { id: 1, Image: require('../../assets/images/tarif/img1.png') },
    { id: 2, Image: require('../../assets/images/tarif/img2.png') },
    { id: 3, Image: require('../../assets/images/tarif/img3.png') },
    { id: 4, Image: require('../../assets/images/tarif/img4.png') },
    { id: 5, Image: require('../../assets/images/tarif/img5.png') },
    { id: 6, Image: require('../../assets/images/tarif/img6.png') },
    { id: 7, Image: require('../../assets/images/tarif/img7.png') },
  ];



  const closeTarif = () => {
    setSoldeInsuffisant(false);
  };
  const getSolde = async () => {
    const resultData = await userProfil(auth.idUser);
    setsetSolde(resultData.user.credits)
    console.log('SOLDE', resultData.user.credits);

  };
  const getData = async () => {
    const resultData = await userProfil(auth.idUser);
    setMaxAge(Number(resultData.user.sage || 18));
    setGender(resultData.user.s_gender || '');
    setDistance(Number(resultData.user.s_radius || 1));
  };
  const closeAlert = () => {
    setisAlert(false);
  };

  const getGame = async () => {
    try {
      const reponseGame = await game(auth.idUser)
      console.log('game', reponseGame);
      if (reponseGame.game === 'error') {
        setgameDataError(reponseGame.game)
        setIsEnd(true)
      } else {
        setIsEnd(false)
        setGameData(reponseGame.game)
      }
    } catch (error) {
      console.log("diso");
    }
  }
  const sendUpdate = async (field: string, value: string | number) => {
    try {
      let resultData;
      switch (field) {
        case 'age':
          resultData = await updateAge(auth.idUser, value.toString());
          break;
        case 'gender':
          resultData = await updateGender(auth.idUser, value as string);
          break;
        case 'distance':
          resultData = await updateSRadius(auth.idUser, value.toString());
          break;
        default:
          return;
      }
      console.log(`Update successful for ${field}:`, resultData);

      // Teste
      dispatch(login(resultData));
      getGame()
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };
  useEffect(() => {
    getData()
    getGame()
    getSolde()
  }, []);



  useFocusEffect(
    useCallback(() => {
      getGame();
      getSolde()
    }, [])
  );

  useEffect(() => {
    sendUpdate('age', maxAge);
    sendUpdate('gender', gender);
    sendUpdate('distance', distance);
    getGame()
  }, [maxAge, gender, distance]);


  const handleNextCard = () => {
    if (currentIndex < gameData.length - 1) {
      Animated.sequence([
        Animated.timing(rotate, {
          toValue: -10,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -screenWidth,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        rotate.setValue(0);
        translateX.setValue(0);
        setCurrentIndex(currentIndex + 1);
      });
    } else {
      setIsEnd(true); // Définir la fin
      console.log('Fin des cartes.');
    }
  };
  const handleHeartPress = (uid1: string, uid2: string) => {
    if (!liked) {
      if (setSolde > 0) {
        setLiked(true);

        // Lancer l'animation du cœur flottant
        setHeartShown(true);
        Animated.sequence([
          Animated.timing(floatingHeart, {
            toValue: 1,  // Va de bas en haut
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(floatingHeart, {
            toValue: 0,  // Réinitialise après disparition
            duration: 0,
            useNativeDriver: true,
          }),
        ]).start(() => setHeartShown(false));  // Cacher le cœur après animation
        setTimeout(() => {
          setcreditSend(1)

          const gameLikeFunc = async () => {
            const addVisitUpdate = await updateCredits(uid1, '1', '1', 'Credits for like')
            console.log("Addvisit : ", addVisitUpdate);
            const gameLikeResponse = await gameLike(uid1, uid2, '1')
            console.log('LIKE', gameLikeResponse);
            if (gameLikeResponse === 200) {
              setisAlert(true)
              setTimeout(() => {
                closeAlert()
              }, 1500);
            }

          };
          gameLikeFunc()
          handleNextCard()
        }, 2000);
      } else {
        setSoldeInsuffisant(true)
      }
    }
  };

  const handleClosePress = () => {
    setLiked(false);
    handleNextCard()
  };

  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };
  const senUpdate = () => {
    console.log("ato modal");

    sendUpdate('age', maxAge);
    sendUpdate('gender', gender);
    sendUpdate('distance', distance);
    setIsFilterModalVisible(!isFilterModalVisible);
  };


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC' }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t.meeting}</ThemedText>
        <TouchableOpacity onPress={toggleFilterModal} style={styles.filterButton}>
          <Icon name="options-outline" size={30} color={COLORS.darkBlue} />
        </TouchableOpacity>
      </ThemedView>
      {gameData && gameData.length > 0 && !isEnd ? (
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [
                { translateX },
                {
                  rotate: rotate.interpolate({
                    inputRange: [-10, 0],
                    outputRange: ['-10deg', '0deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={{ uri: `${gameData[currentIndex]?.photo}` }}
            style={styles.stepImage}
            resizeMode="cover"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClosePress}>
              <Icon name="close-outline" size={40} color={COLORS.bg1} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heartButton} onPress={() => handleHeartPress(auth.idUser, gameData[currentIndex].id)}>
              <Icon
                name={liked ? 'heart' : 'heart-outline'}
                size={40}
                color={liked ? COLORS.red : COLORS.white}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.textOverlay}>
            <View style={styles.nameContainer}>
              <View>
                <ThemedText type="midleText">
                  {gameData[currentIndex].name}, {gameData[currentIndex].age}
                </ThemedText>
                <ThemedText type="defaultSemiBold2">
                  {gameData[currentIndex].city}
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={() => {
                  router.push(
                    `/Chat?userId=${gameData[currentIndex].id}&userName=${gameData[currentIndex].name}&profilePic=${gameData[currentIndex].photo}`
                  );
                }}
              >
                <Icon
                  name="chatbubble-ellipses-outline"
                  size={35}
                  color={COLORS.jaune}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      ) : (
        <View style={styles.last}>
          <View style={styles.center}>
            <ThemedText type="midleText">{t.sug1}</ThemedText>
            <ThemedText type="defaultSemiBold">{t.sug3}</ThemedText>
            <ThemedText type="defaultSemiBold">{t.sug4}</ThemedText>
          </View>
        </View>
      )
      }
      <Modal
        isVisible={isFilterModalVisible}
        onBackdropPress={toggleFilterModal}
        style={styles.modal}
      >
        <View style={styles.filterModalContent}>
          <ThemedText type='defaultSemiBold'>{t.showMe}</ThemedText>
          <Picker
            selectedValue={gender}
            style={styles.picker}
            onValueChange={(itemValue: React.SetStateAction<string>) => setGender(itemValue)}
          >
            <Picker.Item label={t.homme} value="1" />
            <Picker.Item label={t.femme} value="2" />
            <Picker.Item label={t.lesbienne} value="3" />
            <Picker.Item label={t.gay} value="4" />
            <Picker.Item label={t.All} value="5" />
          </Picker>

          <View style={styles.filterRange}>
            <ThemedText type='defaultSemiBold'>{t.age}</ThemedText>
            <View style={styles.cardAge}>
              <ThemedText type='defaultSemiBold'>18</ThemedText>
              <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={80}
                step={1}
                value={maxAge}
                onValueChange={(value: React.SetStateAction<number>) => setMaxAge(value)}
              />
              <ThemedText type='defaultSemiBold'>{maxAge}</ThemedText>
            </View>
          </View>
          <Input label={t.findByEmail} value={email} onChangeText={setEmail} />

          <View style={styles.filterRange}>
            <Input label={'Localisation'} value={location} placeholder={t.localisationInconu} onChangeText={setLocation} />
            <ThemedText type='defaultSemiBold'>{distance} KM</ThemedText>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={50}
              step={1}
              value={distance}
              onValueChange={(value: React.SetStateAction<number>) => setDistance(value)}
            />
          </View>

          <TouchableOpacity onPress={senUpdate} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>{t.applyFilter}</Text>
          </TouchableOpacity>
        </View>
      </Modal>


      {gameData && (
        <Modal
          isVisible={isAlert}
          onBackdropPress={closeAlert}
          style={styles.modal}
        >
          <View style={styles.modalOverlay}>

            <View style={styles.modalAlert}>
              <Icon name="rocket-outline" size={30} color={COLORS.jaune} />
              <ThemedText>{t.spend1} {creditSend} {t.spend2} </ThemedText>
            </View>
          </View>

        </Modal>
      )}

      <Modal
        isVisible={soldeInsuffisant}
        onBackdropPress={closeTarif}
        style={styles.modal}
      >

        <View style={styles.filterModalContent1}>
          <TouchableOpacity onPress={closeTarif} style={styles.notNowBtn}>
            <Text style={styles.notNow}>{t.notNow}</Text>
          </TouchableOpacity>

          <FlatList
            data={dataImage}
            horizontal
            renderItem={({ item }) => (
              <View style={styles.containeImage}>
                <Image
                  source={item.Image} // Directement l'objet require()
                  style={styles.stepImage1}
                  resizeMode="contain"
                />
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
          <View style={styles.notNowBtn}>
            <Text style={styles.notNow}>{t.pack}</Text>
          </View>
          <TouchableOpacity onPress={() => { }} style={styles.btnPack}>
            <Text style={styles.notNow}>1001 Credits</Text>
            <Text style={styles.notNow}>4.99Eur</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }} style={styles.btnPack}>
            <Text style={styles.notNow}>2501 Credits</Text>
            <Text style={styles.notNow}>9.99Eur</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }} style={styles.btnPack}>
            <Text style={styles.notNow}>5000 Credits</Text>
            <Text style={styles.notNow}>14.99Eur</Text>
          </TouchableOpacity>



        </View>
      </Modal>

    </ParallaxScrollView >

  );
}



const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 50,
    justifyContent: 'space-between'
  },
  filterButton: {
    padding: 10,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  cardContainer: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.7,
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'red',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    position: 'relative',
    overflow: 'hidden',


    shadowRadius: 4,
    elevation: 3,
  },
  center: {
    textAlign: 'center',
    alignItems: 'center'
  },
  last: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.7,
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    // position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10
  },
  stepImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  stepImage1: {

    width: 360,
    height: 250,
    margin: 3

  },
  containeImage: {

    // // height: 200,
    // backgroundColor: 'blue',
    // justifyContent: 'center', // Centre verticalement
    // alignItems: 'center',    // Centre horizontalement
  },

  textOverlay: {
    position: 'absolute',
    bottom: 5,
    marginHorizontal: '2%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'white',
    width: '96%',
    borderRadius: 5,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,

    overflow: 'hidden',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  icon: {
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    backgroundColor: COLORS.darkBlue,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  modalName: {

  },
  buttonContainer: {
    position: 'absolute',
    top: 200,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  heartButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.bg1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Style pour le cœur flottant
  floatingHeart: {
    position: 'absolute',
    bottom: 100,
    left: '45%',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
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
  modalAlert: {
    backgroundColor: "#fff",
    height: 100,
    width: "100%",
    borderRadius: 10,
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  modalContent: {
    width: '95%',
    height: '90%',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  filterModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%'
    // maxHeight: '80%',
  },
  filterModalContent1: {
    backgroundColor: 'white',
    borderRadius: 10,

    width: '100%'
    // maxHeight: '80%',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',


  },
  filterRange: {
    marginVertical: 10,
  },
  cardAge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {
    width: '80%',
    marginVertical: 5,
  },
  filterInput: {
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  applyButton: {
    backgroundColor: COLORS.jaune,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
  },
  notNow: {
    color: 'black',
    fontSize: 18,
  },
  notNowBtn: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bg1,
    paddingBottom: 10,
    paddingVertical: 10
  },
  btnPack: {
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.bg1,
    paddingBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5
  }

});

