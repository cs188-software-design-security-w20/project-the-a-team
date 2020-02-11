import React from 'react';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginRight: theme.spacing(2),
    },
  },
}));

export default function Form1099INT({
  f1099int,
  setF1099INT,
}) {
  const classes = useStyles();

  const setField = (field) => (e) => {
    const { value } = e.target;
    setF1099INT((orig) => ({
      ...orig,
      [field]: value,
    }));
  };

  return (
    <List className={classes.root}>
      <ListItem>
        <TextField
          value={f1099int.uuid}
          onChange={setField('uuid')}
          label="UUID"
          size="medium"
          variant="outlined"
        />
        <TextField
          value={f1099int.payer}
          onChange={setField('payer')}
          label="Payer"
          size="medium"
          variant="outlined"
        />
        <TextField
          value={f1099int.income}
          onChange={setField('income')}
          label="Income"
          size="medium"
          variant="outlined"
          InputProps={{
            startAdornment:
  <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </ListItem>

      <ListItem>
        <TextField
          value={f1099int.savingsInterest}
          onChange={setField('savingsInterest')}
          label="US Savings Interest"
          size="medium"
          variant="outlined"
          I
          InputProps={{
            startAdornment:
  <InputAdornment position="start">$</InputAdornment>,
          }}
        />

        <TextField
          value={f1099int.taxExemptInterest}
          onChange={setField('taxExemptInterest')}
          label="Tax Exempt Interest"
          size="medium"
          variant="outlined"
          InputProps={{
            startAdornment:
  <InputAdornment position="start">$</InputAdornment>,
          }}
        />

        <TextField
          value={f1099int.taxWithheld}
          onChange={setField('taxWithheld')}
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

Form1099INT.propTypes = {
  f1099int: PropTypes.shape({
    uuid: PropTypes.string,
    payer: PropTypes.string,
    income: PropTypes.number,
    savingsInterest: PropTypes.number,
    taxExemptInterest: PropTypes.number,
    taxWithheld: PropTypes.number,
  }).isRequired,

  setF1099INT: PropTypes.func.isRequired,
};
