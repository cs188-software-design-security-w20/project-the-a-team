import React from 'react';
import uuidv4 from 'uuid/v4';
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
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import config from './config';

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
    textAlign: 'right',
    marginLeft: 'auto',
  },
  wrapper: {
    position: 'relative',
  },
}));

function addColon(str) {
  return str ? `: ${str}` : '';
}

const deletedUUIDs = {
  dependents: [],
  f1099b: [],
  f1099div: [],
  f1099int: [],
  fw2: [],
};

export default function HomePage({ data }) {
  const classes = useStyles();

  const [personalInfo, setPersonalInfo] = React.useState({
    firstName: data.firstName || '',
    middleName: data.middleName || '',
    lastName: data.lastName || '',
    ssn: data.ssn || '',
    filingStatus: ((data.spouseName !== '') && (data.spouseSSN !== '')) ? 'marriedFilingSeparately' : 'single',
    addr1: data.addr1 || '',
    addr2: data.addr2 || '',
    addr3: data.addr3 || '',
    spouseName: data.spouseName || '',
    spouseSSN: data.spouseSSN || '',
    bankAccount: data.bankAccount || '',
    bankRouting: data.bankRouting || '',
    bankIsChecking: Boolean(data.bankIsChecking),
  });

  const [arrDependents, setDependent] = React.useState(data.dependents.map((dependent) => ({
    uuid: dependent.uuid,
    childCredit: Boolean(dependent.childCredit),
    name: dependent.name || '',
    relation: dependent.relation || '',
    ssn: dependent.ssn || '',
  })));

  const [arrW2, setW2] = React.useState(data.fw2.map((fw2) => ({
    uuid: fw2.uuid,
    employer: fw2.employer || '',
    income: fw2.income || 0,
    taxWithheld: fw2.taxWithheld || 0,
  })));

  const [arr1099INT, set1099INT] = React.useState(data.f1099int.map((f1099int) => ({
    uuid: f1099int.uuid,
    employer: f1099int.employer || '',
    income: f1099int.income || 0,
    taxWithheld: f1099int.taxWithheld || 0,
  })));

  const [arr1099B, set1099B] = React.useState(data.f1099b.map((f1099b) => ({
    uuid: f1099b.uuid,
    desc: f1099b.desc || '',
    proceeds: f1099b.proceeds || 0,
    basis: f1099b.basis || 0,
    isLongTerm: Boolean(f1099b.isLongTerm),
    taxWithheld: f1099b.taxWithheld || 0,
  })));

  const [arr1099Div, set1099Div] = React.useState(data.f1099div.map((f1099div) => ({
    uuid: f1099div.uuid,
    payer: f1099div.payer || '',
    ordDividends: f1099div.ordDividends || 0,
    qualDividends: f1099div.qualDividends || 0,
    taxWithheld: f1099div.taxWithheld || 0,
    exemptInterestDiv: f1099div.exemptInterestDiv || 0,
  })));

  const [dlDialogOpen, setDlDialogOpen] = React.useState(false);

  const handleClickOpen = () => {
    setDlDialogOpen(true);
  };

  const handleClose = () => {
    setDlDialogOpen(false);
  };

  const [snackbar, setSnackbar] = React.useState(null);
  const handleSnackbarClose = () => {
    setSnackbar(null);
  };

  const handleClickSave = async () => {
    const dependents = Object.create(null);
    for (const dependent of arrDependents) {
      dependents[dependent.uuid] = dependent;
    }
    for (const dependentUUID of deletedUUIDs.dependents) {
      dependents[dependentUUID] = null;
    }

    const fw2 = Object.create(null);
    for (const w2 of arrW2) {
      fw2[w2.uuid] = w2;
    }
    for (const w2UUID of deletedUUIDs.fw2) {
      fw2[w2UUID] = null;
    }

    const f1099int = Object.create(null);
    for (const form1099Int of arr1099INT) {
      f1099int[form1099Int.uuid] = form1099Int;
    }
    for (const form1099IntUUID of deletedUUIDs.f1099int) {
      f1099int[form1099IntUUID] = null;
    }

    const f1099b = Object.create(null);
    for (const form1099B of arr1099B) {
      f1099b[form1099B.uuid] = form1099B;
    }
    for (const form1099BUUID of deletedUUIDs.f1099b) {
      f1099b[form1099BUUID] = null;
    }

    const f1099div = Object.create(null);
    for (const form1099Div of arr1099Div) {
      f1099div[form1099Div.uuid] = form1099Div;
    }
    for (const form1099DivUUID of deletedUUIDs.f1099div) {
      f1099div[form1099DivUUID] = null;
    }

    const body = {
      ...personalInfo,
      dependents,
      fw2,
      f1099int,
      f1099b,
      f1099div,
    };

    try {
      const response = await fetch(new URL('/tax', config.backendURL), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      if (!response.ok) {
        throw response;
      }

      deletedUUIDs.dependents = [];
      deletedUUIDs.f1099b = [];
      deletedUUIDs.f1099div = [];
      deletedUUIDs.f1099int = [];
      deletedUUIDs.fw2 = [];

      setSnackbar('Saved.');
    } catch (err) {
      let handled = false;
      if (err instanceof Response) {
        try {
          const json = await err.json();
          setSnackbar(`Error: ${json.message}`);
          handled = true;
        } catch (err2) {
          // We give up.
        }
      }
      if (!handled) {
        setSnackbar('Error: failed to save.');
        console.error(err); // eslint-disable-line no-console
      }
    }
  };

  const checkUUID = (arr) => {
    const uuids = new Set(arr.map((entry) => entry.uuid));
    let uuid = uuidv4();
    while (uuids.has(uuid)) {
      uuid = uuidv4();
    }
    return uuid;
  };

  const removeDependent = (index) => {
    setDependent((orig) => {
      const copy = [...orig];
      deletedUUIDs.dependents.push(orig[index].uuid);
      copy.splice(index, 1);
      return copy;
    });
  };

  const remove1099B = (index) => {
    set1099B((orig) => {
      const copy = [...orig];
      deletedUUIDs.f1099b.push(orig[index].uuid);
      copy.splice(index, 1);
      return copy;
    });
  };

  const remove1099Div = (index) => {
    set1099Div((orig) => {
      const copy = [...orig];
      deletedUUIDs.f1099div.push(orig[index].uuid);
      copy.splice(index, 1);
      return copy;
    });
  };

  const remove1099Int = (index) => {
    set1099INT((orig) => {
      const copy = [...orig];
      deletedUUIDs.f1099int.push(orig[index].uuid);
      copy.splice(index, 1);
      return copy;
    });
  };

  const removeW2 = (index) => {
    setW2((orig) => {
      const copy = [...orig];
      deletedUUIDs.fw2.push(orig[index].uuid);
      copy.splice(index, 1);
      return copy;
    });
  };

  const addNewDependent = () => {
    setDependent((orig) => [...orig, {
      uuid: checkUUID(orig),
      name: '',
      ssn: '',
      relation: '',
      childCredit: false,
    }]);
  };

  const addNewW2 = () => {
    setW2((orig) => [...orig, {
      uuid: checkUUID(orig),
      employer: '',
      income: 0,
      taxWithheld: 0,
    }]);
  };

  const addNew1099INT = () => {
    set1099INT((orig) => [...orig, {
      uuid: checkUUID(orig),
      payer: '',
      income: 0,
      usSavingTreasInterest: 0,
      taxExemptInterest: 0,
      taxWithheld: 0,
    }]);
  };

  const addNew1099B = () => {
    set1099B((orig) => [...orig, {
      uuid: checkUUID(orig),
      desc: '',
      proceeds: 0,
      basis: 0,
      isLongTerm: false,
      taxWithheld: 0,
    }]);
  };

  const addNew1099Div = () => {
    set1099Div((orig) => [...orig, {
      uuid: checkUUID(orig),
      payer: '',
      ordDividends: 0,
      qualDividends: 0,
      taxWithheld: 0,
      exemptInterestDiv: 0,
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
            <ExpansionPanel key={shortTitle + obj.uuid}>
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
                <Typography color="textSecondary" variant="h3" className={classes.customizeToolbar}>
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
            <Dependent
              dependent={dependent}
              setDependent={setSubfield(setDependent, index)}
              onDelete={() => removeDependent(index)}
            />
          ),
          arrDependents,
          addNewDependent,
          'name',
        )}

        {formBlock(
          'Form W-2 Income Information',
          'Form W-2',
          (fw2, index) => (
            <FormW2 fw2={fw2} setFw2={setSubfield(setW2, index)} onDelete={() => removeW2(index)} />
          ),
          arrW2,
          addNewW2,
          'employer',
        )}

        {formBlock(
          'Form 1099-INT Information',
          'Form 1099-INT',
          (f1099int, index) => (
            <Form1099INT
              f1099int={f1099int}
              setF1099INT={setSubfield(set1099INT, index)}
              onDelete={() => remove1099Int(index)}
            />
          ),
          arr1099INT,
          addNew1099INT,
          'payer',
        )}

        {formBlock(
          'Form 1099-B Information',
          'Form 1099-B',
          (f1099b, index) => (
            <Form1099B
              f1099b={f1099b}
              setF1099B={setSubfield(set1099B, index)}
              onDelete={() => remove1099B(index)}
            />
          ),
          arr1099B,
          addNew1099B,
          'desc',
        )}

        {formBlock(
          'Form 1099-DIV Information',
          'Form 1099-DIV',
          (f1099div, index) => (
            <Form1099Div
              f1099div={f1099div}
              setF1099Div={setSubfield(set1099Div, index)}
              onDelete={() => remove1099Div(index)}
            />
          ),
          arr1099Div,
          addNew1099Div,
          'payer',
        )}

        <Box ml={-3}>
          <Toolbar>
            <br />
            <Button
              size="large"
              variant="outlined"
              onClick={() => {
                window.location = new URL('/auth/logout', config.backendURL);
              }}
            >
              <Typography variant="h4">LOGOUT</Typography>
            </Button>

            <div className={classes.unaffected}>
              <Button size="large" variant="outlined">
                <Typography variant="h4" onClick={handleClickSave}>
                  SAVE
                </Typography>
              </Button>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                open={Boolean(snackbar)}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbar}
              />

              <Button size="large" variant="outlined" onClick={handleClickOpen}>
                <Typography variant="h4">FINISH</Typography>
              </Button>

              <Dialog
                open={dlDialogOpen}
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
                  <Button
                    color="textSecondary"
                    onClick={() => {
                      window.open(new URL('/tax/pdf', config.backendURL),
                        '_blank');
                    }}
                  >
                    Download
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Toolbar>
        </Box>
      </div>
    </Container>
  );
}

