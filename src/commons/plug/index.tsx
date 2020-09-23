import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import './Plug.scss';
import { DialogContent, Typography, Avatar, LinearProgress } from '@material-ui/core';
import UsbIcon from '@material-ui/icons/Usb';

const Plug = (props: any) => {
  const [openFlag, setOpenFlag] = React.useState(false);

  React.useEffect(() => {
    setOpenFlag(props.open);
  });

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Dialog disableBackdropClick={true} onClose={handleClose} aria-labelledby="simple-dialog-title" fullWidth={false} className="plug-modal" open={openFlag}>
      

      <DialogContent className="plug-content" dividers>
      <div className="centered">
        
        <Avatar className="large-avatar" alt="wano">
            <UsbIcon></UsbIcon>
          </Avatar>

          <Typography className="text">Branchez votre piano numérique à votre appareil</Typography>

          <LinearProgress className="my-progress" color="secondary" />
      </div>
      
      </DialogContent>


    </Dialog>
  )
};

export default Plug;