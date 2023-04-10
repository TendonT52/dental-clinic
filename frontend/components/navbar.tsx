import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MasksIcon from '@mui/icons-material/Masks';
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { UserContext } from './userContext';

export default function Navbar() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <AppBar>
      <Container>
        <Toolbar
          variant='dense'
          sx={
            {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'stretch'
            }
          }>
          <Box sx={{
            display: 'flex',
            alignItems: 'stretch'
          }}>
            <Button
              onClick={() => router.push('/')}
              sx={{
                color: 'white',
              }}>
              <MasksIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography>
                Dental Clinic
              </Typography>
            </Button>
            {
              (user.role === 'PATIENT' || user.role === 'DENTIST' || user.role === 'ADMIN') &&
              <Button
                onClick={() => router.push('/appointments')}
                sx={{
                  color: 'white',
                }}>
                Appointment
              </Button>
            }
            {
              (user.role === 'PATIENT' || user.role === 'ADMIN') &&
              <Button sx={{
                color: 'white',
              }}>
                DENTIST
              </Button>
            }
            {
              (user.role === 'DENTIST' || user.role === 'ADMIN') &&
              <Button sx={{
                color: 'white',
              }}>
                PATIENT
              </Button>
            }
            <Button
              onClick={() => router.push('/about')}
              sx={{
                color: 'white',
              }}>
              About
            </Button>
          </Box>
          <Box sx={{
            display: 'flex',
          }}>
            {
              user.role === 'GUEST' &&
              <>
                <Button onClick={() => router.push('/login')} size='large' sx={{ color: 'white', px: 3 }}>
                  Login
                </Button>
                <Button onClick={() => router.push('/register')} size='large' sx={{ color: 'white', px: 3 }}>
                  Register
                </Button>
              </>
            }
            {
              (user.role === 'PATIENT' || user.role === 'DENTIST' || user.role === 'ADMIN') &&
              <>

                <Box sx={{
                  display: 'flex',
                }}>
                  <IconButton size='large'
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                      setAnchorEl(event.currentTarget)
                    }}>
                    <AccountCircleIcon sx={{ color: 'white' }} />
                  </IconButton>

                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    keepMounted
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
                    <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
                  </Menu>
                </Box>
              </>
            }
          </Box>
        </Toolbar>
      </Container>
    </AppBar >
  )
}