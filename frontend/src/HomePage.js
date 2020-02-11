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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import PersonalInfo from './PersonalInfo';
import Dependent from './Dependent';
import FormW2 from './FormW2';
import Form1099INT from './Form1099INT';
import Form1099B from './Form1099B';
import Form1099Div from './Form1099Div';

const useStyles = makeStyles(({
  root: {
    width: '100%',
  },
  heading: {
  },
  customizeToolbar: {
    textTransform: 'uppercase',
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

  const [personalInfo, setPersonalInfo] = React.useState({
    firstName: '',
    middleName: '',
    lastName: '',
    ssn: '',
    filingStatus: '',
    addr1: '',
    addr2: '',
    addr3: '',
    spouseFirstName: '',
    spouseLastName: '',
    spouseSSN: '',
    bankAccount: '',
    bankRouting: '',
    bankIsChecking: false,
  });

  const [arrDependents, setDependent] = React.useState([]);

  const [arrW2, setW2] = React.useState([]);

  const [arr1099INT, set1099INT] = React.useState([]);

  const [arr1099B, set1099B] = React.useState([]);

  const [arr1099Div, set1099Div] = React.useState([]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addNewDependent = () => {
    setDependent((orig) => [...orig, {
      firstName: '',
      middleName: '',
      lastName: '',
      ssn: '',
      relation: '',
      childTaxCredit: false,
    }]);
  };

  const addNewW2 = () => {
    setW2((orig) => [...orig, {
      uuid: '',
      employer: '',
      income: 0,
      taxWithheld: 0,
    }]);
  };

  const addNew1099INT = () => {
    set1099INT((orig) => [...orig, {
      uuid: '',
      payer: '',
      income: 0,
      usSavingTreasInterest: 0,
      taxExemptInterest: 0,
      taxWithheld: 0,
    }]);
  };

  const addNew1099B = () => {
    set1099B((orig) => [...orig, {
      uuid: '',
      desc: '',
      proceeds: 0,
      basis: 0,
      isLongTerm: false,
      taxWithheld: 0,
    }]);
  };

  const addNew1099Div = () => {
    set1099Div((orig) => [...orig, {
      uuid: '',
      payer: '',
      ordDividends: 0,
      qualDividends: 0,
      taxWithheld: 0,
      exemptInterestDiv: 0,
    }]);
  };

  return (
    <Container>
      <div className={classes.root}>

        <AppBar position="static" style={{ background: '#F6F930' }}>
          <Toolbar>
            <Grid container alignItems="flex-start" justify="flex-end" direction="row">
              <Box mt={2}>
                <Typography color="textSecondary" variant="h3" className={classes.customizeToolbar} inline>
                  <b>Taximus</b>
                  <br />
                  <b>Maximus</b>
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

        {arrDependents.map((fdependent, index) => (
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="h4">
                Dependent Information
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Dependent
                fdependent={fdependent}
                setFDependent={(newFDependent) => {
                  setDependent((origArray) => {
                    const copy = [...origArray];
                    if (typeof newFDependent === 'function') {
                      newFDependent = newFDependent(copy[index]);
                    }
                    copy[index] = newFDependent;
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
          onClick={() => addNewDependent()}
        >
          <Typography variant="h4">Add Dependent</Typography>
        </Button>

        <Box mr={1} mx="auto">
          {arrW2.map((fw2, index) => (
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography variant="h4">
                  Form W-2 Income Information
                </Typography>
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
        </Box>
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
                <Typography variant="h4">
                  Form 1099INT Information
                </Typography>
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

        <Box mr={1} mx="auto">
          {arr1099B.map((f1099b, index) => (
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography variant="h4">
                  Form 1099B Information
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Form1099B
                  f1099b={f1099b}
                  setF1099B={(newF1099b) => {
                    set1099B((origArray) => {
                      const copy = [...origArray];
                      if (typeof newF1099b === 'function') {
                        newF1099b = newF1099b(copy[index]);
                      }
                      copy[index] = newF1099b;
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
          onClick={() => addNew1099B()}
        >
          <Typography variant="h4">Add 1099-B Section</Typography>
        </Button>

        <Box mr={1} mx="auto">
          {arr1099Div.map((f1099div, index) => (
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography variant="h4">
                  Form 1099Div Information
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Form1099Div
                  f1099div={f1099div}
                  setF1099Div={(newF1099Div) => {
                    set1099Div((origArray) => {
                      const copy = [...origArray];
                      if (typeof newF1099Div === 'function') {
                        newF1099Div = newF1099Div(copy[index]);
                      }
                      copy[index] = newF1099Div;
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
          onClick={() => addNew1099Div()}
        >
          <Typography variant="h4">Add 1099Div Section</Typography>
        </Button>

        <div className={classes.unaffected}>
          <Box mt={2}>
            <Button size="large" variant="outlined">
              <Typography variant="h4">SAVE</Typography>
            </Button>

            <Button size="large" variant="outlined" onClick={handleClickOpen}>
              <Typography variant="h4">FINISH</Typography>
            </Button>

            <Dialog
              open={open}
              onClose={handleClose}
            >
              <DialogTitle>
                Congratulations!
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  You have completed your Taximus Maximus submission.
                  <br />
                  You can either download your filled in tax form as
                  <br />
                  a PDF, or go back and edit your information.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleClose} color="textSecondary">
                  Go Back
                </Button>
                <Button onClick={handleClose} color="textSecondary">
                  Download
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

        </div>
      </div>
    </Container>
  );
}
