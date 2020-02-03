import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

const useStyles = makeStyles(({
  root: {
    width: '100%',
  },
  heading: {
  },
  customizeToolbar: {
    minHeight: 150,
  },
  affected: {
    textAlign: 'right',
  },
  unaffected: {
    flip: false,
    textAlign: 'right',
  },
  wrapper: {
    position: 'relative',
  },
}));

const arrW2 = [];
const arr1099INT = [];
const arr1099B = [];

export default function HomePage() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [FW2, setW2] = React.useState([]);
  const [F1099INT, set1099INT] = React.useState([]);
  const [F1099B, set1099B] = React.useState([]);

  const handleFinishClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReturnClick = () => {
    handleClose();
  };

  const addNewW2 = () => {
    const panel = (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="h4">W2 Income Information</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            w2
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
    arrW2.push(panel);
    setW2([...arrW2]);
  };

  const addNew1099INT = () => {
    const panel = (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="h4">1099INT Information</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            1099INT
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
    arr1099INT.push(panel);
    set1099INT([...arr1099INT]);
  };

  const addNew1099B = () => {
    const panel = (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="h4">1099B Information</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            1099B
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
    arr1099B.push(panel);
    set1099B([...arr1099B]);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Container>
      <div className={classes.root}>

        <AppBar position="static" style={{ background: '#F6F930' }}>
          <Toolbar>
            <Grid container alignItems="flex-start" justify="flex-end" direction="row">
              <Box mt={2}>
                <Typography color="textSecondary" variant="h3" className={classes.customizeToolbar} inline>
                  Taximus Maximus
                </Typography>
              </Box>
            </Grid>
          </Toolbar>
        </AppBar>

        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h4">Personal and Family Information</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List className={classes.root}>
              <ListItem>
                <Box mt={1} mr={1}>
                  <Typography>
                    First Name:
                  </Typography>
                </Box>
                <TextField size="small" id="outlined-basic" variant="outlined" />

                <Box ml={3} mt={1} mr={1}>
                  <Typography>
                    Middle Name:
                  </Typography>
                </Box>
                <TextField size="small" id="outlined-basic" variant="outlined" />

                <Box ml={3} mt={1} mr={1}>
                  <Typography>
                    Last Name:
                  </Typography>
                </Box>
                <TextField size="small" id="outlined-basic" variant="outlined" />
              </ListItem>

              <ListItem>
                <Box mt={1} mr={1}>
                  <Typography style={{ whiteSpace: 'pre-line' }}>
                    Social Security Number:
                  </Typography>
                </Box>
                <TextField size="small" id="outlined-basic" variant="outlined" />

                <Box ml={3} mt={1} mr={1}>
                  <Typography style={{ whiteSpace: 'pre-line' }}>
                    Filing Status:
                  </Typography>
                </Box>
                <Box mt={1}>
                  <Typography style={{ whiteSpace: 'pre-line' }}>
                    Single
                  </Typography>
                </Box>
                <Box mt={1} mr={1}>
                  <Checkbox
                    value="secondary"
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                </Box>

              </ListItem>
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        {FW2.map((point) => point)}
        <Button
          variant="contained"
          style={{
            backgroundColor: '#f6f930',
            padding: '9px 18px',
          }}
          className={classes.button}
          startIcon={<AddCircleIcon fontSize="large" />}
          onClick={() => addNewW2()}
        >
          <Typography variant="h4">Add W2 Section</Typography>
        </Button>

        <Box mr={1} mx="auto">
          {F1099INT.map((point) => point)}
          <Button
            variant="contained"
            style={{
              backgroundColor: '#f6f930',
              padding: '9px 18px',
            }}
            className={classes.button}
            startIcon={<AddCircleIcon fontSize="large" />}
            onClick={() => addNew1099INT()}
          >
            <Typography variant="h4">Add 1099-INT Section</Typography>
          </Button>
        </Box>

        {F1099B.map((point) => point)}
        <Button
          variant="contained"
          style={{
            backgroundColor: '#f6f930',
            padding: '9px 18px',
          }}
          className={classes.button}
          startIcon={<AddCircleIcon fontSize="large" />}
          onClick={() => addNew1099B()}
        >
          <Typography variant="h4">Add 1099B Section</Typography>
        </Button>

        <div className={classes.unaffected}>
          <Box mt={2}>
            <Button size="large" variant="outlined">
              <Typography variant="h4">SAVE</Typography>
            </Button>
            <Button size="large" variant="outlined" onClick={handleFinishClick}>
              <Typography variant="h4">FINISH</Typography>
            </Button>
          </Box>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box ml={2} mr={2} mt={2}>
              <Typography variant="h5" className={classes.typography} inline>
                Congratulations! You have completed your
              </Typography>
            </Box>
            <Box ml={2} mr={2}>
              <Typography variant="h5" className={classes.typography} inline>
                Taximus Maximus submission. You can
              </Typography>
            </Box>
            <Box ml={2} mr={2}>
              <Typography variant="h5" className={classes.typography} inline>
                either download your filled in tax form as
              </Typography>
            </Box>
            <Box ml={2} mr={2}>
              <Typography variant="h5" className={classes.typography} inline>
                a PDF, or go back and edit your information.
              </Typography>
            </Box>

            <Box mx="auto" p={2}>
              <Button size="large" variant="outlined" onClick={handleReturnClick}>
                <Typography variant="h5">CLOSE</Typography>
              </Button>
              <Button size="large" variant="outlined">
                <Typography variant="h5">DOWNLOAD</Typography>
              </Button>
            </Box>

          </Popover>
        </div>
      </div>
    </Container>
  );
}
