import React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

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

export default CloseModal;
