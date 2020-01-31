import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import loginImg from './images/login.png';

const useStyles = makeStyles(() => ({
  login: {
    height: '100vh',
    width: '100vw',
    backgroundImage: `url('${loginImg}')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top center',
    display: 'flex',
  },

  subtitle: {
    margin: '0px',
    position: 'absolute',
    top: '57.5vh',
    fontSize: '2vw',
    paddingLeft: '1vw',
  },

  title: {
    margin: '0px',
    position: 'absolute',
    top: '61vh',
    fontSize: '6.3vw',
    paddingLeft: '1vw',
  },

  loginButton: {
    position: 'absolute',
    width: '20vw',
    top: '73vh',
    fontSize: '1vw',
    marginLeft: '1vw',
  },
}));

function LoginPage() {
  const classes = useStyles();

  return (
    <div className={classes.login}>
      <h2 className={classes.subtitle}>The easiest way to do easy taxes.</h2>
      <h1 className={classes.title}>TAXIMUS MAXIMUS</h1>
      <button type="button" className={classes.loginButton}>Sign in with Google</button>
    </div>
  );
}

export default LoginPage;
