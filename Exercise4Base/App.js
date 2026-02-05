
import React, { Component } from 'react';
import {Picker} from '@react-native-picker/picker'; // You'll need this for the exercise
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const key = '@MyApp:key';

export default class App extends Component {
  state = {
    text: '',
    storedValueOne: '',
    storedValueThree: '',
    storedValueTwo: '',
    valueOne: '',
    valueThree: '',
    valueTwo: '',
  };

  componentDidMount() {
    this.onLoad();
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
    } catch (error) {
      Alert.alert('Error', 'There was an error while loading the data');
    }
  }

  onSave = async () => {
    const { text } = this.state;
    const { valueOne } = this.state;
    const { valueThree } = this.state;
    const { valueTwo } = this.state;
    try {
      await AsyncStorage.setItem(key, JSON.stringify([valueOne, valueTwo, valueThree]));
      Alert.alert('Saved', 'Successfully saved on device');
    } catch (error) {
      Alert.alert('Error', 'There was an error while saving the data');
    }
  }

  onChange = (text) => {
    this.setState({ text });
  }

  render() {
    const { storedValueOne } = this.state;
    const { storedValueThree } = this.state;
    const { storedValueTwo } = this.state;
    const { text } = this.state;
    const { valueOne } = this.state;
    const { valueThree } = this.state;
    const { valueTwo } = this.state;
    const storedValues = `${storedValueOne}\n${storedValueTwo}\n${storedValueThree}`;

    return (
      <View style={styles.container}>
        <Text style={styles.preview}>{storedValues}</Text>
        <View>
          <Picker
            // onChangeText={this.onChange}
            // value={text}
            // placeholder="Type something here..."
            selectedValue={valueOne}
            onValueChange={(value) => this.setState({ valueOne: value })}
            style={styles.input}
          >
            <Picker.Item label='1 Star' value='1 Star' />
            <Picker.Item label='2 Stars' value='2 Stars' />
            <Picker.Item label='3 Stars' value='3 Stars' />
            <Picker.Item label='4 Stars' value='4 Stars' />
            <Picker.Item label='5 Stars' value='5 Stars' />
          </Picker>
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
          </Picker>
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
          <TouchableOpacity onPress={this.onSave} style=
            {styles.button}>
            <Text>Save locally</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onLoad} style=
            {styles.button}>
            <Text>Load data</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  }, preview: {
    backgroundColor: '#bdc3c7',
    width: 300,
    height: 80,
    padding: 10,
    borderRadius: 5,
    color: '#333',
    marginBottom: 50,
  }, input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    width: 300,
    height: 40,
    padding: 5,
  },
  button: {
    backgroundColor: '#f39c12',
    padding: 10,
    borderRadius: 3,
    marginTop: 10,
  },
});