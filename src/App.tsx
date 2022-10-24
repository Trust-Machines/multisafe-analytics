import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {grey} from '@mui/material/colors';
import LinearProgress from '@mui/material/LinearProgress';
import CloseModal from './components/close-modal';
import {H1, Muted} from './components/text';
import Brand from './components/brand';
import NetworkMenu from './components/network-menu';
import AssetBalanceList from './components/asset-balance-list';
import SafeList from './components/safe-list';
import SafeDetail from './components/safe-detail';
import {Network, Safe, SafeWithBalances, Stats} from './types';

function App() {
    const [network, setNetwork] = useState<Network>('mainnet');
    const [loading, setLoading] = useState(true);
    const [safes, setSafes] = useState<Safe[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [safe, setSafe] = useState<SafeWithBalances | null>(null);

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
            <Brand/>
            <NetworkMenu network={network} onChange={setNetwork}/>
            {safe && <>
                <Dialog open={true} fullScreen onClose={() => {
                    setSafe(null);
                }}>
                    <DialogTitle>{safe.address}<CloseModal onClick={() => {
                        setSafe(null);
                    }}/></DialogTitle>
                    <DialogContent sx={{padding: '20px', background: '#eeeeee'}}>
                        <SafeDetail safe={safe} network={network}/>
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
                        <H1 mb="0px">{safe_count} Safes</H1>
                        <Typography sx={{fontSize: '90%', color: grey[600]}}>on {network}</Typography>
                    </Box>
                    <Box sx={{mb: '50px'}}>
                        <H1>Total Balances</H1>
                        <Muted>Assets stored across all MultiSafe wallets.</Muted>
                        <AssetBalanceList balances={stats!.balances} network={network} paginate={true}/>
                    </Box>
                    <Box sx={{mb: '50px'}}>
                        <H1>Safe List</H1>
                        <Muted>List of all MultiSafe wallets.</Muted>
                        <SafeList safes={safes} onSafeSelect={showSafe}/>
                    </Box>
                </>
            })()}
        </Box>
    );
}

export default App;
