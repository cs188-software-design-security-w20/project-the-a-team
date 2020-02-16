import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
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
    width: '100%',
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 350,
  },
}));

export default function Dependent({
  dependent,
  setDependent,
  onDelete,
}) {
  const classes = useStyles();

  const invalidSSN = dependent.ssn !== '' && !/^[0-9]{9}$/.test(dependent.ssn);

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
          value={dependent.name}
          onChange={setField('name')}
          label="Full Name"
          variant="outlined"
          fullWidth
        />
      </ListItem>

      <ListItem>
        <TextField
          value={dependent.ssn}
          onChange={setField('ssn')}
          label="Social Security Number"
          size="medium"
          variant="outlined"
          error={invalidSSN}
          helperText={invalidSSN ? 'Enter a valid SSN.' : ''}
        />
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
            value={dependent.childCredit}
            onChange={setField('childCredit')}
          >
            <MenuItem value>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        </FormControl>

        <IconButton aria-label="delete" onClick={onDelete}>
          <DeleteOutlineIcon />
        </IconButton>
      </ListItem>

    </List>
  );
}

Dependent.propTypes = {
  dependent: PropTypes.shape({
    name: PropTypes.string,
    ssn: PropTypes.string,
    relation: PropTypes.string,
    childCredit: PropTypes.bool,
  }).isRequired,

  setDependent: PropTypes.func.isRequired,

  onDelete: PropTypes.func.isRequired,
};
