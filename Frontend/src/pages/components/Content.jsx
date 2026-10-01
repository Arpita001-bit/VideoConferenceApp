import React from 'react';
import { Stack, Typography } from '@mui/material';

export default function Content() {
  return (
    <Stack sx={{ maxWidth: 380, color: '#fff' }} spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Convo
      </Typography>
      <Typography variant="body1" sx={{ color: '#8a8aa8' }}>
        Cover the distance by Convo. Sign in to keep collaborating anywhere.
      </Typography>
    </Stack>
  );
}