
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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
        subTitle:{
            fontSize:'40%'
        }
    }),
);

const Header = (props: any) => {
    const classes = useStyles();

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        wano <span className={classes.subTitle}>Entraînez-vous !</span>
                    </Typography>
                    
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;