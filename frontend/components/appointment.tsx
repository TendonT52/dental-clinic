import { Box, Paper, Typography } from "@mui/material";
import { useContext } from "react";
import useSWR from 'swr';
import axios from "../axiosConfig";
import { UserContext } from "./userContext";

export default function Appointment() {
  const { user, setUser } = useContext(UserContext)
  const { data, error, isLoading } = useSWR('/appointments', (url) => axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + user.accessToken
    }
  }))
  console.log({
    data,
    error,
    isLoading
  })
  return (
    <>
      <Box sx={{ height: '64px' }}></Box>
      {/* <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} /> */}
      <Paper>
        <Typography> Dentist </Typography>
      </Paper>
    </>
  )
}