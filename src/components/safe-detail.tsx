import React from 'react';
import moment from 'moment';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import AssetBalanceList from './asset-balance-list';
import {Muted} from './text';
import {Network, SafeWithBalances} from '../types';


const SafeDetail = (props: { safe: SafeWithBalances, network: Network }) => {
    const {safe} = props;

    return <Box sx={{mt: '20px'}}>
        <TableContainer component={Paper} sx={{mb: '40px'}}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell width="200"><strong>Address</strong></TableCell>
                        <TableCell>{safe.address}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell width="200"><strong>Owners</strong></TableCell>
                        <TableCell>{safe.owners.map(x => <Box component="p">{x}</Box>)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell width="200"><strong>Threshold</strong></TableCell>
                        <TableCell>{safe.threshold}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell width="200"><strong>Nonce</strong></TableCell>
                        <TableCell>{safe.nonce}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell width="200"><strong>Version</strong></TableCell>
                        <TableCell>{safe.version}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell width="200"><strong>Status</strong></TableCell>
                        <TableCell>{safe.status}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell width="200"><strong>Created</strong></TableCell>
                        <TableCell>
                            <Box component="p">{moment.unix(safe.time).format('MMMM Do YYYY, h:mm a')}</Box>
                            <Box component="p" sx={{display: 'flex', alignItems: 'center'}}>
                                <PersonOutlineIcon fontSize="small" sx={{mr: '6px'}}/> {safe.sender}</Box>
                            <Box component="p" sx={{display: 'flex', alignItems: 'center'}}>
                                <SwapHorizIcon fontSize="small" sx={{mr: '6px'}}/> {safe.tx_hash}</Box>

                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        <Typography sx={{mb: '6px', fontSize: '20px', fontWeight: '500'}}>Balances</Typography>
        {(() => {
            if (safe.balances.length === 0) {
                return <Muted>Nothing</Muted>
            } else {
                return <Paper><AssetBalanceList balances={safe.balances}/></Paper>
            }
        })()}
    </Box>;
}

export default SafeDetail;
