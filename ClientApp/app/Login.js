import React from 'react';
import {View, TextInput, Button} from 'react-native';
import api from './api';

const Login = ({ onClckCreateAccount}) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const createAccount = () => {
    api
      .post('/login', {
        username,
        password,
      })
      .then(res => 'Take user to Profile')
      .catch(err => console.log(err));
  };

  return (
    <View>
      <TextInput
        defaultValue="username"
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        defaultValue="password"
        password={true}
        onChangeText={text => setPassword(text)}
      />

      <Button title="Login" onPress={createAccount} />
      <Button title="Register" onPress={onClckCreateAccount} />
    </View>
  );
};

export default Login;
