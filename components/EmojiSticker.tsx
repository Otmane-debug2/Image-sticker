import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = {
  imageSize: number;
  stickerSource: string;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const rotation = useSharedValue(1);
    const savedRotation = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
          
    const drag = Gesture.Pan().onChange(event => {
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    });

    const containerStyle = useAnimatedStyle(() => {
        return {
          transform: [
            {
              translateX: translateX.value,
            },
            {
              translateY: translateY.value,
            },
          ],
        };
      });

      const rotationGesture = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${(rotation.value / Math.PI) * 180}deg` }],
  }));


  const composed = Gesture.Race(drag, pinchGesture, rotationGesture);

  return (
      <Animated.View style={[containerStyle, { top: -350 }]}>
        <GestureDetector gesture={composed}>
          <Animated.Image
          source={stickerSource}
          resizeMode="contain"
          style={[animatedStyle, animatedStyle2, { width: 200, height: 200}]}
          />
        </GestureDetector>
    </Animated.View>
  );
}
