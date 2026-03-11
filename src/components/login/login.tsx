import { Button, PasswordInput, Stack, Text, TextInput, VisuallyHidden } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';

export function Login({ setToken, invalid }: { setToken: (token: string) => void; invalid: boolean }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (invalid) {
      usernameRef.current?.focus();
    }
  }, [invalid]);

  const login = () => {
    return fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        if (!res.ok) {
          setToken('INVALID');
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setToken(data.token);
        }
      })
      .catch(() => {
        setToken('INVALID');
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsernameTouched(true);
    setPasswordTouched(true);
    if (usernameError !== '' || passwordError !== '') {
      return;
    }
    login();
  };

  return (
    <main>
      <Stack align="center" justify="center" h="100vh">
        <VisuallyHidden><h1>Login</h1></VisuallyHidden>
        {invalid && <Text role="alert">Invalid username or password</Text>}
        <form onSubmit={handleSubmit} aria-label="Login form">
          <Stack maw={300} w="100%" gap="md">
            <TextInput
              ref={usernameRef}
              label="Username"
              error={usernameTouched ? usernameError : undefined}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setUsernameTouched(true)}
            />
            <PasswordInput
              label="Password"
              error={passwordTouched ? passwordError : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
            />
            <Button disabled={usernameError !== '' || passwordError !== ''} type="submit" w="100%">
              Login
            </Button>
          </Stack>
        </form>
      </Stack>
    </main>
  );
}