HomePage.propTypes = {
  data: PropTypes.shape({
    firstName: PropTypes.string,
    middleName: PropTypes.string,
    lastName: PropTypes.string,
    ssn: PropTypes.string,
    filingStatus: PropTypes.string,
    addr1: PropTypes.string,
    addr2: PropTypes.string,
    addr3: PropTypes.string,
    spouseName: PropTypes.string,
    spouseSSN: PropTypes.string,
    bankAccount: PropTypes.string,
    bankRouting: PropTypes.string,
    bankIsChecking: PropTypes.bool,

    dependents: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      ssn: PropTypes.string,
      relation: PropTypes.string,
      childCredit: PropTypes.bool,
    }).isRequired).isRequired,

    f1099b: PropTypes.arrayOf(PropTypes.shape({
      desc: PropTypes.string,
      proceeds: PropTypes.number,
      basis: PropTypes.number,
      isLongTerm: PropTypes.bool,
      taxWithheld: PropTypes.number,
    }).isRequired).isRequired,

    f1099div: PropTypes.arrayOf(PropTypes.shape({
      payer: PropTypes.string,
      ordDividends: PropTypes.number,
      qualDividends: PropTypes.number,
      taxWithheld: PropTypes.number,
      exemptInterestDiv: PropTypes.number,
    }).isRequired).isRequired,

    f1099int: PropTypes.arrayOf(PropTypes.shape({
      payer: PropTypes.string,
      income: PropTypes.number,
      usSavingTreasInterest: PropTypes.number,
      taxExemptInterest: PropTypes.number,
      taxWithheld: PropTypes.number,
    }).isRequired).isRequired,

    fw2: PropTypes.arrayOf(PropTypes.shape({
      employer: PropTypes.string,
      income: PropTypes.number,
      taxWithheld: PropTypes.number,
    }).isRequired).isRequired,
  }).isRequired,
};
