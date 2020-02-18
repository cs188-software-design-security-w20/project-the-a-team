export default process.env.NODE_ENV === 'production' ? {
  backendURL: 'https://api.tax.timothygu.me/',
} : {
  backendURL: 'http://localhost:8080/',
};
