import React, { useEffect, useState } from 'react';
import {
  createMuiTheme, makeStyles, responsiveFontSizes, ThemeProvider,
} from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';

import config from './config';
import LoginPage from './LoginPage';
import HomePage from './HomePage';

const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      main: '#f6f930',
    },
    secondary: {
      main: '#f6f930',
    },
  },
}));

const useStyles = makeStyles((innerTheme) => ({
  backdrop: {
    zIndex: innerTheme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function App() {
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(new URL('/tax', config.backendURL), {
          credentials: 'include',
        });
        console.log(response.status);
        if (!response.ok) {
          throw new Error('Response not okay');
        }
        const data = await response.json();
        console.log(data);
        setLoginData(data);
      } catch (err) {
        console.error(err);
        setLoginData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const innerComponent = loginData === null ? <LoginPage /> : <HomePage data={loginData} />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {innerComponent}
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
}

export default App;
