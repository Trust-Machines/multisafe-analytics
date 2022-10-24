import React from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {Network} from '../types';

const NetworkMenu = (props: { network: Network, onChange: (network: Network) => void }) => {
    const {network, onChange} = props;
    return <Box sx={{display: 'flex', justifyContent: 'center', mb: '25px'}}>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={() => {
                onChange('mainnet');
            }} variant={network === 'mainnet' ? 'contained' : 'outlined'}>Mainnet</Button>
            <Button onClick={() => {
                onChange('testnet');
            }} variant={network === 'testnet' ? 'contained' : 'outlined'}>Testnet</Button>
        </ButtonGroup>
    </Box>
}

export default NetworkMenu;
