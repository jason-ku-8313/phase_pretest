import React from 'react'
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

export default function Comment({ username, message, createAt }) {
    return (
        <Grid container rowSpacing={1} alignContent="center" sx={{ fontWeight: 'bold' }} >
            <Grid item xs={8} sx={{
                display: 'flex',
                flexDirection: 'row',
                fontSize: 22
            }}>
                <Avatar sx={{ 
                    maxWidth: 24, 
                    maxHeight: 24, 
                    mr: '5px',
                    fontSize: 14 
                }}>
                    {username.charAt(0)}
                </Avatar>
                <Box>{username}</Box>
            </Grid>
            <Grid item xs={4} sx={{ color: 'grey', fontSize: 16, textAlign: 'right' }}>{createAt}</Grid>
            <Grid item xs={12} sx={{ fontSize: 16, wordWrap: 'break-word' }}>{message}</Grid>
        </Grid>
    )
}
