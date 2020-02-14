import React from 'react';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginRight: theme.spacing(2),
    },
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 200,
  },
}));

export default function PersonalInfo({
  personalInfo,
  setPersonalInfo,
}) {
  const classes = useStyles();

  const setField = (field) => (e) => {
    const { value } = e.target;
    setPersonalInfo((orig) => ({
      ...orig,
      [field]: value,
    }));
  };

  return (
    <List className={classes.root}>
      <ListItem>
        <TextField
          size="medium"
          value={personalInfo.firstName}
          onChange={setField('firstName')}
          label="First Name"
          variant="outlined"
        />

        <TextField
          value={personalInfo.middleName}
          onChange={setField('middleName')}
          label="Middle Name"
          size="medium"
          variant="outlined"
        />

        <TextField
          value={personalInfo.lastName}
          onChange={setField('lastName')}
          label="Last Name"
          size="medium"
          variant="outlined"
        />

        <TextField
          value={personalInfo.ssn}
          onChange={setField('ssn')}
          label="Social Security Number"
          size="medium"
          variant="outlined"
        />

        <FormControl
          variant="outlined"
          className={classes.formControl}
        >
          <InputLabel>
            Filing Status
          </InputLabel>
          <Select
            label="Filing Status"
            value={personalInfo.filingStatus}
            onChange={setField('filingStatus')}
          >
            <MenuItem value="marriedFilingJointly">
              Married Filing Jointly
            </MenuItem>
            <MenuItem value="marriedFilingSeparately">
              Married Filing Separately
            </MenuItem>
            <MenuItem value="headOfHousehold">
              Head of Household
            </MenuItem>
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="widowed">Widowed</MenuItem>
          </Select>
        </FormControl>

      </ListItem>

      <ListItem>
        <TextField
          value={personalInfo.addr1}
          onChange={setField('addr1')}
          label="Mailing Address"
          size="medium"
          variant="outlined"
          fullWidth
        />
      </ListItem>

      <ListItem>
        <TextField
          value={personalInfo.addr2}
          onChange={setField('addr2')}
          label="Apartment Number"
          size="medium"
          variant="outlined"
        />
        <TextField
          value={personalInfo.addr3}
          onChange={setField('add3')}
          label="City, State and Zip Code"
          size="medium"
          variant="outlined"
        />
      </ListItem>

      <ListItem>
        <TextField
          value={personalInfo.spouseFirstName}
          onChange={setField('spouseFirstName')}
          label="Spouse First Name"
          size="medium"
          variant="outlined"
        />
        <TextField
          value={personalInfo.spouseLastName}
          onChange={setField('spouseLastName')}
          label="Spouse Last Name"
          size="medium"
          variant="outlined"
        />
        <TextField
          value={personalInfo.spouseSSN}
          onChange={setField('spouseSSN')}
          label="Spouse SSN"
          size="medium"
          variant="outlined"
        />
      </ListItem>

      <ListItem>
        <TextField
          value={personalInfo.bankAccount}
          onChange={setField('bankAccount')}
          label="Bank Account Number"
          size="medium"
          variant="outlined"
        />
        <TextField
          value={personalInfo.bankRouting}
          onChange={setField('bankRouting')}
          label="Bank Routing Number"
          size="medium"
          variant="outlined"
        />
        <FormControl
          variant="outlined"
          className={classes.formControl}
        >
          <InputLabel>
            Checking/Savings
          </InputLabel>
          <Select
            label="Filing Status"
            value={personalInfo.filingStatus}
            onChange={setField('filingStatus')}
          >
            <MenuItem value>Checkings</MenuItem>
            <MenuItem value={false}>Savings</MenuItem>
          </Select>
        </FormControl>
      </ListItem>

    </List>
  );
}

PersonalInfo.propTypes = {
  personalInfo: PropTypes.shape({
    firstName: PropTypes.string,
    middleName: PropTypes.string,
    lastName: PropTypes.string,
    ssn: PropTypes.string,
    filingStatus: PropTypes.string,
    addr1: PropTypes.string,
    addr2: PropTypes.string,
    addr3: PropTypes.string,
    bankAccount: PropTypes.string,
    bankRouting: PropTypes.string,
    bankIsChecking: PropTypes.bool,
    spouseFirstName: PropTypes.string,
    spouseLastName: PropTypes.string,
    spouseSSN: PropTypes.string,
  }).isRequired,

  setPersonalInfo: PropTypes.func.isRequired,
};
