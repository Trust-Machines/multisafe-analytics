import React, {useEffect, useState} from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {grey} from '@mui/material/colors';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import AssetBalanceList from './components/asset-balance-list';
import SafeList from './components/safe-list';
import CloseModal from './components/close-modal';
import {Network, Safe, Stats} from './types';

function App() {
    const [network, setNetwork] = useState<Network>('mainnet');
    const [loading, setLoading] = useState(true);
    const [safes, setSafes] = useState<Safe[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [safe, setSafe] = useState<Safe | null>(null);

    useEffect(() => {
        const fetchSafes = () => {
            return fetch(`https://${network}-api.multisafe.xyz/safes`).then(r => r.json()).then(safes => {
                setSafes(safes)
            })
        }

        const fetchStat = async () => {
            return fetch(`https://${network}-api.multisafe.xyz/stats`).then(r => r.json()).then(stats => {
                setStats(stats)
            })
        }

        setLoading(true);
        fetchSafes()
            .then(() => fetchStat())
            .then(() => {
                setLoading(false);
            })
    }, [network]);

    const showSafe = (safe: string) => {
        fetch(`https://${network}-api.multisafe.xyz/safes/${safe}`).then(r => r.json()).then(safe => {
            setSafe(safe);
        })
    }

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                mb: '30px'
            }}>
                <Box component="img" src="/logo512.png" sx={{width: '140px', height: '140px', mb: '20px'}}/>
                <Typography sx={{fontSize: '24px'}}><strong>MultiSafe</strong> Analytics</Typography>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'center', mb: '25px'}}>
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button onClick={() => {
                        setNetwork('mainnet')
                    }} variant={network === 'mainnet' ? 'contained' : 'outlined'}>Mainnet</Button>
                    <Button onClick={() => {
                        setNetwork('testnet')
                    }} variant={network === 'testnet' ? 'contained' : 'outlined'}>Testnet</Button>
                </ButtonGroup>
            </Box>
            {safe && <>
                <Dialog open={true} fullScreen onClose={() => {
                    setSafe(null);
                }}>
                    <DialogTitle>{safe.address}<CloseModal onClick={() => {
                        setSafe(null);
                    }}/></DialogTitle>
                    <DialogContent sx={{padding: '20px'}}>
                        <Box>

                        </Box>
                    </DialogContent>
                </Dialog>
            </>}
            {(() => {
                if (loading) {
                    return <LinearProgress/>;
                }

                const {safe_count} = stats!;

                return <>
                    <Box sx={{mb: '25px', textAlign: 'center'}}>
                        <Typography sx={{fontSize: '22px', fontWeight: '500'}}>{safe_count} Safes</Typography>
                        <Typography sx={{fontSize: '90%', color: grey[600]}}>on {network}</Typography>
                    </Box>
                    <Box sx={{mb: '50px'}}>
                        <Typography sx={{mb: '6px', fontSize: '22px', fontWeight: '500'}}>Total Balances</Typography>
                        <Typography sx={{mb: '10px', fontSize: '90%', color: grey[600]}}>Assets stored across all
                            MultiSafe
                            wallets.</Typography>
                        <Paper><AssetBalanceList balances={stats!.balances}/></Paper>
                    </Box>
                    <Box sx={{mb: '50px'}}>
                        <Typography sx={{mb: '6px', fontSize: '22px', fontWeight: '500'}}>Safe List</Typography>
                        <Typography sx={{mb: '10px', fontSize: '90%', color: grey[600]}}>List of all MultiSafe
                            wallets.</Typography>
                        <Paper><SafeList safes={safes} onSafeSelect={showSafe}/></Paper>
                    </Box>
                </>
            })()}
        </Box>
    );
}

export default App;
