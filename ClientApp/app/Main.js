import React from 'react';
import {View, Text} from 'react-native';
import api from './api';
import Login from './Login';
import Register from './Register';

const Main = () => {
  const [user, setUser] = React.useState(null);
  const [createAccount, setCreateAccount] = React.useState(false);

  React.useEffect(() => {
    api
      .get('/user_profile')
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <View>
      {!user && !createAccount && (
        <Login onClckCreateAccount={() => setCreateAccount(true)} />
      )}

      {!user && createAccount &&
        <Register onClickLogin={() => setCreateAccount(false)} />}

      {user && <Text>{user.username}</Text>}
    </View>
  );
};

export default Main;
