import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import './About.scss';
import { DialogContent, Typography, Avatar } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const About = (props: any) => {
  const [openFlag, setOpenFlag] = React.useState(false);

  React.useEffect(() => {
    setOpenFlag(props.open);
  });

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" fullWidth={true} className="about-modal" open={openFlag}>
      <DialogTitle id="simple-dialog-title">A propos</DialogTitle>

      <DialogContent dividers>
      <div className="centered">
        
        <Avatar className="large-avatar" variant="square" alt="wano" src="https://workout-piano.web.app/logo192.png" />
      </div>
      <Typography gutterBottom>
        Wano (v{(window as any).appversion}) est une application d'entraînement au piano permettant de développer :
        <ul>
          <li>la lecture de note</li>
          <li>l'agilité</li></ul> 
        Le principe est de générer des notes ou des accords en fonction de vos préférences. Ainsi, vous préparez votre programme d'entrainement sur-mesure.
          Cette application est réalisée par Florent FREMONT, un développeur passionné.  
      </Typography>

      </DialogContent>

    <DialogActions>
    <Button color="secondary" href="mailto:ff.fremont.florent@gmail.com">
            Envoyer un mail
          </Button>
          <Button onClick={handleClose} color="primary">
            Fermer
          </Button>
        </DialogActions>

    </Dialog>
  )
};

export default About;