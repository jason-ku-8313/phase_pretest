import { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

export default function Welcome() {
    const [open, setOpen] = useState(true);
    const [username, setUsername] = useState('');
    const { user, setUser } = useContext(UserContext);

    const handleClose = (_, reason) => {
        // Prevent the user to close popup by clicking backdrop  
        if (reason === 'backdropClick') {
            return;
        }
        setOpen(false);
    };

    const handleUpdateUsername = (e) => {
        setUsername(e.target.value);
    };

    const handleEnterUsername = () => {
        if (!username.length) {
            return;
        }
        setUser({ ...user, username });
        handleClose();
    }
    
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            handleEnterUsername()
        }
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogActions>
                <TextField 
                id="standard-basic" 
                label="User Name" 
                variant="standard" 
                onChange={handleUpdateUsername}
                onKeyDown={handleKeyDown} 
            />
                <Button onClick={handleEnterUsername}>Enter</Button>
            </DialogActions>
        </Dialog>
    )
}
