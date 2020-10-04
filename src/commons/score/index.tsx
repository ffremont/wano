import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AppBar from '@material-ui/core/AppBar';
import './Score.scss';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { HumainScore } from '../HumainScore';
import { Bar } from 'react-chartjs-2';

const Score = (props: any) => {
  const [openFlag, setOpenFlag] = React.useState(false);
  const [data, setData] = React.useState({
    datasets: [{
      label:'x',
      data:[5]
    }]
  });
  const [rows, setRows] = React.useState<HumainScore[]>([]);
  const { onClose, open, scores } = props;

  React.useEffect(() => {
    setOpenFlag(open);
    setRows(scores || []);

    const groupByDay :any= {};
    for(let i = 0; i<scores.length; i++){
      const date = (new Date(scores[i].at)).toLocaleDateString();
      groupByDay[date] = (groupByDay[date] || []);
      groupByDay[date].push(scores[i].value);
    }

    const average = (arr:any) => arr.reduce( ( p:any, c:any ) => p + c, 0 ) / arr.length;
    
    setData({
      datasets : Object.keys(groupByDay).map((att:any) => {
        return {
          label: att,
          data: [average(groupByDay[att])]
        }
      })
    })
    
  }, [openFlag, scores]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" fullScreen={true} className="scores-modal" open={openFlag}>
      <DialogTitle id="simple-dialog-title">Scores</DialogTitle>

      <AppBar>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">
            Scores
            </Typography>
        </Toolbar>
      </AppBar>

      <div className="scores-content">
        <Bar height={70} legend={{position:'bottom'}} data={data}/>

        <TableContainer className="my-table-container" component={Paper}>
          <Table stickyHeader aria-label="simple table">
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


    </Dialog>
  )
};

export default Score;