import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SessionProvider } from "@/src/context/AuthContext";
import { Slot } from "expo-router";
import Colors from "@/constants/StyleVariables";
import { UserProvider } from "@/src/context/UserProvider";
import { ToastProvider } from "@/src/context/ToastProvider";
import { SubjectProvider } from "@/src/context/SubjectContext";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "AuthScreen",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const scheme = useColorScheme();

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  useEffect(() => {
    if (loaded) {
      const bg = scheme === "dark" ? Colors.dark.bgDark : Colors.light.bgDark;
      SystemUI.setBackgroundColorAsync(bg).finally(() =>
        SplashScreen.hideAsync()
      );
    }
  }, [loaded, scheme]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <UserProvider>
        <SessionProvider>
          <ToastProvider>
            <SubjectProvider>
              <ThemeProvider
                value={scheme === "dark" ? DefaultTheme : DefaultTheme}
              >
                <StatusBar barStyle={"dark-content"}></StatusBar>
                <Slot />
              </ThemeProvider>
            </SubjectProvider>
          </ToastProvider>
        </SessionProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
