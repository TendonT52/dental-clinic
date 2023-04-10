import { Box, Button, Dialog, DialogTitle, Paper, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useContext, useState } from "react";
import axios from "../axiosConfig";
import { UserContext } from "./userContext";

export function Register() {

  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('a')

  async function handleSubmit() {
    setIsLoading(true)
    axios.post('/patients', form)
      .then((res) => {
        console.log(res)
        if (res.status === 202) {
          console.log(res.data.user)
          setUser(res.data.user)
        } else {
          setMessage(res.data.message)
        }
        console.log(user)
      })
      .catch((err) => {
        console.log(err)
        setMessage(err.response.data.message)
        setOpen(true);
        setIsLoading(false)
      })
  }
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    telephone: '',
    dateOfBirth: new Date(),
    email: '',
    password: '',
    repassword: '',
  })
  return (<>
    <Box sx={{
      position: 'absolute',
      textAlign: 'center',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    }}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {message}
        </DialogTitle>
      </Dialog>
      <Paper sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr 1fr 1fr',
        minWidth: '450px',
      }}>
        <TextField
          onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
          id="outlined-basic"
          label="First name"
          variant="outlined"
          sx={{
            gridColumn: '1 / 3',
            m: 2,
          }} />
        <TextField
          onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
          id="outlined-basic" label="Last name" variant="outlined" sx={{
            gridColumn: '1 / 3',
            m: 2,
          }} />
        <TextField
          onChange={(event) => setForm((prev) => ({ ...prev, telephone: event.target.value }))}
          id="outlined-basic" label="Telephone" variant="outlined" sx={{
            gridColumn: '1 / 2',
            m: 2,
          }} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(event: any) => setForm((prev) => ({ ...prev, dateOfBirth: new Date(event.$d) }))}
            label="Date of birth" sx={{
              gridColumn: '2 / 3',
              m: 2,
            }} />
        </LocalizationProvider>
        <TextField
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          id="outlined-basic" label="Email" variant="outlined" sx={{
            gridColumn: '1 / 3',
            m: 2,
          }} />
        <TextField
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          id="outlined-basic" label="Password" variant="outlined" sx={{
            gridColumn: '1 / 2',
            m: 2,
          }} />
        <TextField
          onChange={(event) => setForm((prev) => ({ ...prev, repassword: event.target.value }))}
          id="outlined-basic" label="Confirm password" variant="outlined" sx={{
            gridColumn: '2 / 3',
            m: 2,
          }} />
        <Button
          disabled={isLoading}
          variant="text" sx={{
            gridColumn: '1 / 2', m: 2,
          }}>
          Login
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading} variant="contained" sx={{
          gridColumn: '2 / 3', m: 2,
        }}>
          Register
        </Button>
      </Paper>
    </Box>
  </>);
}
