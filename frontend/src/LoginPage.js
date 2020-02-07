import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import loginImg from './images/login.png';

import config from './config';

const useStyles = makeStyles((theme) => ({
  login: {
    height: '100vh',
    width: '100vw',
    backgroundImage: `url('${loginImg}')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top center',
    display: 'flex',
  },

  container: {
    position: 'absolute',
    top: '57vh',
    paddingLeft: '1vw',
  },

  subtitle: {
    margin: 0,
    lineHeight: 1,
    fontSize: '2vw',
  },

  title: {
    margin: 0,
    lineHeight: 0.8,
    fontSize: '6.3vw',
    textTransform: 'uppercase',
  },

  loginButton: {
    marginTop: theme.spacing(2),
    width: '20vw',
    fontSize: '1vw',
  },
}));

function LoginPage() {
  const classes = useStyles();

  return (
    <div className={classes.login}>
      <div className={classes.container}>
        <h2 className={classes.subtitle}>The easiest way to do easy taxes.</h2>
        <h1 className={classes.title}>Taximus Maximus</h1>
        <button
          type="button"
          className={classes.loginButton}
          onClick={() => {
            window.location = new URL('/auth/google', config.backendURL);
          }}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
