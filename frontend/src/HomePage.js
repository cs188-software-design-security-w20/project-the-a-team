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

function addColon(str) {
  return str ? `: ${str}` : '';
}

export default function HomePage() {
  const classes = useStyles();

  const [personalInfo, setPersonalInfo] = React.useState({
    firstName: '',
    middleName: '',
    lastName: '',
    ssn: '',
    filingStatus: '',
    address: '',
    spouseFirstName: '',
    spouseMiddleName: '',
    spouseLastName: '',
    spouseSSN: '',
    bankAcctNum: '',
    bankRoutingNum: '',
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
      income: '',
      taxWithheld: '',
    }]);
  };

  const addNew1099INT = () => {
    set1099INT((orig) => [...orig, {
      uuid: '',
      payer: '',
      income: '',
      savingsInterest: '',
      taxExemptInterest: '',
      taxWithheld: '',

    }]);
  };

  const addNew1099B = () => {
    set1099B((orig) => [...orig, {
      uuid: '',
      description: '',
      proceeds: '',
      basis: '',
      longTerm: false,
      taxWithheld: '',
    }]);
  };

  const addNew1099Div = () => {
    set1099Div((orig) => [...orig, {
      uuid: '',
      payer: '',
      ordinaryDividends: '',
      qualifiedDividends: '',
      taxWithheld: '',
      exemptInterestDiv: '',
    }]);
  };

  function setSubfield(setter, index) {
    return (newObj) => {
      setter((origArray) => {
        const copy = [...origArray];
        if (typeof newObj === 'function') {
          newObj = newObj(copy[index]);
        }
        copy[index] = newObj;
        return copy;
      });
    };
  }

  function formBlock(title, shortTitle, getComponent, array, addNew, summaryProp) {
    return (
      <>
        <Box mr={1} mx="auto">
          {array.map((obj, index) => (
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h4">
                  {title + addColon(obj[summaryProp])}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {getComponent(obj, index)}
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
          onClick={addNew}
        >
          <Typography variant="h4">{`Add ${shortTitle}`}</Typography>
        </Button>
      </>
    );
  }

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
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h4">Personal and Family Information</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <PersonalInfo personalInfo={personalInfo} setPersonalInfo={setPersonalInfo} />
          </ExpansionPanelDetails>
        </ExpansionPanel>

        {formBlock(
          'Dependent Information',
          'Dependent',
          (dependent, index) => (
            <Dependent dependent={dependent} setDependent={setSubfield(setDependent, index)} />
          ),
          arrDependents,
          addNewDependent,
          'firstName',
        )}

        {formBlock(
          'Form W-2 Income Information',
          'Form W-2',
          (fw2, index) => <FormW2 fw2={fw2} setFw2={setSubfield(setW2, index)} />,
          arrW2,
          addNewW2,
          'employer',
        )}

        {formBlock(
          'Form 1099-INT Information',
          'Form 1099-INT',
          (f1099int, index) => (
            <Form1099INT f1099int={f1099int} setF1099INT={setSubfield(set1099INT, index)} />
          ),
          arr1099INT,
          addNew1099INT,
          'payer',
        )}

        {formBlock(
          'Form 1099-B Information',
          'Form 1099-B',
          (f1099b, index) => (
            <Form1099B f1099b={f1099b} setF1099B={setSubfield(set1099B, index)} />
          ),
          arr1099B,
          addNew1099B,
          'description',
        )}

        {formBlock(
          'Form 1099-DIV Information',
          'Form 1099-DIV',
          (f1099div, index) => (
            <Form1099Div f1099div={f1099div} setF1099Div={setSubfield(set1099Div, index)} />
          ),
          arr1099Div,
          addNew1099Div,
          'payer',
        )}

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
