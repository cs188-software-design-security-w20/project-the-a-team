import React from 'react';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import InputAdornment from '@material-ui/core/InputAdornment';
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
    marginRight: theme.spacing(2),
    minWidth: 250,
  },
}));

export default function Form1099B({
  f1099b,
  setF1099B,
}) {
  const classes = useStyles();

  const setField = (field) => (e) => {
    const { value } = e.target;
    setF1099B((orig) => ({
      ...orig,
      [field]: value,
    }));
  };

  return (
    <List className={classes.root}>
      <ListItem>
        <TextField
          value={f1099b.uuid}
          onChange={setField('uuid')}
          label="UUID"
          size="medium"
          variant="outlined"
        />
        <TextField
          value={f1099b.proceeds}
          onChange={setField('proceeds')}
          label="Proceeds"
          size="medium"
          variant="outlined"
        />
        <TextField
          value={f1099b.description}
          onChange={setField('description')}
          label="Description"
          size="medium"
          variant="outlined"
        />
        <TextField
          value={f1099b.basis}
          onChange={setField('basis')}
          label="Basis"
          size="medium"
          variant="outlined"
          InputProps={{
            startAdornment:
  <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </ListItem>

      <ListItem>
        <FormControl
          variant="outlined"
          className={classes.formControl}
        >
          <InputLabel>Long-Term Capital Gain/Loss</InputLabel>
          <Select
            label="Long-Term Capital Gain/Loss"
            value={f1099b.longTerm}
            onChange={setField('longTerm')}
          >
            <MenuItem value>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        </FormControl>
        <TextField
          value={f1099b.taxWithheld}
          onChange={setField('taxWithhed')}
          label="Tax Income Withheld"
          size="medium"
          variant="outlined"
          InputProps={{
            startAdornment:
  <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </ListItem>
    </List>
  );
}

Form1099B.propTypes = {
  f1099b: PropTypes.shape({
    uuid: PropTypes.string,
    description: PropTypes.string,
    proceeds: PropTypes.string,
    basis: PropTypes.string,
    longTerm: PropTypes.bool,
    taxWithheld: PropTypes.string,
  }).isRequired,

  setF1099B: PropTypes.func.isRequired,
};