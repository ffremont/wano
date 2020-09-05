
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

const useStyles = makeStyles({
    root: {
        width: 500,
    },
    appFooter: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const Footer = (props: any) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    return (
        <div className={classes.appFooter}>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className={classes.root}
            >
                <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
                <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
                <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
            </BottomNavigation>
        </div>
    );
}

export default Footer;