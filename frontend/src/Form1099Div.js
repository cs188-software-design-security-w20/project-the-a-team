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
    width: '100%',
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 250,
  },
}));

export default function Form1099Div({
  f1099div,
  setF1099Div,
}) {
  const classes = useStyles();

  const setField = (field) => (e) => {
    const { value } = e.target;
    setF1099Div((orig) => ({
      ...orig,
      [field]: value,
    }));
  };

  return (
    <List className={classes.root}>
      <ListItem>
        <TextField
          value={f1099div.payer}
          onChange={setField('payer')}
          label="Payer"
          size="medium"
          variant="outlined"
          fullWidth
        />
      </ListItem>

      <ListItem>
        <TextField
          value={f1099div.ordDividends}
          onChange={setField('ordDividends')}
          label="Total Ordinary Dividends"
          size="medium"
          variant="outlined"
          InputProps={{
            startAdornment:
  <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          value={f1099div.qualDividends}
          onChange={setField('qualDividends')}
          label="Total Qualified Dividends"
          size="medium"
          variant="outlined"
          InputProps={{
            startAdornment:
  <InputAdornment position="start">$</InputAdornment>,
          }}
        />

        <TextField
          value={f1099div.taxWithheld}
          onChange={setField('taxWithhed')}
          label="Tax Income Withheld"
          size="medium"
          variant="outlined"
          InputProps={{
            startAdornment:
  <InputAdornment position="start">$</InputAdornment>,
          }}
        />

        <TextField
          value={f1099div.exemptInterestDiv}
          onChange={setField('exemptInterestDiv')}
          label="Exempt Interest Dividends"
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

Form1099Div.propTypes = {
  f1099div: PropTypes.shape({
    payer: PropTypes.string,
    ordDividends: PropTypes.number,
    qualDividends: PropTypes.number,
    taxWithheld: PropTypes.number,
    exemptInterestDiv: PropTypes.number,
  }).isRequired,

  setF1099Div: PropTypes.func.isRequired,
};
