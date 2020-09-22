
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';

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
                            props.about();
                            handleClose();
                        }}>A propos</MenuItem>
                        <MenuItem onClick={() => {
                            props.soutenir();
                            handleClose();
                        }}>Soutenir</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;