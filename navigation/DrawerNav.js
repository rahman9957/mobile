import { createDrawerNavigator } from "@react-navigation/drawer";

import InputMhsScreen from "../screens/InputMhsScreen";
import DaftarMhsScreen from "../screens/DaftarMhsScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0A2D5E",
        },

        headerTintColor: "#FFF",

        drawerActiveBackgroundColor: "#FFC72C",

        drawerActiveTintColor: "#0A2D5E",

        drawerLabelStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Drawer.Screen
        name="Input Data Mhs"
        component={InputMhsScreen}
      />

      <Drawer.Screen
        name="Daftar Mhs"
        component={DaftarMhsScreen}
      />
    </Drawer.Navigator>
  );
}