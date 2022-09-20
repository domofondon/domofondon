import Head from 'next/head';

import { Landing } from 'modules';

export default function Home() {
  return (
    <>
      <Head>
        <title>ПрофДелоДон</title>
        <meta name='description' content='Установка и обслуживание домофонов в Ростове-на-Дону' />
      </Head>

      <Landing />
    </>
  );
}
