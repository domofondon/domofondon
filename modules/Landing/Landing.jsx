import { InfoRequest, Container, Layout } from 'components';

import cl from './Landing.module.scss';

const Landing = () => (
  <Layout isLanding className={cl.root}>
    <div className={cl.bgTech}>
      <Container className={cl.containerCentered}>
        <h1>Domofondon.ru</h1>
      </Container>
    </div>

    <Container>
      <InfoRequest />
    </Container>

    <div className={cl.bgWhatsApp}>
      <Container className={cl.containerCentered}>
        <h3>Перейти в WhatsApp бот</h3>
        <a
          href={`https://api.whatsapp.com/send/?phone=${process.env.NEXT_PUBLIC_WHATSAPP_BOT}`}
          target='_blanc'
        >
          Whats App
        </a>
      </Container>
    </div>

    {/* <Container>
      <section className={cl.about}>
        <h2 className='h2'>О нас</h2>
        <p>
          Системы контроля доступом (СКД) — автоматизированные контрольно-пропускные системы,
          которые позволяют управлять безопасностью объекта и осуществлять контроль доступа. СКД,
          собранная «под ключ», исполняет несколько функций, в том числе:{' '}
        </p>
        <ul>
          <li>разграничение доступа сотрудников;</li>
          <li>регистрацию посетителей;</li>
          <li>электронный учет посетителей;</li>
          <li>учет рабочего времени персонала.</li>
        </ul>
        <p>
          Правильный выбор контрольно-пропускной системы влияет и на безопасность предприятия, и на
          комфорт сотрудников. Системы, предоставляемые компанией «ПрофДелоДон», благодаря
          многозадачности и возможностям модификации системы, способны удовлетворить любые
          требования заказчика.
        </p>
        <p>
          В состав системы безопасности входит широкий спектр самых разных устройств контроля
          доступа, например:
        </p>
        <ul>
          <li>считывателей;</li>
          <li>картоприемников;</li>
          <li>адаптеров;</li>
          <li>контроллеров.</li>
        </ul>
      </section>
    </Container> */}
  </Layout>
);

export { Landing };
