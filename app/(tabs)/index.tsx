import { Text, View, StyleSheet, Platform  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
export {ImagePicker}
import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import IconButton from '@/components/IconButton';
import CircleButton from '@/components/CircleButton';
import EmojiPicker from '@/components/EmojiPicker';
import EmojiList from '@/components/EmojiList';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import EmojiSticker from '@/components/EmojiSticker';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from "react-native-view-shot";
import { useEffect, useRef } from "react";
import domtoimage from 'dom-to-image';
import { StatusBar } from 'expo-status-bar';
import CameraComponent from '@/components/CameraComponant';

const PlaceholderImage = require('../../assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<string | undefined>(undefined);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [imageUri, setImageUri] = useState(null);

  const handleImageTaken = (uri) => {
    setSelectedImage(uri);
  };

  if (status === null) {
    requestPermission();
  }

  const imageRef = useRef();

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
    console.log('Pressed reset button')
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  
  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert('Saved!');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.baseText}>Chose your Favorite Picture, select it and add a sticker to it so you can download it</Text>
        <View style={styles.imageContainer}>
          <View ref={imageRef} collapsable={false}>
            <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
            {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
          </View>
        </View>
        {showAppOptions ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
            </View>
          </View>
              ) : (
          <View style={styles.footerContainer}>
            <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
            <CameraComponent onImageTaken={handleImageTaken} />
            <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
          </View>
        )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
      </View>
    </GestureHandlerRootView>


  );
}

const styles = StyleSheet.create({
  baseText: {
    color: '#ffff',
    fontStyle: 'italic',
    borderBlockColor: '#ffff',
    paddingBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
