import Box from '@mui/material/Box';
import {blue} from '@mui/material/colors';
import LaunchIcon from '@mui/icons-material/Launch';
import {getContractInfo} from '../stacks-api';
import {Network} from '../types';

const Link = (props: { to: string, network: Network }) => {
    const {to, network} = props;

    const clicked = () => {
        if (to.indexOf('.') > 0) { // contract
            getContractInfo(to, network).then(r => {
                window.open(`https://explorer.stacks.co/txid/${r.tx_id}?chain=${network}`, '_blank');
            });
            return;
        }

        if (to.startsWith('0x')) { // tx
            window.open(`https://explorer.stacks.co/txid/${to}?chain=${network}`, '_blank');
        }

        // account
        window.open(`https://explorer.stacks.co/address/${to}?chain=${network}`, '_blank');
    }

    return <Box component="span" onClick={clicked} sx={{
        color: blue['600'],
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        svg: {
            opacity: '0'
        },
        ':hover': {
            textDecoration: 'underline',
            svg: {
                opacity: '1'
            },
        }
    }}>{to} <LaunchIcon sx={{ml: '4px', fontSize: '14px'}}/></Box>
}

export default Link;
