import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import {
    GestureHandlerRootView,
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    TapGestureHandler
} from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    Layout,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedProps,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

import LIKE from "./LIKE.png"
import NOPE from "./NOPE.png"

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

const { height, width } = Dimensions.get("window")

const DURATION = 600
const CARD_HEIGHT = height / 2.85
const CARD_WIDTH = width / 2.35

const RenderCards = ({
    length,
    item,
    index,
    selectedCardValue,
    disabledTouchFromChild = () => { },
}) => {

    const rotate = useSharedValue(`0deg`)
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const scaleY = useSharedValue(1)
    const scale = useSharedValue(1)
    const selectedCardOpacity = useSharedValue(1)

    const [selectedIndex, setSelectedIndex] = useState(length)
    const [touchDisabled, setTouchDisabled] = useState(false)
    const [selectedCard, setSelectedCard] = useState(null)

    useLayoutEffect(() => {

        let _rotate = `${index + "0"}deg`
        let _translateX = index * 30

        rotate.value = withTiming(_rotate, { duration: DURATION })
        translateX.value = withTiming(_translateX, { duration: DURATION })
        translateY.value = withTiming(
            index === 0 ? -index * 1 : index === length - 1 ? index + 1 * 18 : -index + 1 * 18,
            { duration: DURATION })
    }, [])

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: rotate.value },
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scaleY: scaleY.value },
                { scale: scale.value }
            ],
            opacity: selectedCardOpacity.value
        }
    })

    const onClickCard = value => {
        disabledTouchFromChild(true);
        _onTouch(value?.item, value?.index);
    };

    const _onTouch = (item, index) => {
        // if (index == length - 1) {
        //     return;
        // }

        let _translateX = 30
        rotate.value = withTiming(`${20}deg`, { duration: DURATION })
        translateY.value = withTiming(-200, { duration: DURATION })
        scaleY.value = withTiming(-1, { duration: DURATION })
        translateX.value = withTiming(_translateX, { duration: DURATION })
        setTimeout(() => {
            setSelectedIndex(index)
            setTimeout(() => {
                console.log(item, "Selected Item");
                selectedCardValue(item)
            }, 1000);
            // rotate.value = withTiming(`${"0"}deg`, { duration: DURATION })
            translateY.value = withTiming(index + 20, { duration: DURATION })
            scaleY.value = withTiming(1, { duration: DURATION })
            scale.value = withTiming(1.5, { duration: DURATION })
        }, 800);
    }

    return (
        <Animated.View
            style={[{
                height: CARD_HEIGHT,
                width: CARD_WIDTH,
                position: "absolute",
                borderRadius: 16,
                zIndex: index == selectedIndex ? 9999 : 0
            }, rStyle]}
        >
            <TouchableOpacity
                style={{
                    height: CARD_HEIGHT,
                    width: CARD_WIDTH,
                    justifyContent: "center",
                    alignItems: "center",
                }}
                activeOpacity={1}
                // onPress={() => _onTouch(item, index)}
                onPress={() => {
                    let _obj = {
                        item: item,
                        index: index
                    }
                    setSelectedCard(_obj)
                    setTouchDisabled(true)
                    onClickCard(_obj);
                }}
                disabled={touchDisabled}
            >

                <ImageBackground
                    source={{
                        uri: item?.pic,
                    }}
                    style={{
                        height: CARD_HEIGHT,
                        width: CARD_WIDTH,
                        borderRadius: 10,
                        overflow: 'hidden',
                        borderWidth: 1,
                        justifyContent: 'flex-end',
                    }}>
                    <View style={{ padding: 10, }}>
                        <Text style={{
                            fontSize: 26,
                            color: 'white',
                            fontWeight: 'bold',
                        }}>{item?.name}</Text>
                        <Text style={{
                            fontSize: 18,
                            color: 'white',
                            lineHeight: 25,
                        }}>{item?.bio}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        </Animated.View>
    )
}

const ROTATION = 60;

