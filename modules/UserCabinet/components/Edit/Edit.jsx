import { useState, useCallback } from 'react';
import { TextField, IconButton, Tooltip } from '@mui/material';
import { Autocomplete } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

import { store } from 'store';
import { Button } from 'components';

import cl from './Edit.module.scss';

const textFields = [
  { label: 'Имя', field: 'name' },
  { label: 'Фамилия', field: 'surname' },
  { label: 'Email', field: 'email' },
  { label: 'Телефон', field: 'phone' },
  // { label: 'Номер договора', field: 'contractNumber' },
];

const Edit = ({ onSave, onCancel }) => {
  const { user } = store.userStore;
  const { addresses } = store.addressesStore;
  const [data, setData] = useState(user);
  const [newAddress, setNewAddress] = useState({ id: '', flat: '' });

  const handleChange = useCallback((field, value) => setData({ ...data, [field]: value }), [data]);

  const addAddress = () => {
    if (!newAddress.id) return;
    setData({ ...data, addresses: [...data.addresses, newAddress] });
  };

  const removeAddress = (id, flat) => {
    setData({
      ...data,
      addresses: data.addresses.filter((addr) => !(addr.id === id && addr.flat === flat)),
    });
  };

  const handleSaveClick = async () => {
    await onSave(data);
    onCancel();
  };

  return (
    <form className={cl.root}>
      <h2 className={cl.title}>Редактировать</h2>
      <div className={cl.fields}>
        {textFields.map(({ label, field }) => (
          <TextField
            key={field}
            className={cl.field}
            label={label}
            value={data[field] || ''}
            onChange={(ev) => handleChange(field, ev.target.value)}
            name={field}
          />
        ))}
      </div>

      <h4 className={cl.subTitle}>Адреса</h4>
      <div className={cl.newAddress}>
        <Autocomplete
          options={addresses}
          className={cl.newAddressId}
          getOptionLabel={(option) => option.fullAddress}
          onChange={(_, addr) => setNewAddress({ ...newAddress, id: addr?.id || '' })}
          renderInput={(params) => <TextField {...params} label='Адрес' />}
        />
        <TextField
          className={cl.newAddressFlat}
          label='Квартира'
          onChange={(ev) => setNewAddress({ ...newAddress, flat: ev.target.value })}
        />
        {newAddress.id && (
          <Button size='small' className={cl.newAddressAdd} onClick={addAddress}>
            Добавить
          </Button>
        )}
      </div>

      {data.addresses.length === 0 && <div style={{ textAlign: 'center' }}>Адрес не добавлен</div>}

      <div className={cl.addresses}>
        {data.addresses.map((userAddr) => (
          <div className={cl.address} key={userAddr.id + userAddr.flat}>
            <span>{addresses.find((addr) => addr.id === userAddr.id).fullAddress}
            {userAddr.flat && `, кв. ${userAddr.flat}`}</span>
            <Tooltip title='Удалить адрес'>
              <IconButton onClick={() => removeAddress(userAddr.id, userAddr.flat)}>
                <DeleteSharpIcon />
              </IconButton>
            </Tooltip>
          </div>
        ))}
      </div>

      <div className={cl.buttons}>
        <Button startIcon={<SaveIcon />} onClick={handleSaveClick}>
          Сохранить
        </Button>
        <Button onClick={onCancel}>Отмена</Button>
      </div>
    </form>
  );
};

export { Edit };
