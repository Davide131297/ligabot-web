import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Registrierung from './Registrierung';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});

const Header = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [modalOpen, setModalOpen] = React.useState(false);    

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRegister = () => {
        console.log("Registrierung");
        handleClose();
        setModalOpen(true);
    };

    return (
        <>
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={handleClick}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleClose}>Login</MenuItem>
                            <MenuItem onClick={handleRegister}>Registrieren</MenuItem>
                        </Menu>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Discord LigaBot
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        </ThemeProvider>
        <Registrierung 
            modalOpen={modalOpen} 
            setModalOpen={setModalOpen} 
        />
        </>
    );
}
export default Header;