import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from 'next/head';

import { Header, Footer } from 'components';

import cl from './Layout.module.scss';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2f7491',
      light: '#9dffae',
    },
    secondary: {
      main: '#fff',
    },
    default: {
      main: '#d4d4d4',
    },
  },
});

const Layout = (props) => {
  const { children, isLanding } = props;

  return (
    <>
      <Head>
        <link rel='apple-touch-icon' sizes='180x180' href='favicon/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='favicon/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='favicon/favicon-16x16.png' />
        <link rel='manifest' href='favicon/site.webmanifest' />
        <link rel='mask-icon' href='favicon/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <ThemeProvider theme={theme}>
        <div className={`${cl.root} ${isLanding ? cl.landing : ''}`}>
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
};

export { Layout };
