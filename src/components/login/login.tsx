import { Button, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react';

export function Login({ setToken, invalid }: { setToken: (token: string) => void, invalid: boolean }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (username.length === 0) {
      setUsernameError('Username is required');
    } else {
      setUsernameError('');
    }
    if (password.length === 0) {
      setPasswordError('Password is required');
    } else {
      setPasswordError('');
    }
  }, [username, password]);

  const login = () => {
    return fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => setToken(data.token));
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (usernameError !== '' || passwordError !== '') {
        return;
      }
      e.preventDefault();
      login();
    }
  };

  return (
    <Stack align="center" justify="center" h="100vh">
      {invalid && <Text>Invalid username or password</Text>}
      <TextInput error={usernameError} w={300} value={username} onKeyUp={handleKeyUp} onChange={(e) => setUsername(e.target.value)} />
      <PasswordInput error={passwordError} w={300} value={password} onKeyUp={handleKeyUp} onChange={(e) => setPassword(e.target.value)} />
      <Button disabled={usernameError !== '' || passwordError !== ''} w={300} onClick={login}>Login</Button>
    </Stack>
  );
}
