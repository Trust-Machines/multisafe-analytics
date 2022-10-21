import React, {useEffect, useState} from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {Typography} from '@mui/material';
import {blue, grey} from '@mui/material/colors';
import {DataGrid, GridColDef, GridSortItem} from '@mui/x-data-grid';
import moment from 'moment';
import {formatUnits} from './helper';
import {AssetBalance, Network, Safe, Stats} from './types';

const AssetBalanceList = (props: { balances: AssetBalance[] }) => {
    const {balances} = props;

    const columns: GridColDef[] = [
        {field: 'asset', headerName: 'Asset', width: 200},
        {field: 'type', headerName: 'Type', width: 200},
        {field: 'balance', headerName: 'Balance', width: 200},
        {field: 'contract', headerName: 'Contract', width: 700},
    ];

    const rows = [
        {
            asset: 'STX',
            type: '',
            balance: formatUnits(balances.find(x => x.asset === 'STX')!.balance, 6).toNumber(),
            contract: ''
        },
        ...balances.map(x => x.asset_info && ('decimals' in x.asset_info) ? ({
            asset: x.asset_info.symbol,
            type: 'Fungible token',
            'balance': formatUnits(x.balance, x.asset_info.decimals).toNumber(),
            contract: x.asset
        }) : null).filter(x => x).sort((a, b) => Number(b!.balance) - Number(a!.balance)),
        ...balances.map(x => x.asset_info && !('decimals' in x.asset_info) ? ({
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
        getRowId={(r) => r.asset}
        autoHeight
    />
}

const SafeList = (props: { safes: Safe[] }) => {
    const [sortModel, setSortModel] = useState<GridSortItem[]>([
        {
            field: 'balance',
            sort: 'desc',
        },
    ]);

    const {safes} = props;

    const rows = safes.map(s => ({
        ...s,
        owners: s.owners.length,
        balance: formatUnits(s.balance, 6).toNumber()
    }));


    const columns: GridColDef[] = [
        {
            field: 'address', headerName: 'Address', sortable: false, width: 800, renderCell: p => {
                return <Box sx={{
                    color: blue['600'],
                    cursor: 'pointer',
                    ':hover': {
                        textDecoration: 'underline'
                    }
                }}>{p.value}</Box>
            }
        },
        {field: 'balance', headerName: 'Balance', width: 120, renderCell: (p) => <>{p.value} STX</>},
        {field: 'threshold', headerName: 'Threshold', width: 100},
        {field: 'nonce', headerName: 'Nonce', width: 100},
        {field: 'owners', headerName: 'Owners', width: 100},
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

        fetchSafes()
            .then(() => fetchStat())
            .then(() => {
                setLoading(false);
            })
    }, [network]);

    if (loading) {
        return null;
    }

    const {safe_count} = stats!;

    return (
        <div className="wrapper">
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
            <Box sx={{mb: '25px', textAlign: 'center', fontSize: '22px', fontWeight: '500'}}>
                {safe_count} Safes
            </Box>
            <Box sx={{mb: '50px'}}>
                <Typography sx={{mb: '6px', fontSize: '22px', fontWeight: '500'}}>Total Balances</Typography>
                <Typography sx={{mb: '10px', fontSize: '90%', color: grey[600]}}>Assets stored on all MultiSafe
                    wallets.</Typography>
                <AssetBalanceList balances={stats!.balances}/>
            </Box>
            <Box sx={{mb: '50px'}}>
                <Typography sx={{mb: '10px', fontSize: '22px', fontWeight: '500'}}>Safe List</Typography>
                <SafeList safes={safes}/>
            </Box>
        </div>
    );
}

export default App;
