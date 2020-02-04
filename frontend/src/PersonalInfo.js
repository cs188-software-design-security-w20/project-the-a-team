import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginRight: theme.spacing(1),
    },
  },
}));

export default function PersonalInfo({
  personalInfo,
  setPersonalInfo,
}) {
  const classes = useStyles();

  const setField = (field) => (e) => {
    const { value } = e.target;
    setPersonalInfo((orig) => ({
      ...orig,
      [field]: value,
    }));
  };

  return (
    <List className={classes.root}>
      <ListItem>
        <TextField
          value={personalInfo.firstName}
          onChange={setField('firstName')}
          label="First Name"
          size="small"
          variant="outlined"
        />

        <TextField
          value={personalInfo.middleName}
          onChange={setField('middleName')}
          label="Middle Name"
          size="small"
          variant="outlined"
        />

        <TextField
          value={personalInfo.lastName}
          onChange={setField('lastName')}
          label="Last Name"
          size="small"
          variant="outlined"
        />
      </ListItem>

      <ListItem>
        <Box mt={1} mr={1}>
          <Typography style={{ whiteSpace: 'pre-line' }}>
            Social Security Number:
          </Typography>
        </Box>
        <TextField size="small" variant="outlined" />

        <Box ml={3} mt={1} mr={1}>
          <Typography style={{ whiteSpace: 'pre-line' }}>
            Filing Status:
          </Typography>
        </Box>
        <Box mt={1}>
          <Typography style={{ whiteSpace: 'pre-line' }}>
            Single
          </Typography>
        </Box>
        <Box mt={1} mr={1}>
          <Checkbox
            value="secondary"
            color="primary"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </Box>

      </ListItem>
    </List>
  );
}

PersonalInfo.propTypes = {
  personalInfo: PropTypes.shape({
    firstName: PropTypes.string,
    middleName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,

  setPersonalInfo: PropTypes.func.isRequired,
};
