import React, {useEffect, useState} from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {blue, grey} from '@mui/material/colors';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import {DataGrid, GridColDef, GridSortItem} from '@mui/x-data-grid';
import moment from 'moment';
import {formatUnits} from './helper';
import {AssetBalance, Network, Safe, Stats} from './types';

const CloseModal = (props: { onClick: () => void }) => {
    return <IconButton
        aria-label="close"
        onClick={props.onClick}
        sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
        }}
    >
        <CloseIcon/>
    </IconButton>
}


const AssetBalanceList = (props: { balances: AssetBalance[] }) => {
    const {balances} = props;

    const columns: GridColDef[] = [
        {field: 'asset', headerName: 'Asset', width: 200, sortable: false},
        {field: 'type', headerName: 'Type', width: 200, sortable: false},
        {field: 'balance', headerName: 'Balance', width: 200},
        {field: 'contract', headerName: 'Contract', width: 700, sortable: false},
    ];

    const rows = [
        {
            id: 'stx',
            asset: 'STX',
            type: '',
            balance: formatUnits(balances.find(x => x.asset === 'STX')!.balance, 6).toNumber(),
            contract: ''
        },
        ...balances.map(x => x.asset_info && ('decimals' in x.asset_info) ? ({
            id: x.asset,
            asset: x.asset_info.symbol,
            type: 'Fungible token',
            'balance': formatUnits(x.balance, x.asset_info.decimals).toNumber(),
            contract: x.asset
        }) : null).filter(x => x).sort((a, b) => Number(b!.balance) - Number(a!.balance)),
        ...balances.map(x => x.asset_info && !('decimals' in x.asset_info) ? ({
            id: x.asset,
            asset: x.asset_info.identifier,
            type: 'Non-fungible token',
            balance: x.balance,
            contract: x.asset
        }) : null).filter(x => x).sort((a, b) => Number(b!.balance) - Number(a!.balance)),
    ];

    return <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        getRowId={(r) => r.id}
        autoHeight
    />
}

const SafeList = (props: { safes: Safe[], onSafeSelect: (safe: string) => void }) => {
    const [sortModel, setSortModel] = useState<GridSortItem[]>([
        {
            field: 'balance',
            sort: 'desc',
        },
    ]);

    const {safes, onSafeSelect} = props;

    const rows = safes.map(s => ({
        ...s,
        balance: formatUnits(s.balance, 6).toNumber()
    }));


    const columns: GridColDef[] = [
        {
            field: 'address', headerName: 'Address', sortable: false, width: 700, renderCell: p => {
                return <Box sx={{
                    color: blue['600'],
                    cursor: 'pointer',
                    ':hover': {
                        textDecoration: 'underline'
                    }
                }} onClick={() => {
                    onSafeSelect(p.value);
                }}>{p.value}</Box>
            }
        },
        {field: 'balance', headerName: 'Balance', width: 120, renderCell: (p) => <>{p.value} STX</>},
        {field: 'threshold', headerName: 'Threshold', width: 100},
        {field: 'nonce', headerName: 'Nonce', width: 100},
        {
            field: 'owners', headerName: 'Owners', renderCell: (p) => {
                const title = <Box>{p.value.map((x: string) => <span key={x}>{x}<br/></span>)}</Box>
                return <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Box sx={{mr: '6px'}}>{p.value.length}</Box>
                    <Tooltip title={title}><InfoIcon fontSize="small" sx={{color: grey[600]}}/></Tooltip>
                </Box>
            },
            sortComparator: (v1, v2) => v1.length - v2.length,
            filterable: false
        },
        {field: 'version', headerName: 'Version', width: 120},
        {field: 'status', headerName: 'Status', width: 100, sortable: false},
        {
            field: 'time',
            headerName: 'Created',
            width: 210,
            renderCell: (p) => moment.unix(p.value).format('MMMM Do YYYY, h:mm a'),
        },
    ];

    return <DataGrid
        rows={rows}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[20]}
        disableSelectionOnClick
        getRowId={(r) => r.address}
        autoHeight
        experimentalFeatures={{newEditingApi: false}}
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
    />
}


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
                        <Typography sx={{mb: '10px', fontSize: '90%', color: grey[600]}}>Assets stored across all MultiSafe
                            wallets.</Typography>
                        <Paper><AssetBalanceList balances={stats!.balances}/></Paper>
                    </Box>
                    <Box sx={{mb: '50px'}}>
                        <Typography sx={{mb: '6px', fontSize: '22px', fontWeight: '500'}}>Safe List</Typography>
                        <Typography sx={{mb: '10px', fontSize: '90%', color: grey[600]}}>List of all MultiSafe wallets.</Typography>
                        <Paper><SafeList safes={safes} onSafeSelect={showSafe}/></Paper>
                    </Box>
                </>
            })()}
        </Box>
    );
}

export default App;
