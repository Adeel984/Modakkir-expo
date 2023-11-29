import React, { useState } from "react";
import { useFonts } from "expo-font";
import { Asset } from "expo-asset";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { View, Text } from "react-native";
import { Provider, useDispatch } from "react-redux";
import store from "./src/store";
import Navs from "./src/navigation";
import { NativeBaseProvider } from "native-base";
import { init } from "./src/store/db.js";

init()
  .then(() => {
    console.log("Initialized database");
  })
  .catch((err) => {
    console.log("Initializing db failed.");
    console.log(err);
  });

const Main = () => {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);
  const getData = async () => {
    try {
      console.log("getting data");
      const theme = await AsyncStorage.getItem("theme");
      const font = await AsyncStorage.getItem("font");
      const resTheme = JSON.parse(theme);
      const resFont = JSON.parse(font);
      if (resTheme) {
        dispatch({ type: "SET_THEME", payload: resTheme });
      }
      if (resFont) {
        dispatch({ type: "SET_FONT", payload: resFont });
      }
      const s = await AsyncStorage.getItem("islamghanyModdakir");
      dispatch({ type: "SET_AYAY_STOP", payload: JSON.parse(s) });
    } catch (err) {
      console.log(err);
    }
    setIsReady(true);
  };
  React.useEffect(() => {
    getData();
  }, []);
  if (!isReady) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Navs />
    </View>
  );
};
export default function App() {
  const [fontsLoaded] = useFonts({
    hfs: require("./src/assets/fonts/hfs.otf"),
    cairo: require("./src/assets/fonts/Cairo-Regular.ttf"),
    amiri: require("./src/assets/fonts/Amiri-Regular.ttf"),
    qlm: require("./src/assets/fonts/AlQalamQuran.ttf"),
    kufy: require("./src/assets/fonts/ReemKufi-Regular.ttf"),
    ar: require("./src/assets/fonts/ar-Quran1.ttf"),
    tijwal: require("./src/assets/fonts/Tajawal-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <Provider store={store}>
      {/* <Text>Fonts Loaded</Text> */}
      <NativeBaseProvider>
        <Main />
      </NativeBaseProvider>
    </Provider>
  );
  // return <View style={{
  //   backgroundColor:'red',
  //   justifyContent:'center',
  //   alignItems:'center'
  // }}>
  // <Text>
  //   Please Work!!!
  // </Text>
  // </View>
}
