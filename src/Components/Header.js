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
import Login from './login';
import { signOut } from "firebase/auth";
import { notifications } from '@mantine/notifications';
import { auth } from './../utils/firebase';
import { useNavigate } from 'react-router-dom';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});

const Header = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [geöffnet, setGeöffnet] = React.useState(false); 
    const navigate = useNavigate();   

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        console.log("Login");
        handleClose();
        setGeöffnet(true);
    };

    const handleRegister = () => {
        console.log("Registrierung");
        handleClose();
        setModalOpen(true);
    };

    const handleEinstellungen = () => {
        handleClose();
        navigate('/Einstellungen');
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('user');
            notifications.show({
                title: 'Logout erfolgreich! 🎉',
                message: 'Du hast dich erfolgreich abgemeldet!',
                color: 'green',
                autoClose: 2000,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogoClick = () => {
        navigate('/');
    }

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
                            {localStorage.getItem('user') ? (
                                <>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    <MenuItem onClick={handleEinstellungen}>Einstellungen</MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem onClick={handleLogin}>Login</MenuItem>
                                    <MenuItem onClick={handleRegister}>Registrieren</MenuItem>
                                </>
                            )}
                        </Menu>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={handleLogoClick} style={{cursor: 'pointer'}}>
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

        <Login 
            geöffnet={geöffnet}
            setGeöffnet={setGeöffnet}
        />
        </>
    );
}
export default Header;