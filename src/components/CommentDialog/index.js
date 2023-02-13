import React, { useState, useRef, useContext, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/Input';
import SendIcon from '@mui/icons-material/Send';
import { nanoid } from 'nanoid'
import PubSub from 'pubsub-js'

import Comment from './Comment';
import MoreMenu from './MoreMenu';
import { UserContext } from '../../context/UserContext';
import { set, remove } from '../../utils/markerStorage'
import { OPEN_COMMENT_DIALOG, CREATE_MARKER, REMOVE_MARKER } from '../../constants/topic';

const dateFormatOption = { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false };

export default function CommentDialog() {

    const [open, setOpen] = useState(false)
    const [commentMarker, setCommentMarker] = useState({ comments: [] })
    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext);
    const inputRef = useRef();

    const handleOpen = () => setOpen(true)

    useEffect(() => {
        const openCommentDialogSubscriber = (_, marker) => {
            setCommentMarker({ ...marker })
            handleOpen();
        }
        PubSub.subscribe(OPEN_COMMENT_DIALOG, openCommentDialogSubscriber)
        return () => {
            PubSub.unsubscribe(openCommentDialogSubscriber);
        };
    }, [])

    const handleClose = () => {
        setOpen(false)
        handleClearMessage();
        if (commentMarker.comments.length) {
            set({ ...commentMarker });
            if (commentMarker.shouldCreateSprite) {
              PubSub.publish(CREATE_MARKER, commentMarker);
            }
        }
    };

    const handleSendMessage = () => {
        if (!message.length) {
            return;
        }

        const createAt = new Date().toLocaleDateString('en-us', dateFormatOption);
        const newComment = { id: nanoid(), username: user.username, message, createAt };
        setCommentMarker(prev => ({ ...prev, comments: [...prev.comments, newComment] }))
        handleClearMessage();

        // In the example video, the input is always be focused.
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleTypeMessage = (e) => setMessage(e.target.value);

    const handleClearMessage = () => setMessage('');

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            handleSendMessage()
        }
    }

    /** Both Resolve/Delete button remove comments from local storage and canvas  */
    const handleClickDelete = () => {
        setOpen(false)
        handleClearMessage();
        remove(commentMarker.name)
        PubSub.publish(REMOVE_MARKER, commentMarker)
    }

    const isEmpty = commentMarker.comments.length === 0;
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            hideBackdrop
            fullWidth
            maxWidth="sm"
        >
            {!isEmpty &&
                <>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormGroup>
                            <FormControlLabel control={<Switch />} label="Resolve" onClick={handleClickDelete} />
                        </FormGroup>
                        <MoreMenu onClickDelete={handleClickDelete} />
                    </DialogTitle>
                    <DialogContent dividers>
                        <Stack spacing={1}>
                            {commentMarker.comments.map(v =>
                                <Comment key={v.id} {...v} />
                            )}
                        </Stack>
                    </DialogContent>
                </>
            }
            <DialogActions sx={{ paddingX: '24px' }}>
                <Input
                    inputRef={inputRef}
                    onChange={handleTypeMessage}
                    onKeyDown={handleKeyDown}
                    placeholder={`${isEmpty ? "Add a comment." : "Leave a reply."}`}
                    value={message}
                    autoFocus
                    fullWidth
                    sx={{ fontSize: 16, fontWeight: 'bold' }}
                />
                <IconButton onClick={handleSendMessage} variant="contained"><SendIcon color='primary' /></IconButton>
            </DialogActions>
        </Dialog>
    );
}