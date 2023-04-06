import { Box, Fade, Grow, Typography } from "@mui/material"

export default function Hero() {
  return (
    <Box sx={{
      position: 'absolute',
      textAlign: 'center',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    }}>
      <Fade in={true} timeout={{
        enter: 2000,
        exit: 3000,
      }}>
        <Typography variant='h1'
          noWrap
          sx={{
            fontWeight: 'bold',
            color: 'white',
          }}>
          Dental Clinic
        </Typography>
      </Fade>
      <Grow
        in={true}
        style={{ transformOrigin: '0 100 0' }}
        timeout={{ enter: 3000, exit: 3000 }}
      >
        <Typography variant='h4' sx={{
          color: 'white',
        }}>
          "Chat with our dentists in real-time for quick and reliable dental advice"
        </Typography>
      </Grow>
    </Box>
  )
}