const Animations = () => {

    const [data, setData] = useState(
        [
            {
                id: 1,
                color: "red",
                pic: "https://upload.wikimedia.org/wikipedia/commons/5/57/ECurtis.jpg",
                name: "Mariya",
                bio: "Athelete"
            },
            {
                id: 2,
                color: "green",
                pic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80",
                name: "Michael",
                bio: "Athelete"
            },
            {
                id: 3,
                color: "yellow",
                pic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80",
                name: "Jordan",
                bio: "Singer"
            },
            {
                id: 4,
                color: "blue",
                pic: "https://dvyvvujm9h0uq.cloudfront.net/com/articles/1525891879-886386-sam-burriss-457746-unsplashjpg.jpg",
                name: "Ad sheran",
                bio: "Rock Band"
            },
        ])
    const [selectedCardToSlide, setSelectedCardToSlide] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(currentIndex + 1);
    const [disabledTouch, setDisabledTouch] = useState(false);
    ///// Tinder Like View

    const { width: screenWidth } = useWindowDimensions();

    const hiddenTranslateX = 2 * screenWidth;

    const translateX = useSharedValue(0);
    const cardScale = useSharedValue(1.5)
    const rotate = useDerivedValue(
        () =>
            interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) + 'deg',
    );



    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: rotate.value },
            { scale: cardScale.value },
            { translateX: translateX.value }
        ]
    }
    ));

    const likeStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, hiddenTranslateX / 5], [0, 1]),
    }));

    const nopeStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, -hiddenTranslateX / 5], [0, 1]),
    }));

    useEffect(() => {
        translateX.value = 0;
        setNextIndex(currentIndex + 1);
    }, [currentIndex, translateX]);

    const onSwipeLeft = (val) => {
        console.log("onSwipe LEFT", val)
        setSelectedCardToSlide(null)
    };

    const onSwipeRight = (val) => {
        console.log("onSwipe RIGHT", val)
        setSelectedCardToSlide(null)
    };

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, context) => {
            context.startX = translateX.value;
        },
        onActive: (event, context) => {
            translateX.value = context.startX + event.translationX;
        },
        onEnd: event => {
            if (Math.abs(event.translationX) < 150) {
                translateX.value = withSpring(0);
                return;
            }
            const toLeft = Math.sign(event.translationX)
            if (toLeft == -1) {
                console.log("111111111");
                runOnJS(onSwipeLeft)("ss")
            } else {
                console.log("222222");
                runOnJS(onSwipeRight)("ss")
            }
        },
    });

    useEffect(() => {
        if (selectedCardToSlide) {
            setTimeout(() => {
                setDisabledTouch(false);
            }, 0);
        }
    }, [selectedCardToSlide]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1, width: '100%' }}>
                <SafeAreaView />
                {selectedCardToSlide?.name && (
                    <View style={{ flex: 1, alignItems: "center", marginTop: 120 }}>
                        <PanGestureHandler
                            maxPointers={1}
                            onGestureEvent={gestureHandler}
                            onHandlerStateChange={gestureHandler}
                        >
                            <Animated.View
                                style={[{
                                    height: CARD_HEIGHT,
                                    width: CARD_WIDTH,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: selectedCardToSlide?.color,
                                    // backgroundColor: data[nextIndex].color,
                                    borderRadius: 16,
                                }, cardStyle]}
                                activeOpacity={1}
                            >
                                <Animated.Image
                                    source={LIKE}
                                    style={[styles.like, { left: 10 }, likeStyle]}
                                    resizeMode="contain"
                                />
                                <Animated.Image
                                    source={NOPE}
                                    style={[styles.like, { right: 10 }, nopeStyle]}
                                    resizeMode="contain"
                                />
                                <ImageBackground
                                    source={{ uri: selectedCardToSlide?.pic }}
                                    style={{
                                        height: CARD_HEIGHT,
                                        width: CARD_WIDTH,
                                        borderRadius: 10,
                                        overflow: 'hidden',
                                        borderWidth: 1,
                                        justifyContent: 'flex-end',
                                    }}>
                                    <View style={{ padding: 10, }}>
                                        <Text style={{
                                            fontSize: 26,
                                            color: 'white',
                                            fontWeight: 'bold',
                                        }}>{selectedCardToSlide?.name}</Text>
                                        <Text style={{
                                            fontSize: 18,
                                            color: 'white',
                                            lineHeight: 25,
                                        }}>{selectedCardToSlide?.bio}</Text>
                                    </View>
                                </ImageBackground>
                            </Animated.View>
                        </PanGestureHandler>
                    </View>
                )}

                {!selectedCardToSlide?.name && (
                    <View style={{ flex: 1, backgroundColor: "lightblue" }}>
                        <View style={{
                            marginTop: 76,
                            marginStart: 30,
                            marginStart: width / 18,
                            transform: [
                                { rotate: "-20deg" }
                            ]
                        }}>
                            {data.map((item, index) => {
                                return (
                                    <RenderCards
                                        length={data.length}
                                        item={item}
                                        index={index}
                                        disabledTouchFromChild={val => setDisabledTouch(val)}
                                        selectedCardValue={(item) => {
                                            translateX.value = 0
                                            setSelectedCardToSlide(null)
                                            setSelectedCardToSlide(item)
                                        }}
                                    />
                                )
                            })}
                        </View>
                    </View>
                )}
            </View>
            {disabledTouch && (
                <View
                    style={{
                        height: height,
                        width: width,
                        backgroundColor: 'transparent',
                        position: 'absolute',
                        top: 0,
                    }}
                />
            )}
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    like: {
        width: 150,
        height: 150,
        position: 'absolute',
        top: 10,
        zIndex: 1,
        elevation: 1,
    },
})

export default Animations;
