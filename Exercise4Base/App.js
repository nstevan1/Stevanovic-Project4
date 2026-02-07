import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Component } from 'react';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const key = '@MyApp:key';
const playlist = [
  {
    title: 'Hunted By A Freak',
    uri: 'https://ia601509.us.archive.org/17/items/mogwai2017-10-20.brussels.fm/Mogwai2017-10-20Brussels-07.mp3'
  },
  {
    title: 'Nervous Tic Motion of the Head to the Left',
    uri: 'https://ia800503.us.archive.org/8/items/andrewbird2011-01-28.early.dr7.flac16/andrewbird2011-01-28.early.t07.mp3'
  },
  {
    title: 'People Watching',
    uri: 'https://ia800308.us.archive.org/7/items/kwilliams2012-09-22.at853.flac16/kwilliams2012-09-22at853.t16.mp3'
  }
];

export default class App extends Component {
  state = {
    currentTrackIndex: 0,
    isBuffering: false,
    isPlaying: false,
    playbackInstance: null,
    storedValueOne: '',
    storedValueThree: '',
    storedValueTwo: '',
    valueOne: '',
    valueThree: '',
    valueTwo: '',
    volume: 1.0,
  };

  async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: true,
      shouldDuckAndroid: true,
    });
    this.loadAudio();
    this.onLoad();
  }

  async loadAudio() {
    const playbackInstance = new Audio.Sound();
    const source = { uri: playlist[this.state.currentTrackIndex].uri }
    const status = {
      shouldPlay: this.state.isPlaying,
      volume: this.state.volume,
    };
    playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
    await playbackInstance.loadAsync(source, status, false);
    this.setState({ playbackInstance });
  }

  handleNextTrack = async () => {
    let { currentTrackIndex, playbackInstance } = this.state;
    if(playbackInstance) {
      await playbackInstance.unloadAsync();
      currentTrackIndex < playlist.length - 1 ? currentTrackIndex
        += 1 : currentTrackIndex = 0;
      this.setState({ currentTrackIndex });
      this.loadAudio();
    }
  }

  handlePlayPause = async () => {
    const { isPlaying, playbackInstance } = this.state;
    isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();
    this.setState({ isPlaying: !isPlaying });
  }

  handlePreviousTrack = async () => {
    let { currentTrackIndex, playbackInstance } = this.state;
    if(playbackInstance) {
      await playbackInstance.unloadAsync();
      currentTrackIndex === 0 ? currentTrackIndex = playlist.length
        - 1 : currentTrackIndex -= 1;
      this.setState({ currentTrackIndex });
      this.loadAudio();
    }
  }

  onLoad = async () => {
    try {
      let storedValues = await AsyncStorage.getItem(key);
      storedValues = JSON.parse(storedValues);
      if(storedValues !== null) {
        this.setState({ storedValueOne: storedValues[0] });
        this.setState({ storedValueTwo: storedValues[1] });
        this.setState({ storedValueThree: storedValues[2] });
      }
    } catch(error) { Alert.alert('Error', 'There was an error while loading the data'); }
  }

  onPlaybackStatusUpdate = (status) => {
    this.setState({ isBuffering: status.isBuffering });
  }

  onSave = async () => {
    const { valueOne } = this.state;
    const { valueThree } = this.state;
    const { valueTwo } = this.state;
    try {
      await AsyncStorage.setItem(key, JSON.stringify([valueOne, valueTwo, valueThree]));
      Alert.alert('Saved', 'Successfully saved on device');
    } catch(error) { Alert.alert('Error', 'There was an error while saving the data'); }
  }

  render() {
    const { storedValueOne } = this.state;
    const { storedValueThree } = this.state;
    const { storedValueTwo } = this.state;
    const { valueOne } = this.state;
    const { valueThree } = this.state;
    const { valueTwo } = this.state;

    return (
      <View style={styles.container}>
        <Text style={[styles.buffer, styles.largeText]}>
          {this.state.isBuffering && this.state.isPlaying ? 'Buffering...' : null}
        </Text>
        {this.renderSongInfo()}
        <View style={styles.controls}>
          <TouchableOpacity onPress={this.handlePreviousTrack} style={styles.control}>
            <Feather color='#ffffff' name='skip-back' size={32} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handlePlayPause} style={styles.control}>
            {this.state.isPlaying ?
              <Feather color='#ffffff' name='pause' size={32} /> :
              <Feather color='#ffffff' name='play' size={32} />
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleNextTrack} style={styles.control}>
            <Feather color='#ffffff' name='skip-forward' size={32} />
          </TouchableOpacity>
        </View>
        <Text style={styles.preview}>
          {this.state.currentTrackIndex === 0 ? storedValueOne :
          this.state.currentTrackIndex === 1 ? storedValueTwo : storedValueThree}
        </Text>
        <View>
          {this.state.currentTrackIndex === 0 ?
            <Picker
              selectedValue={valueOne}
              onValueChange={(value) => this.setState({ valueOne: value })}
              style={styles.input}
            >
              <Picker.Item label='1 Star' value='1 Star' />
              <Picker.Item label='2 Stars' value='2 Stars' />
              <Picker.Item label='3 Stars' value='3 Stars' />
              <Picker.Item label='4 Stars' value='4 Stars' />
              <Picker.Item label='5 Stars' value='5 Stars' />
            </Picker> : this.state.currentTrackIndex === 1 ?
            <Picker
              selectedValue={valueTwo}
              onValueChange={(value) => this.setState({ valueTwo: value })}
              style={styles.input}
            >
              <Picker.Item label='1 Star' value='1 Star' />
              <Picker.Item label='2 Stars' value='2 Stars' />
              <Picker.Item label='3 Stars' value='3 Stars' />
              <Picker.Item label='4 Stars' value='4 Stars' />
              <Picker.Item label='5 Stars' value='5 Stars' />
            </Picker> :
            <Picker
              selectedValue={valueThree}
              onValueChange={(value) => this.setState({ valueThree: value })}
              style={styles.input}
            >
              <Picker.Item label='1 Star' value='1 Star' />
              <Picker.Item label='2 Stars' value='2 Stars' />
              <Picker.Item label='3 Stars' value='3 Stars' />
              <Picker.Item label='4 Stars' value='4 Stars' />
              <Picker.Item label='5 Stars' value='5 Stars' />
            </Picker>
          }
          <TouchableOpacity onPress={this.onSave} style={styles.button}>
            <Text>Save locally</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onLoad} style={styles.button}>
            <Text>Load data</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderSongInfo() {
    const { currentTrackIndex, playbackInstance } = this.state;
    return playbackInstance ?
      <View style={styles.trackInfo}>
        <Text style={[styles.largeText, styles.trackInfoText]}>
          {playlist[currentTrackIndex].title}
        </Text>
      </View>
      : null;
  }
}

const styles = StyleSheet.create({
  buffer: {
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#ff0000',
    marginTop: 10,
    padding: 10,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#3c3744',
    height: '100%',
  },
  control: {
    margin: 10,
  },
  controls: {
    flexDirection: 'row',
  },
  input: {
    backgroundColor: '#ffffff',
    width: 200,
  },
  largeText: {
    fontSize: 20,
  },
  preview: {
    backgroundColor: '#b4c5e4',
    margin: 10,
    padding: 10,
    width: 100,
  },
  trackInfo: {
    padding: 10,
  },
  trackInfoText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});