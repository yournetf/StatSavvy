import { useContext, useRef, useState, useEffect } from 'react';
import { UserContext } from '../App';
import { DBContext } from '../App';
import { StyleSheet, Platform, View, Text, Image, Touchable, Switch} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import LottieView from 'lottie-react-native';
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase imports
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DevSettings } from 'react-native';

const settings = [{
    name: "Tyreek Hill",
    data: [ 
        { icon: 'user-cog', key: 'Account & Settings', value: "" },
        { icon: 'star', key: 'Favorite Team', value: "" }, 
        { icon: 'user-friends', key: 'Invite Friends', value: "" },
        { icon: 'bell', key: 'Notifications', value: "" },
        { icon: 'paint-roller', key: 'Themes', value: "" }, 
    ]
  }];

export default function Settings({ navigation }){

    const user = useContext(UserContext);
    const auth = user[2];

    const db = useContext(DBContext);

    const color1 = user[1].theme[0];
    const color2 = user[1].theme[1];
    const color3 = user[1].theme[2];
    const color4 = user[1].theme[3];

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null); // State for storing the profile picture URL
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProfilePicture = async () => {
            const docRef = doc(db, 'UserInfo', user[0].email);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfilePictureUrl(data.profilePicture); // Set the profile picture URL
            } else {
                console.log("No such document!");
            }
        };
        fetchProfilePicture();
    }, [user]);

    // Function to open image picker and upload to Firebase
    const openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            const imageUri = pickerResult.assets[0].uri;
            await uploadImageToFirebase(imageUri);
        }
    };

    // Function to upload image to Firebase
    const uploadImageToFirebase = async (imageUri) => {
        try {
            setUploading(true);
            const response = await fetch(imageUri);
            const blob = await response.blob();

            const storage = getStorage();
            const storageRef = ref(storage, `profilePictures/${user[0].email}_profile.jpg`);

            const snapshot = await uploadBytes(storageRef, blob);
            console.log('Image uploaded successfully', snapshot);

            const downloadUrl = await getDownloadURL(snapshot.ref);
            console.log('Download URL:', downloadUrl);

            // Store the download URL in Firestore
            await updateDoc(doc(db, 'UserInfo', user[0].email), {
                profilePicture: downloadUrl
            });

            setProfilePictureUrl(downloadUrl); // Update the state with the new URL
        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setUploading(false);
            setTimeout(()=>{
                DevSettings.reload();
            }, 100);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: color1 }]}>
            <View style={styles.accountHeader}>
                <TouchableOpacity onPress={openImagePickerAsync} style={styles.accountImage}>
                    
                    {!profilePictureUrl ? 
                        <LottieView
                            source={require("../assets/ImageLoadAnimation.json")}
                            loop
                            autoPlay
                            style={styles.accountImage}
                        />
                        : 
                        <Image
                            source={{ uri: profilePictureUrl || 'https://picsum.photos/50/50' }} // Fallback image
                            style={styles.accountImage}
                        />
                    }
                    
                </TouchableOpacity>
                <View style={styles.accountUsernameView}>
                    <Text style={styles.accountUsername}>{user[0].email}</Text>
                    <Ionicons name="checkmark-circle" size={32} color={color3} style={{ top: 5, paddingLeft: 5 }} />
                </View>
            </View>
            <FlatList
                style={[styles.settingsList, { backgroundColor: color2 }]}
                data={settings[0].data}
                renderItem={({ item, index }) => (
                    <View style={styles.settingBlock}>
                        {index === 0 ? (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('AccountSettings')}
                                style={[styles.settingItem1st, styles.settingItem]}
                            >
                                <FontAwesome5 name={item.icon} color={color3} size={24} />
                                <Text style={styles.settingText}>{item.key} </Text>
                                <Text style={styles.settingValue}>{item.value}</Text>
                            </TouchableOpacity>
                        ) : item.key === 'Notifications' ? (
                            <TouchableOpacity
                                onPress={toggleSwitch}
                                style={[styles.settingItemMiddle, styles.settingItem]}
                            >
                                <FontAwesome5 name={item.icon} color={color3} size={24} />
                                <Text style={styles.settingText}>{item.key} </Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#02de11' }}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                    style={styles.notiSwitch}
                                />
                            </TouchableOpacity>
                        ) : index === settings[0].data.length - 1 ? (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ThemeSettings')}
                                style={[styles.settingItemLast, styles.settingItem]}
                            >
                                <FontAwesome5 name={item.icon} color={color3} size={24} />
                                <Text style={styles.settingText}>{item.key} </Text>
                                <Text style={styles.settingValue}>{item.value}</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={[styles.settingItemMiddle, styles.settingItem]}>
                                <FontAwesome5 name={item.icon} color={color3} size={24} />
                                <Text style={styles.settingText}>{item.key} </Text>
                                <Text style={styles.settingValue}>{item.value}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? 20 : 0
    },
    accountHeader: {
        height: '20%',
        width: '100%',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    accountImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
    },
    accountUsernameView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountUsername: {
        color: 'white',
        fontSize: 20,
        fontWeight: '800',
        top: 5,
    },
    settingsList: {
        position: 'absolute',
        width: '90%',
        height: '70%',
        left: '5%',
        top: '30%',
        backgroundColor: '#112D4E',
        padding: 10,
        borderRadius: 10,
    },
    settingText: {
        color: 'white',
        fontSize: 18,
        left: 10
    },
    settingItem: {
        alignItems: 'center',
        height: 50,
        paddingLeft: 5,
        backgroundColor: '#376499',
        top: 1,
        flexDirection: 'row',
    },
    settingItem1st: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    settingItemMiddle: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    settingItemLast: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    notiSwitch: {
        position: 'absolute',
        right: 10,
    }
});