import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { IconButton, Tooltip, TextField, Dialog, Paper } from '@mui/material';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import { Button } from 'components';
import { store } from 'store';
import { API } from 'api';

import cl from './Addresses.module.scss';

const FORM = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  REMOVE: 'REMOVE',
};

const textFields = [
  { label: 'Город', field: 'city', defaultValue: 'Ростов-на-Дону', required: true },
  { label: 'Адрес', field: 'address', required: true },
];

const Addresses = observer(({ className }) => {
  const { addresses, getAddresses } = store.addressesStore;
  const { users, getUsers } = store.adminStore;
  const [visibleAddresses, setVisibleAddresses] = useState(addresses);
  const [openAddress, setOpenAddress] = useState(null);
  const [formType, setFormType] = useState(null);
  const formRef = useRef();
  const searchRef = useRef();

  useEffect(() => {
    if (openAddress) {
      setOpenAddress(toJS(addresses).find((address) => address.id === openAddress.id) || null);
    }
    applySearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

  const createOrEditAddress = async (ev) => {
    ev.preventDefault();

    const params = {};
    textFields.forEach(({ field }) => {
      const value = formRef.current.elements[field].value || '';
      params[field] = value;
    });
    try {
      if (formType === FORM.CREATE) await API.createAddress(params);
      if (formType === FORM.EDIT) await API.editAddress({ id: openAddress.id, ...params });
      await getAddresses();
      setFormType(null);
      getUsers();
    } catch (err) {
      alert(err);
    }
    return false;
  };

  const removeAddress = async () => {
    if (users.some((user) => user.addresses.some((addr) => addr.id === openAddress.id))) {
      alert('Нельзя удалить этот адрес, пока он указан пользователем.');
      return;
    }
    try {
      await API.removeAddress(openAddress.id);
      await getAddresses();
    } catch (err) {
      alert(err);
    }
    setFormType(null);
  };

  const handleSearchKeyDown = (ev) => {
    if (ev.code === 'Enter') applySearch();
  };

  const applySearch = () => {
    const searchString = searchRef.current.value;
    setVisibleAddresses(
      addresses.filter((addr) =>
        addr.fullAddress.toUpperCase().includes(searchString.toUpperCase())
      )
    );
  };

  const resetSearch = () => {
    searchRef.current.value = '';
    setVisibleAddresses(addresses);
  };

  return (
    <div className={`${cl.root} ${className}`}>
      <Paper className={cl.controls}>
        <h3>Адреса</h3>
        <TextField
          inputRef={searchRef}
          label='Поиск'
          variant='outlined'
          size='small'
          onKeyDown={handleSearchKeyDown}
        />
        <Tooltip title='Найти'>
          <IconButton onClick={applySearch}>
            <SearchIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Сбросить'>
          <IconButton onClick={resetSearch}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Редактировать адрес'>
          <IconButton
            className={`${!openAddress ? cl.disabled : ''}`}
            onClick={() => setFormType(FORM.EDIT)}
          >
            <EditIcon style={{ color: '#2f7491' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title='Удалить адрес'>
          <IconButton
            className={`${!openAddress ? cl.disabled : ''}`}
            onClick={() => setFormType(FORM.REMOVE)}
          >
            <DeleteIcon style={{ color: '#2f7491' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title='Добавить адрес'>
          <IconButton onClick={() => setFormType(FORM.CREATE)}>
            <AddLocationIcon style={{ color: '#2f7491' }} />
          </IconButton>
        </Tooltip>
      </Paper>
      <div className={cl.tableWrap}>
        <table className={cl.table}>
          <thead>
            <tr>
              <th>Адрес</th>
            </tr>
          </thead>
          <tbody>
            {visibleAddresses.map((address) => (
              <tr
                className={openAddress && openAddress.id === address.id ? cl.selectedTr : ''}
                key={address.id}
                onClick={() => setOpenAddress(address)}
                onDoubleClick={() => setOpenAddress(null)}
              >
                <td>{address.fullAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog maxWidth='md' open={!!formType} onClose={() => setFormType(null)}>
        {formType === FORM.REMOVE && (
          <div className={cl.form}>
            <h3>Вы уверены что хотите удалить адрес?</h3>
            <p>{openAddress.fullAddress}</p>
            <div className={cl.formButtons}>
              <Button onClick={removeAddress}>Да</Button>
              <Button onClick={() => setFormType(null)}>Нет</Button>
            </div>
          </div>
        )}

        {(formType === FORM.CREATE || formType === FORM.EDIT) && (
          <form className={cl.form} ref={formRef} onSubmit={createOrEditAddress}>
            <h2 className={cl.title}>
              {formType === FORM.CREATE ? 'Добавить адрес' : 'Редактировать адрес'}
            </h2>
            <div className={cl.fields}>
              {textFields.map(({ label, field, defaultValue, required }) => (
                <TextField
                  key={field}
                  className={cl.field}
                  label={label}
                  name={field}
                  defaultValue={
                    (formType === FORM.EDIT && openAddress[field]) || defaultValue || ''
                  }
                  required={required}
                />
              ))}
            </div>
            <div className={cl.formButtons}>
              <Button startIcon={<SaveIcon />} type='submit'>
                Сохранить
              </Button>
              <Button onClick={() => setFormType(null)}>Отмена</Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
});

export { Addresses };
