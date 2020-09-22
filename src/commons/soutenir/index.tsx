import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import './Soutenir.scss';
import { DialogContent, Typography, Avatar } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import EuroIcon from '@material-ui/icons/Euro';
import StarIcon from '@material-ui/icons/Star';
import GitHubIcon from '@material-ui/icons/GitHub';

const Soutenir = (props: any) => {
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
        
        <Avatar className="large-avatar" alt="soutenir" src="/images/soutenir.jpg" />
      </div>
      <Typography gutterBottom>
        Cette initiative open source a pour objectif de permettre aux nouveaux pianistes de s'entraîner efficacement.
        Le contenu de cette application se veut évolutif en fonction de vos besoins. 
        Il est donc important de me faire vos retours. 
        <br/>Vous pouvez aider cette application si vous l'aimez en :
        <ul>
          <li>donnant votre avis</li>
          <li>donnant quelques €€</li>
          <li>en participant au code / fonctionnalités</li>
        </ul>
      </Typography>

      </DialogContent>

    <DialogActions>
      <Button startIcon={<EuroIcon />} color="secondary" href="https://paypal.me/ffremont?locale.x=fr_FR">
            Donner
          </Button>
          <Button startIcon={<GitHubIcon />} color="secondary" href="https://github.com/ffremont/wano">
            
          </Button>
          <Button startIcon={<StarIcon />} color="secondary" href="mailto:ff.fremont.florent@gmail.com">
            Mon avis
          </Button>
          <Button onClick={handleClose} color="primary">
            Fermer
          </Button>
        </DialogActions>

    </Dialog>
  )
};

export default Soutenir;