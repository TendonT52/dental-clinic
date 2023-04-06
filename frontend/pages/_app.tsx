import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import { UserProvider } from '../components/userContext';
import createEmotionCache from '../src/createEmotionCache';
import theme from '../src/theme';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {

  const [user, setUser] = useState({
    accessToken: "",
    dateOfBirth: "",
    email: "",
    firstName: "",
    id: 0,
    lastName: "",
    role: "GUEST",
    telephone: "",
  })

  useEffect(() => {
    if (localStorage.getItem('user') && localStorage.getItem('accessToken')) {
      setUser({
        ...JSON.parse(localStorage.getItem('user') || '{}'),
        accessToken: localStorage.getItem('accessToken') || ''
      })
    } else {
      setUser({
        accessToken: "",
        dateOfBirth: "",
        email: "",
        firstName: "",
        id: 0,
        lastName: "",
        role: "GUEST",
        telephone: "",
      })
    }
  }, [])

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <UserProvider value={{ user, setUser }}>
          <CssBaseline />
          <Navbar></Navbar>
          <Component {...pageProps} />
        </UserProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      </ThemeProvider>
    </CacheProvider>
  );
}
