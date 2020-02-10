import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginRight: theme.spacing(2),
    },
  },
}));

export default function FormW2({
  fw2,
  setFw2,
}) {
  const classes = useStyles();

  const setField = (field) => (e) => {
    const { value } = e.target;
    setFw2((orig) => ({
      ...orig,
      [field]: value,
    }));
  };

  return (
    <div className={classes.root}>
      <TextField
        value={fw2.uuid}
        onChange={setField('uuid')}
        label="UUID"
        size="medium"
        variant="outlined"
      />
      <TextField
        value={fw2.employer}
        onChange={setField('employer')}
        label="Employer"
        size="medium"
        variant="outlined"
      />
      <TextField
        value={fw2.income}
        onChange={setField('income')}
        label="Income"
        size="medium"
        variant="outlined"
        InputProps={{
          startAdornment:
  <InputAdornment position="start">$</InputAdornment>,
        }}
      />
      <TextField
        value={fw2.taxWithheld}
        onChange={setField('taxWithheld')}
        label="Tax Withheld"
        size="medium"
        variant="outlined"
        InputProps={{
          startAdornment:
  <InputAdornment position="start">$</InputAdornment>,
        }}
      />
    </div>
  );
}

FormW2.propTypes = {
  fw2: PropTypes.shape({
    uuid: PropTypes.string,
    employer: PropTypes.string,
    income: PropTypes.number,
    taxWithheld: PropTypes.number,
  }).isRequired,

  setFw2: PropTypes.func.isRequired,
};
