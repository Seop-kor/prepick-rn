import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useIsHydrated, useIsLoggedIn, hydrateAuth } from "@/stores/auth";

// App entry: run startup work, then route by login state.
// Also the fallback when a Stack.Protected guard flips (login/logout), so it re-routes from here.
export default function Index() {
  const isHydrated = useIsHydrated();
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (isHydrated) return;
    hydrateAuth().then(SplashScreen.hide);
  }, [isHydrated]);

  if (!isHydrated) return null;
  return <Redirect href={isLoggedIn ? "/home" : "/login"} />;
}
