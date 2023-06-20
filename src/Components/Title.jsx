import React from 'react';
import Typography from '@mui/material/Typography';

const Title = ({ userName }) => {
  return (
    <Typography component="h2" variant="h6" color="#fff" gutterBottom sx={{margin:".8rem", textShadow:"-1px 1px 1px #000", fontWeight:"Bold",fontFamily:"'Poppins', sans-serif"} } >
      Welcome ! {userName} 
    </Typography>
  );
};

export default Title;
