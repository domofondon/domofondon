import Head from 'next/head';

import { Layout, Container, Requisites } from 'components';

const RequisitesPage = () => (
  <>
    <Head>
      <title>Реквизиты</title>
    </Head>
    <Layout isLanding>
      <Container>
        <Requisites />
      </Container>
    </Layout>
  </>
);

export default RequisitesPage;
