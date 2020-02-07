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
    <div className={classes.root}>
      <TextField
        value={f1099b.proceeds}
        onChange={setField('proceeds')}
        label="Proceeds"
        size="small"
        variant="outlined"
      />
    </div>
  );
}

Form1099B.propTypes = {
  f1099b: PropTypes.shape({
    proceeds: PropTypes.string,
  }).isRequired,

  setF1099B: PropTypes.func.isRequired,
};
