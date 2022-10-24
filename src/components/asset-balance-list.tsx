import React from 'react';
import Paper from '@mui/material/Paper';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {formatUnits} from '../helper';
import {AssetBalance, Network} from '../types';
import Link from './link';

const AssetBalanceList = (props: { balances: AssetBalance[], network: Network, paginate?: boolean }) => {
    const {balances, paginate, network} = props;

    const columns: GridColDef[] = [
        {field: 'asset', headerName: 'Asset', width: 200, sortable: false},
        {field: 'type', headerName: 'Type', width: 200, sortable: false},
        {field: 'balance', headerName: 'Balance', width: 200},
        {
            field: 'contract', headerName: 'Contract', width: 700, sortable: false, renderCell: (p) => {
                return p.value === '--' ? p.value : <Link to={p.value} network={network}/>
            }
        },
    ];

    const rows = [
        ...[
            balances.find(x => x.asset === 'STX') ? {
                id: 'stx',
                asset: 'STX',
                type: 'stx',
                balance: formatUnits(balances.find(x => x.asset === 'STX')!.balance, 6).toNumber(),
                contract: '--'
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
    ].filter(x => x)

    const gridProps = {
        rows,
        columns,
        disableSelectionOnClick: true,
        getRowId: (r: any) => r.id,
        autoHeight: true
    }

    return <Paper>
        {(() => {
            if (paginate) {
                return <DataGrid {...gridProps} pageSize={5} rowsPerPageOptions={[5]}/>
            }

            return <DataGrid {...gridProps} hideFooter={true}/>
        })()}
    </Paper>
}

export default AssetBalanceList;
