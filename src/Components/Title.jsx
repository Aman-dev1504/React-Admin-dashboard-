import React from 'react';
import Typography from '@mui/material/Typography';
import WavingHandIcon from '@mui/icons-material/WavingHand';

const Title = ({ userName }) => {
  return (
    <Typography component="h2" variant="h6" color="#fff" gutterBottom sx={{margin:".8rem", textShadow:"1px -1px 1px #000", fontWeight:"Bold"} } >
      Welcome ! {userName} <WavingHandIcon  sx={{fontSize:"Large"}}/>
    </Typography>
  );
};

export default Title;
