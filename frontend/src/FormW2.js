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
        value={fw2.employer}
        onChange={setField('employer')}
        label="Employer"
        size="small"
        variant="outlined"
      />
    </div>
  );
}

FormW2.propTypes = {
  fw2: PropTypes.shape({
    employer: PropTypes.string,
  }).isRequired,

  setFw2: PropTypes.func.isRequired,
};
