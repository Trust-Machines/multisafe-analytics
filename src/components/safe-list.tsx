import React, {useState} from 'react';
import Box from '@mui/material/Box';
import {blue, grey} from '@mui/material/colors';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import {DataGrid, GridColDef, GridSortItem} from '@mui/x-data-grid';
import moment from 'moment/moment';
import {formatUnits} from '../helper';
import {Safe} from '../types';

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

export default SafeList;
