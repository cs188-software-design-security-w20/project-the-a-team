import React from 'react';
// import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
//  import CssBaseline from '@material-ui/core/CssBaseline';
// import yellow from '@material-ui/core/colors/yellow';
//  import LoginPage from './LoginPage';
import HomePage from './HomePage';

/* const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: yellow,
    secondary: yellow,
  },
})); */

function App() {
  return (
    /* <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoginPage />
    </ThemeProvider> */
    <div>
      <HomePage />
    </div>
  );
}

export default App;
