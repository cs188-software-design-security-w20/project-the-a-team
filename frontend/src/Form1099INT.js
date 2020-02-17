import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
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
}));

export default function Form1099INT({
  f1099int,
  setF1099INT,
  onDelete,
}) {
  const classes = useStyles();

  const setNumField = (field) => (e) => {
    const { valueAsNumber } = e.target;
    setF1099INT((orig) => ({
      ...orig,
      [field]: valueAsNumber,
    }));
  };

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
          value={f1099int.payer}
          onChange={setField('payer')}
          label="Payer"
          size="medium"
          variant="outlined"
          fullWidth
        />
      </ListItem>
      <ListItem>
        <TextField
          value={f1099int.income}
          onChange={setNumField('income')}
          type="number"
          label="Income"
          size="medium"
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          value={f1099int.usSavingTreasInterest}
          onChange={setNumField('usSavingTreasInterest')}
          type="number"
          label="US Savings and Treasury Interest"
          size="medium"
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          value={f1099int.taxExemptInterest}
          onChange={setNumField('taxExemptInterest')}
          type="number"
          label="Tax Exempt Interest"
          size="medium"
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />

        <TextField
          value={f1099int.taxWithheld}
          onChange={setNumField('taxWithheld')}
          type="number"
          label="Tax Income Withheld"
          size="medium"
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />

        <IconButton aria-label="delete" onClick={onDelete}>
          <DeleteOutlineIcon />
        </IconButton>
      </ListItem>

    </List>
  );
}

Form1099INT.propTypes = {
  f1099int: PropTypes.shape({
    payer: PropTypes.string,
    income: PropTypes.number,
    usSavingTreasInterest: PropTypes.number,
    taxExemptInterest: PropTypes.number,
    taxWithheld: PropTypes.number,
  }).isRequired,

  setF1099INT: PropTypes.func.isRequired,

  onDelete: PropTypes.func.isRequired,
};
