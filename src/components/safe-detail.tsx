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
import Link from './link';


const SafeDetail = (props: { safe: SafeWithBalances, network: Network }) => {
    const {safe, network} = props;

    return <Box sx={{mt: '20px'}}>
        <TableContainer component={Paper} sx={{mb: '40px'}}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell width="200"><strong>Address</strong></TableCell>
                        <TableCell><Link to={safe.address} network={network}/></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell width="200"><strong>Owners</strong></TableCell>
                        <TableCell>{safe.owners.map(x => <Box component="p" key={x}>
                            <Link to={x} network={network}/></Box>)}</TableCell>
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
                                <PersonOutlineIcon fontSize="small" sx={{mr: '6px'}}/><Link to={safe.sender}
                                                                                            network={network}/>
                            </Box>
                            <Box component="p" sx={{display: 'flex', alignItems: 'center'}}>
                                <SwapHorizIcon fontSize="small" sx={{mr: '6px'}}/><Link to={safe.tx_hash}
                                                                                        network={network}/>
                            </Box>
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
                return <Paper><AssetBalanceList balances={safe.balances} network={network}/></Paper>
            }
        })()}
    </Box>;
}

export default SafeDetail;
