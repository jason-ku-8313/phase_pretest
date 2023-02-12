import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Delete from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function MoreMenu({ onClickDelete }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl)

    const handleClickMenu = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleClickDelete = () => {
        onClickDelete();
    }

    return (
        <>
            <IconButton onClick={handleClickMenu}>
                <MoreHorizIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClickDelete}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </>
    )
}
