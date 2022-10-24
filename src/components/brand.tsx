import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


const Brand = () => {
    return <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mb: '30px'
    }}>
        <Box component="img" src="/logo512.png" sx={{width: '140px', height: '140px', mb: '20px'}}/>
        <Typography sx={{fontSize: '24px'}}><strong>MultiSafe</strong> Analytics</Typography>
    </Box>
}

export default Brand;
