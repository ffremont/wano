
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { IconButton, Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import InfoIcon from '@material-ui/icons/Info';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TocIcon from '@material-ui/icons/Toc';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { LOCAL_STORAGE_SCORES } from '../../App';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
            fontFamily: 'Poppins, sans-serif',
            fontSize: '220%'
        },
        subTitle: {
            fontSize: '40%'
        },
        myBtn: {
            color: 'white'
        }
    }),
);

const Header = (props: any) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleShare = () => {
        (window as any).navigator.share({
            title: "Wano",
            text: "Entraînez-vous au piano !",
            url: "https://workout-piano.web.app"
        });
    }

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleReset = () => {
        if(window.confirm(`Souhaitez-vous réinitialiser les scores ?`)){
            localStorage.setItem(LOCAL_STORAGE_SCORES, '[]');
        }
        handleClose();
    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        wano <span className={classes.subTitle}>Entraînez-vous !</span>
                    </Typography>

                    {(window as any).navigator.share && (<IconButton
                        onClick={handleShare}
                        className={classes.myBtn}
                    >
                        <ShareIcon />
                    </IconButton>)}

                    <IconButton
                        onClick={handleMenu}
                        className={classes.myBtn}
                    >
                        <MoreVertIcon />
                    </IconButton>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {
                            props.reset();
                            handleReset();
                        }}>
                            <ListItemIcon>
                                <RotateLeftIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                Réinitialiser
                            </Typography>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            props.scores();
                            handleClose();
                        }}>
                            <ListItemIcon>
                                <TocIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                Scores
                            </Typography>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            props.about();
                            handleClose();
                        }}>
                            <ListItemIcon>
                                <InfoIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                A propos
                            </Typography>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            props.soutenir();
                            handleClose();
                        }}>
                            <ListItemIcon>
                                <FavoriteIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                Soutenir
                            </Typography>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;