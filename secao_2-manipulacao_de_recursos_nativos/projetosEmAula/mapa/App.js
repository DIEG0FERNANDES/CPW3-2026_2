import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import MapView from "react-native-maps";

const locais = {
  aquidauana: {
    latitude: -20.4697,
    longitude: -55.7875,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },

  eua: {
    latitude: 40.7128,
    longitude: -74.006,
    latitudeDelta: 10,
    longitudeDelta: 10,
  },

  japao: {
    latitude: 35.6762,
    longitude: 139.6503,
    latitudeDelta: 10,
    longitudeDelta: 10,
  },
};

export default function App() {
  const [localizacao, setLocalizacao] = useState(locais.aquidauana);

  return (
    <View>
      <Text>Escolha uma localização</Text>

      <View>
        <TouchableOpacity onPress={() => setLocalizacao(locais.aquidauana)}>
          <ImageBackground
            source={require("./assets/aquidauana.png")}
            imageStyle={{ borderRadius: 8 }}
          >
            <Text>Aquidauana</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setLocalizacao(locais.eua)}>
          <ImageBackground
            source={require("./assets/eua.jpg")}
            imageStyle={{ borderRadius: 8 }}
          >
            <Text>EUA</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setLocalizacao(locais.japao)}>
          <ImageBackground
            source={require("./assets/japao.png")}
            imageStyle={{ borderRadius: 8 }}
          >
            <Text>Japão</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <MapView style={styles.mapa} region={localizacao} />
    </View>
  );
}
