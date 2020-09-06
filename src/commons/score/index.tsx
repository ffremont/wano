import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import './Score.scss';
import { Paper } from '@material-ui/core';
import { HumainScore } from '../HumainScore';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const Score = (props: any) => {
  const [openFlag, setOpenFlag] = React.useState(false);
  const [rows, setRows] = React.useState<HumainScore[]>([]);
  const { onClose, open, scores } = props;

  React.useEffect(() => {
    setOpenFlag(open);
    setRows(scores || []);
  });

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" className="scores-modal" open={openFlag}>
      <DialogTitle id="simple-dialog-title">Scores</DialogTitle>

      <div className="scores-content">
      <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Le</TableCell>
            <TableCell align="right">% de réussite</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.at}>
              <TableCell component="th" scope="row">
                {`${(new Date(row.at)).toLocaleDateString()} ${(new Date(row.at)).toLocaleTimeString()}`}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>

    <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fermer
          </Button>
        </DialogActions>

    </Dialog>
  )
};

export default Score;