import { Box, Button, Dialog, DialogTitle, Paper, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import axios from "../axiosConfig";
import { UserContext } from "./userContext";

export default function Login() {
  const router = useRouter()

  const { user, setUser } = useContext(UserContext);

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const [message, setMessage] = useState('a')

  async function handleSubmit() {
    setIsLoading(true)
    axios.post('/auth/login', form)
      .then((res) => {
        if (res.status === 202) {
          console.log(res.data)
          localStorage.setItem('accessToken', res.data.accessToken)
          localStorage.setItem('user', JSON.stringify(res.data.user))
          setUser(res.data.user)
          router.push('/appointments')
        } else {
          setMessage(res.data.message)
        }
      })
      .catch((err) => {
        setMessage(err.response.data.message)
        setOpen(true);
        setIsLoading(false)
      })
  }
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{
      position: 'absolute',
      textAlign: 'center',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      component: "form"
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
        gridTemplateRows: '1fr 1fr 0.5fr ',
        minWidth: '350px',
      }}>
        <TextField required
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          id="outlined-basic" label="Email" variant="outlined" sx={{
            gridColumn: '1 / 4',
            m: 2,
          }} />
        <TextField required
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          id="outlined-basic" label="Password" variant="outlined" sx={{
            gridColumn: '1 / 4',
            m: 2,
          }} />
        <Button variant="text" disabled={isLoading} sx={{
          gridColumn: '1 / 2', m: 2,
        }}>
          Register
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading} sx={{
          gridColumn: '2 / 3', m: 2,
        }}>
          Login
        </Button>
      </Paper>
    </Box >
  );
}