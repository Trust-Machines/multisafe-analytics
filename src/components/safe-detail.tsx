import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AssetBalanceList from './asset-balance-list';
import {Network, SafeWithBalances} from '../types';


const SafeDetail = (props: { safe: SafeWithBalances, network: Network }) => {
    const {safe} = props;
    return <>
        <Typography sx={{mb: '6px', fontSize: '20px', fontWeight: '500'}}>Balances</Typography>
        <Paper><AssetBalanceList balances={safe.balances}/></Paper>
    </>;
}

export default SafeDetail;
