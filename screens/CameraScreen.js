import { useRef, useState } from "react";
import { Button, Text, TouchableOpacity, View, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { styles } from "../styles/styles";

export default function CameraScreen({ navigation }) {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [photoUri, setPhotoUri] = useState(null);

  // Handle missing permissions
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  async function takePhoto() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        alert("Photo saved to gallery!");
        navigation.navigate("Home");
        setPhotoUri(photo.uri);
      } catch (error) {
        console.error("Failed to take photo:", error);
        alert("Failed to take photo");
      }
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        photo={true}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>

          
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <View style={styles.photoButton}>
              <View style={styles.photoButtonInner} />
            </View>
          </TouchableOpacity>
        </View>
      </CameraView>
      {photoUri && (
        <View style={styles.imageContainer}>
          <Text style={styles.subtitle}>Preview:</Text>
          <Image
            source={{ uri: photoUri }}
            style={styles.selectedImage}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
}

// import { View } from "react-native";

// export default function CameraScreen() {
//   return (
//     <View>
//       <Text>Camera Screen</Text>
//     </View>
//   );
// }
