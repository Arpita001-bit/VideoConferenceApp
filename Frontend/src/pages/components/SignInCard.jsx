import React, { useState } from 'react';
import { TextField, Button, Stack, Typography, Paper, Link as MuiLink } from '@mui/material';

export default function SignInCard({ formState, setFormState, handleAuth , error}) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    handleAuth({ name, username, password });
  };

  return (
    <Paper
      elevation={6}
      sx={{ p: 4, width: 380, backgroundColor: '#12122a', borderRadius: 3, border: '1px solid #23233f' }}
    >
      <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>
        {formState == 0 ? "Sign In" : "Register"}
      </Typography>
      <Stack spacing={2}>
        {formState == 1 && (

          
          <TextField
            label="Full Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ style: { color: '#ccc' } }}
            sx={{ input: { color: '#fff' } }}
          />
        )}
        <TextField
          label={formState == 0 ? "Username / Email" : "Email"}
          type={formState == 0 ? "text" : "email"}
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputLabelProps={{ style: { color: '#ccc' } }}
          sx={{ input: { color: '#fff' } }}
        />
        <TextField
          label="Password"
          type="text"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ style: { color: '#ccc' } }}
          sx={{ input: { color: '#fff' } }}
        />
        <p style = {{color:"red"}}>{error}</p>
        <Button
          variant="contained"
          fullWidth
          onClick={onSubmit}
          sx={{ backgroundColor: '#FF9839', color: '#0a0a1a', fontWeight: 700, textTransform: 'none', '&:hover': { backgroundColor: '#e8850f' } }}
        >
          {formState == 0 ? "Sign In" : "Register"}
        </Button>
        <Typography variant="body2" sx={{ color: '#8a8aa8', textAlign: 'center' }}>
          {formState == 0 ? (
            <>Don't have an account?{' '}
              <MuiLink component="button" onClick={() => setFormState(1)} sx={{ color: '#FF9839' }}>
                Register
              </MuiLink>
            </>
          ) : (
            <>Already have an account?{' '}
              <MuiLink component="button" onClick={() => setFormState(0)} sx={{ color: '#FF9839' }}>
                Sign In
              </MuiLink>
            </>
          )}
        </Typography>
      </Stack>
    </Paper>
  );
}