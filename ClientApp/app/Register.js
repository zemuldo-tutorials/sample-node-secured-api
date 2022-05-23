import React from 'react';
import {View, TextInput, Button} from 'react-native';
import api from './api';

const Register = ({ onClickLogin}) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const createAccount = () => {
    api
      .post('/register', {
        username,
        password,
      })
      .then(res => 'Take user to signion')
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

      <Button title="Register" onPress={createAccount} />
      <Button title="Login" onPress={onClickLogin} />
    </View>
  );
};

export default Register;
