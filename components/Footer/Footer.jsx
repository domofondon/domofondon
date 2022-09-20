import Link from 'next/link';

import { Container } from 'components';

import cl from './Footer.module.scss';

const Footer = () => (
  <footer className={cl.root}>
    <Container>
      <div className={cl.contacts}>
        <h4>Контакты</h4>
        <ul>
          <li>Адрес: г. Ростов-на-Дону, ул. Тельмана, д. 20, оф. 5</li>
          <li>Телефон: +7(863)310-02-26, +7(996)353-01-17 (WhatsApp)</li>
          <li>Email: profdelodon@yandex.ru</li>
        </ul>
      </div>
      <div className={cl.links}>
        <h4>Ссылки</h4>
        <ul>
          {/* <li>Стоимость услуги &quot;Умный домофон&quot;: 40 руб/мес</li> */}
          <li>
            <Link href='/contract-offer.pdf' >
              <a target='_blank'>Договор оферты</a>
            </Link>
          </li>
          <li>
            <Link href='/politics'>
              <a target='_blank'>Политика конфиденциальности</a>
            </Link>
          </li>
          <li>
            <Link href='/requisites'>
              <a>Реквизиты</a>
            </Link>
          </li>
        </ul>
      </div>
    </Container>
  </footer>
);

export { Footer };
