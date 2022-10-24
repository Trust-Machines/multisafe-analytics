import React from 'react';
import Typography from '@mui/material/Typography';
import {grey} from '@mui/material/colors';

export const H1 = (props: { children: React.ReactNode, mb?: string }) => {
    const {children, mb} = props;
    return <Typography sx={{mb: mb || '6px', fontSize: '22px', fontWeight: '500'}}>{children}</Typography>
}

export const Muted = (props: { children: React.ReactNode, mb?: string }) => {
    const {children, mb} = props;
    return <Typography sx={{mb: mb || '10px', fontSize: '90%', color: grey[600]}}>{children}</Typography>
}
