import { Box, Container } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import About from '../components/about';
import Appointment from '../components/appointment';
import Hero from '../components/hero';
import Login from '../components/login';
import { Register } from '../components/register';

export default function Home() {
  const router = useRouter()
  return (
    <>
      <Box sx={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
      }}>

        <Image src="/hero.jpg" alt="me" fill
          quality={50} style={{
            objectFit: 'cover',
            zIndex: -1,
          }} />

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 10, 0.75)',
            zIndex: -1,
          }}
        />

        <Box sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          {router.asPath === '/' && <Hero />}
          {router.asPath === '/about' && <About />}
          {router.asPath === '/login' && <Login />}
          {router.asPath === '/register' && <Register />}
        </Box>

        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}>
          {router.asPath === '/appointments' && <Appointment />}
        </Container >
      </Box >
    </>
  );
}
