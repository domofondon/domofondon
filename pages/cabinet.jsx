import Head from 'next/head';
import { observer } from 'mobx-react-lite';

import { Login, UserCabinet, AdminCabinet } from 'modules';
import { store } from 'store';
import { Layout, Loading, Container } from 'components';

export default observer(() => {
  const { isGettingAuth, isAdmin } = store;
  const { user } = store.userStore;
  const { admin } = store.adminStore;

  const isUserCabinet = !isAdmin && user;
  const isAdminCabinet = isAdmin && admin;

  return (
    <>
      <Head>
        <title>Личный кабинет</title>
      </Head>
      <Layout>
        <Container>
          {isGettingAuth 
          ? <Loading />
          : <>
            {!isUserCabinet && !isAdminCabinet && <Login />}
            {isUserCabinet && <UserCabinet />}
            {isAdminCabinet && <AdminCabinet />}
            </>
          }
        </Container>
      </Layout>
    </>
  );
});
