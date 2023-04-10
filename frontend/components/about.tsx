import { Box, Grow, Typography } from "@mui/material";

export default function About() {
  return (
    <Box sx={{
      position: 'absolute',
      textAlign: 'center',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    }}>
      <Grow
        in={true}
        style={{ transformOrigin: '0 100 0' }}
        timeout={{ enter: 2000 }}
      >
        <Typography variant='h4'
          sx={{
            color: 'white',
            minWidth: '50vw',
          }}>
          "This website is part of project in software development practices course at Chulalongkorn University"
        </Typography>
      </Grow>
    </Box>
  )
}