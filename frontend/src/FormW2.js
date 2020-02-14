import React from 'react';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginRight: theme.spacing(2),
    },
    width: '100%',
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
    <List className={classes.root}>
      <ListItem>
        <TextField
          value={fw2.employer}
          onChange={setField('employer')}
          label="Employer"
          size="medium"
          variant="outlined"
          fullWidth
        />
      </ListItem>
      <ListItem>
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
      </ListItem>
    </List>
  );
}

FormW2.propTypes = {
  fw2: PropTypes.shape({
    employer: PropTypes.string,
    income: PropTypes.number,
    taxWithheld: PropTypes.number,
  }).isRequired,

  setFw2: PropTypes.func.isRequired,
};
