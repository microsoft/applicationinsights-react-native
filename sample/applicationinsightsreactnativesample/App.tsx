import React, {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import TestPage from './src/TestPage';
import {NativeRouter, Route, Link, Routes} from 'react-router-native';
import {appInsights} from './src/ApplicationInsightsService';

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const Home = () => {
  appInsights.trackPageView({name: 'home page', uri: 'https://testUrl'});
  return <Text style={styles.sectionTitle}>Home</Text>;
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NativeRouter>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="ApplicationInsights">
            <Text style={styles.highlight}>React Native Sample</Text>
          </Section>
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View style={styles.nav}>
            <Link to="/" underlayColor="#dcdcdc" style={styles.navItem}>
              <Text>Home</Text>
            </Link>
            <Link to="/Test" underlayColor="#dcdcdc" style={styles.navItem}>
              <Text>Test</Text>
            </Link>
          </View>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Test" element={<TestPage />} />
          </Routes>
        </View>
      </ScrollView>
    </NativeRouter>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  subNavItem: {
    padding: 25,
  },
  container: {
    marginTop: 25,
    padding: 25,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
});

export default App;
