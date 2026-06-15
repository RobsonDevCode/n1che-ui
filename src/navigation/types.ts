import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  NichePicker: undefined;
  Map: undefined;
  Route: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
