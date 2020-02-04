import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginRight: theme.spacing(1),
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
    <div className={classes.root}>
      <TextField
        value={f1099int.payer}
        onChange={setField('payer')}
        label="Payer"
        size="small"
        variant="outlined"
      />
    </div>
  );
}

Form1099INT.propTypes = {
  f1099int: PropTypes.shape({
    payer: PropTypes.string,
  }).isRequired,

  setF1099INT: PropTypes.func.isRequired,
};
