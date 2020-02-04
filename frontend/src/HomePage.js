import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

import PersonalInfo from './PersonalInfo';
import FormW2 from './FormW2';
import Form1099INT from './Form1099INT';

const useStyles = makeStyles(({
  root: {
    width: '100%',
  },
  heading: {
  },
  customizeToolbar: {
    minHeight: 150,
    textAlign: 'right',
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

export default function HomePage() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [personalInfo, setPersonalInfo] = React.useState({
    firstName: '',
    middleName: '',
    lastName: '',
  });
  const [arrW2, setW2] = React.useState([]);
  const [arr1099INT, set1099INT] = React.useState([]);
  const [arr1099B, set1099B] = React.useState([]);

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
    setW2((orig) => [...orig, {
      employer: '',
    }]);
  };

  const addNew1099INT = () => {
    set1099INT((orig) => [...orig, {
      payer: '',
    }]);
  };


  /*  const addNew1099INT = () => {
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
    set1099INT((orig) => [...orig, panel]);
  }; */

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
    set1099B((orig) => [...orig, panel]);
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
                  Taximus
                  <br />
Maximus
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
            <PersonalInfo personalInfo={personalInfo} setPersonalInfo={setPersonalInfo} />
          </ExpansionPanelDetails>
        </ExpansionPanel>

        {arrW2.map((fw2, index) => (
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="h4">Form W-2 Income Information</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormW2
                fw2={fw2}
                setFw2={(newFw2) => {
                  setW2((origArray) => {
                    const copy = [...origArray];
                    if (typeof newFw2 === 'function') {
                      newFw2 = newFw2(copy[index]);
                    }
                    copy[index] = newFw2;
                    return copy;
                  });
                }}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
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
          <Typography variant="h4">Add W-2 Section</Typography>
        </Button>

        <Box mr={1} mx="auto">
          {arr1099INT.map((f1099int, index) => (
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography variant="h4">Form 1099INT Information</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Form1099INT
                  f1099int={f1099int}
                  setF1099INT={(newF1099int) => {
                    set1099INT((origArray) => {
                      const copy = [...origArray];
                      if (typeof newF1099int === 'function') {
                        newF1099int = newF1099int(copy[index]);
                      }
                      copy[index] = newF1099int;
                      return copy;
                    });
                  }}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </Box>
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
          <Typography variant="h4">Add 1099INT Section</Typography>
        </Button>

        {/*   {arr1099INT.map((point) => point)}
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
        </Box> */}

        <Box mr={1} mx="auto">
          {arr1099B.map((point) => point)}
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
            <Typography variant="h4">Add 1099-B Section</Typography>
          </Button>
        </Box>
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
              <Typography variant="h5" className={classes.typography} inline>
                Taximus Maximus submission. You can
              </Typography>
              <Typography variant="h5" className={classes.typography} inline>
                either download your filled in tax form as
              </Typography>
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
