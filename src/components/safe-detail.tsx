import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AssetBalanceList from './asset-balance-list';
import {Network, SafeWithBalances} from '../types';
import {Muted} from './text';


const SafeDetail = (props: { safe: SafeWithBalances, network: Network }) => {
    const {safe} = props;

    return <>
        <Typography sx={{mb: '6px', fontSize: '20px', fontWeight: '500'}}>Balances</Typography>
        {(() => {
            if (safe.balances.length === 0) {
                return <Muted>Nothing</Muted>
            } else {
                return <Paper><AssetBalanceList balances={safe.balances}/></Paper>
            }
        })()}
    </>;
}

export default SafeDetail;
