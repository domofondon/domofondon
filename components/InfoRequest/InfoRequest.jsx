import { useState, useEffect } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Paper, Dialog, TextField } from '@mui/material';
import { Autocomplete } from '@mui/lab';
import BuildIcon from '@mui/icons-material/Build';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideocamIcon from '@mui/icons-material/Videocam';

import { store } from 'store';
import { Button, PayButton } from 'components';

import cl from './InfoRequest.module.scss';

const SERVICES = {
  MASTER: 'Вызов мастера',
  PAY: 'Оплата онлайн',
  FACE_ID: 'Заявка на Face ID',
  KEYS: 'Ключи для домофона',
  CHANGE: 'Замена трубки',
  VIDEO: 'Видеорегистрация в доме',
};

const textFields = [
  { label: 'Имя Фамилия', field: 'fullName' },
  { label: 'Email', field: 'email', type: 'email' },
  { label: 'Телефон', field: 'phone', required: true },
  // { label: 'Номер договора', field: 'contractNumber' },
];

const allFields = [
  ...textFields,
  { label: 'Адрес', field: 'address' },
  { label: 'Сообщение', field: 'message' },
];

const getInitialData = (user, addresses) => {
  if (!user || addresses.length === 0) return {};

  const data = {};
  textFields.forEach((el) => {
    data[el.field] = user[el.field];
  });

  const firstAddr = user.addresses[0];
  if (firstAddr) {
    data.address =
      addresses.find((addr) => addr.id === firstAddr.id).fullAddress +
      (firstAddr.flat && `, кв. ${firstAddr.flat}`);
    data.message = '';
  }
  return data;
};

const InfoRequest = observer(({ className }) => {
  const { user } = store.userStore;
  const { addresses } = store.addressesStore;
  const [service, setService] = useState(null);
  const [data, setData] = useState(getInitialData(toJS(user), toJS(addresses)));
  const [isSent, setIsSent] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setData(getInitialData(toJS(user), toJS(addresses)));
  }, [user, addresses]);

  const handleSubmit = (ev) => {
    ev.preventDefault();

    const body = {
      service,
      fields: allFields.map((el) => ({ ...el, value: data[el.field] })),
    };

    fetch('/api/sendMail', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.status !== 200) setIsError(true);
      setIsSent(true);
    });
    return false;
  };

  const closeForm = () => {
    setService(null);
    setTimeout(() => {
      setIsSent(false);
      setIsError(false);
    }, 200);
  };

  const getFullUserAddress = (userAddr) =>
    userAddr && addresses.length
      ? addresses.find((addr) => addr.id === userAddr.id).fullAddress +
        (userAddr.flat && `, кв. ${userAddr.flat}`)
      : '';

  return (
    <div className={`${cl.root} ${className || ''}`}>
      <h2 className='h2'>Услуги</h2>
      <div className={cl.cards}>
        <Paper className={cl.card}>
          <PaymentIcon className={cl.icon} />
          <h3>{SERVICES.PAY}</h3>
          <PayButton>
            <Button className={cl.button}>Оплатить</Button>
          </PayButton>
        </Paper>

        <Paper className={cl.card}>
          <AccountBalanceWalletIcon className={cl.icon} />
          <h3>{SERVICES.FACE_ID}</h3>
          <Button onClick={() => setService(SERVICES.FACE_ID)} className={cl.button}>
            Заказать
          </Button>
        </Paper>

        <Paper className={cl.card}>
          <BuildIcon className={cl.icon} />
          <h3>{SERVICES.MASTER}</h3>
          <Button onClick={() => setService(SERVICES.MASTER)} className={cl.button}>
            Заказать
          </Button>
        </Paper>

        <Paper className={cl.card}>
          <VpnKeyIcon className={cl.icon} />
          <h3>{SERVICES.KEYS}</h3>
          <Button onClick={() => setService(SERVICES.KEYS)} className={cl.button}>
            Заказать
          </Button>
        </Paper>

        <Paper className={cl.card}>
          <CallEndIcon className={cl.icon} />
          <h3>{SERVICES.CHANGE}</h3>
          <Button onClick={() => setService(SERVICES.CHANGE)} className={cl.button}>
            Заказать
          </Button>
        </Paper>

        <Paper className={cl.card}>
          <VideocamIcon className={cl.icon} />
          <h3>{SERVICES.VIDEO}</h3>
          <Button onClick={() => setService(SERVICES.VIDEO)} className={cl.button}>
            Заказать
          </Button>
        </Paper>
      </div>

      <Dialog maxWidth='md' open={!!service} onClose={closeForm}>
        {!isSent && (
          <form className={cl.form} onSubmit={handleSubmit}>
            <h2 className={cl.title}>{service}</h2>
            <div className={cl.fields}>
              {textFields.map(({ label, type, field, required }) => (
                <TextField
                  key={field}
                  className={cl.field}
                  label={label}
                  type={type || 'text'}
                  value={data[field] || ''}
                  onChange={(ev) => setData({ ...data, [field]: ev.target.value })}
                  name={field}
                  required={!!required}
                />
              ))}
              <Autocomplete
                freeSolo
                className={cl.field}
                defaultValue={toJS(user) && toJS(user).addresses[0]}
                getOptionLabel={getFullUserAddress}
                options={toJS(user) ? toJS(user).addresses : []}
                onChange={(_, addr) => setData({ ...data, address: getFullUserAddress(addr) })}
                renderInput={(params) => <TextField {...params} label='Адрес' name='address' />}
                required
              />
            </div>
            <label className={cl.message}>
              Комментарий
              <textarea
                name='message'
                onChange={(ev) => setData({ ...data, message: ev.target.value })}
              />
            </label>

            <div className={cl.buttons}>
              <Button type='submit'>Отправить</Button>
              <Button onClick={closeForm}>Отмена</Button>
            </div>
          </form>
        )}

        {isSent && (
          <div className={cl.form}>
            {!isError && <h2>Заявка отправлена!</h2>}
            {isError && (
              <>
                <h2>Не удалось отправить заявку</h2>
                <p>Пожалуйста, позвоните по телефону или напишите в WhatsApp.</p>
              </>
            )}
            <div className={cl.buttons}>
              <Button onClick={closeForm}>Закрыть</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
});

export { InfoRequest };
