import React from 'react';
import Paper from '@mui/material/Paper';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {formatUnits} from '../helper';
import {AssetBalance} from '../types';

const AssetBalanceList = (props: { balances: AssetBalance[] }) => {
    const {balances} = props;

    const columns: GridColDef[] = [
        {field: 'asset', headerName: 'Asset', width: 200, sortable: false},
        {field: 'type', headerName: 'Type', width: 200, sortable: false},
        {field: 'balance', headerName: 'Balance', width: 200},
        {field: 'contract', headerName: 'Contract', width: 700, sortable: false},
    ];

    const rows = [
        ...[
            balances.find(x => x.asset === 'STX') ? {
                id: 'stx',
                asset: 'STX',
                type: '',
                balance: formatUnits(balances.find(x => x.asset === 'STX')!.balance, 6).toNumber(),
                contract: ''
            } : null
        ],
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
    ].filter(x => x);

    return <Paper>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            getRowId={(r) => r.id}
            autoHeight
        />
    </Paper>
}

export default AssetBalanceList;
