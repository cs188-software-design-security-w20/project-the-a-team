import React from 'react';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginRight: theme.spacing(2),
    },
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 350,
  },
}));

export default function Dependent({
  dependent,
  setDependent,
}) {
  const classes = useStyles();

  const setField = (field) => (e) => {
    const { value } = e.target;
    setDependent((orig) => ({
      ...orig,
      [field]: value,
    }));
  };

  return (
    <List className={classes.root}>

      <ListItem>
        <TextField
          value={dependent.firstName}
          onChange={setField('firstName')}
          label="First Name"
          size="medium"
          variant="outlined"
        />
        <TextField
          value={dependent.middleName}
          onChange={setField('middleName')}
          label="Middle Name"
          size="medium"
          variant="outlined"
        />
        <TextField
          value={dependent.lastName}
          onChange={setField('lastMame')}
          label="Last Name"
          size="medium"
          variant="outlined"
        />
        <TextField
          value={dependent.ssn}
          onChange={setField('ssm')}
          label="Social Security Number"
          size="medium"
          variant="outlined"
        />
      </ListItem>

      <ListItem>
        <FormControl
          variant="outlined"
          className={classes.formControl}
        >
          <InputLabel>Dependent Relation</InputLabel>
          <Select
            label="Dependent Relation"
            value={dependent.relation}
            onChange={setField('relation')}
          >
            <MenuItem value="child">
              Child/Stechild/Foster Child
            </MenuItem>
            <MenuItem value="sibling">
              Brother/Sister/Stepbrother/Stepsister
            </MenuItem>
            <MenuItem value="Parent">
              Father/Mother/Stepfather/Stepmother
            </MenuItem>
            <MenuItem value="extendedFamily">
              Uncle/Aunt/Niece/Nephews
            </MenuItem>
            <MenuItem value="inLaws">
              Spouse Family
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          className={classes.formControl}
        >
          <InputLabel>Child Tax Credit</InputLabel>
          <Select
            label="Child Tax Credit"
            value={dependent.childTaxCredit}
            onChange={setField('childTaxCredit')}
          >
            <MenuItem value>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        </FormControl>
      </ListItem>

    </List>
  );
}

Dependent.propTypes = {
  dependent: PropTypes.shape({
    firstName: PropTypes.string,
    middleName: PropTypes.string,
    lastName: PropTypes.string,
    ssn: PropTypes.string,
    relation: PropTypes.string,
    childTaxCredit: PropTypes.bool,
  }).isRequired,

  setDependent: PropTypes.func.isRequired,
};