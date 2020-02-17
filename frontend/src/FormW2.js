import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
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
  onDelete,
}) {
  const classes = useStyles();

  const setNumField = (field) => (e) => {
    const { valueAsNumber } = e.target;
    setFw2((orig) => ({
      ...orig,
      [field]: valueAsNumber,
    }));
  };

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
          value={fw2.taxWithheld}
          onChange={setNumField('taxWithheld')}
          type="number"
          label="Tax Withheld"
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

FormW2.propTypes = {
  fw2: PropTypes.shape({
    employer: PropTypes.string,
    income: PropTypes.number,
    taxWithheld: PropTypes.number,
  }).isRequired,

  setFw2: PropTypes.func.isRequired,

  onDelete: PropTypes.func.isRequired,
};
