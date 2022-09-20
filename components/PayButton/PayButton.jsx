import React, { useState, useEffect } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Dialog, TextField, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Autocomplete } from '@mui/lab';

import { store } from 'store';
import { Button } from 'components';

import cl from './PayButton.module.scss';

const COST = 40;

const textFields = [
  { label: 'Имя Фамилия', field: 'fullName', placeholder: 'Иван Иванов', required: true },
  { label: 'Email', field: 'email', placeholder: 'ivanov@mail.com', type: 'email', required: true },
  { label: 'Телефон', field: 'phone', placeholder: '+79885554433', required: true }
  // { label: 'Номер договора', field: 'contractNumber', required: true }
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

const PayButton = observer(({ className, children }) => {
  const { user } = store.userStore;
  const { addresses } = store.addressesStore;
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState(getInitialData(toJS(user), toJS(addresses)));
  const [months, setMonths] = useState(1);

  useEffect(() => {
    setData(getInitialData(toJS(user), toJS(addresses)));
  }, [user, addresses]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        body: JSON.stringify({ data, months, returnURL: window.location.href })
      });

      const result = await response.json();

      window.location.replace(result.confirmation.confirmation_url);

      setShowForm(false);
    } catch (err) {
      alert('Произошла ошибка');
      console.error(err);
    }
  };

  const getFullUserAddress = (userAddr) =>
    userAddr && addresses.length
      ? addresses.find((addr) => addr.id === userAddr.id).fullAddress +
        (userAddr.flat && `, кв. ${userAddr.flat}`)
      : '';

  return (
    <>
      <div onClick={() => setShowForm(true)} className={className || ''}>
        {children}
      </div>

      <Dialog maxWidth="md" open={showForm} onClose={() => setShowForm(false)}>
        <form className={cl.form} onSubmit={handleSubmit}>
          <h2 className={cl.title}>Оплата</h2>
          <h4 className={cl.subTitle}>
            За использование приложения &quot;Умный домофон&quot;: {COST * (months || 1)} руб.
          </h4>
          <div className={cl.fields}>
            {textFields.map(({ label, placeholder, type, field, required }) => (
              <TextField
                key={field}
                className={cl.field}
                label={label}
                placeholder={placeholder}
                type={type || 'text'}
                value={data[field] || ''}
                onChange={(ev) => setData({ ...data, [field]: ev.target.value })}
                name={field}
                required={!!required}
              />
            ))}
            <div className={`${cl.field} ${cl.months}`}>
              <FormLabel sx={{ fontSize: 12 }}>Количество месяцев</FormLabel>
              <RadioGroup
                row
                name="months-radio"
                value={months}
                onChange={(ev) => setMonths(Number(ev.target.value))}
              >
                <FormControlLabel value={1} control={<Radio />} label="1" />
                <FormControlLabel value={3} control={<Radio />} label="3" />
                <FormControlLabel value={12} control={<Radio />} label="12" />
              </RadioGroup>
              <TextField
                value={months || ''}
                onChange={(ev) => setMonths(Number(ev.target.value))}
                name="months"
                type="number"
                InputProps={{ inputProps: { min: 1, max: 60, step: 1, required: true } }}
                size="small"
                sx={{ width: 80 }}
              />
            </div>
            {toJS(user)?.addresses.length ? (
              <Autocomplete
                freeSolo
                className={`${cl.field} ${cl.fieldFull}`}
                defaultValue={toJS(user).addresses[0]}
                getOptionLabel={getFullUserAddress}
                options={toJS(user).addresses}
                onChange={(_, addr) => setData({ ...data, address: getFullUserAddress(addr) })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Полный адрес"
                    placeholder="г.Ростов-на-Дону, ул.3-я Строителей, д.25, кв.12"
                    name="address"
                    onChange={(ev) => setData({ ...data, address: ev.target.value })}
                    required
                  />
                )}
              />
            ) : (
              <TextField
                className={`${cl.field} ${cl.fieldFull}`}
                label="Полный адрес"
                placeholder="г.Ростов-на-Дону, ул.3-я Строителей, д.25, кв.12"
                value={data.address || ''}
                onChange={(ev) => setData({ ...data, address: ev.target.value })}
                name="address"
                required
              />
            )}
          </div>

          <div className={cl.buttons}>
            <Button type="submit">
              Оплатить {COST * (months || 1)} <small>руб.</small>
            </Button>
            <Button onClick={() => setShowForm(false)}>Отмена</Button>
          </div>
        </form>
      </Dialog>
    </>
  );
});

export { PayButton };
