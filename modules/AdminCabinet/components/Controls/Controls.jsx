/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { IconButton, Tooltip, TextField, Dialog } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import { Button } from 'components';
import { UserCabinet } from 'modules';
import { API } from 'api';
import { store } from 'store';

import cl from './Controls.module.scss';

const FORM = {
  EDIT: 'EDIT',
  CREATE: 'CREATE',
  REMOVE: 'REMOVE',
};

const Controls = observer(({ setVisibleUsers, openUser }) => {
  const { users, getUsers } = store.adminStore;
  const { addresses } = store.addressesStore;
  const { user, setUser } = store.userStore;

  const [searchString, setSearchString] = useState('');
  const [showNotProcessed, setShowNotProcessed] = useState(false);
  const [formType, setFormType] = useState(null);
  const searchRef = useRef();

  useEffect(() => {
    applyFilters();
  }, [users, showNotProcessed, searchString, applyFilters]);

  const applyFilters = useCallback(() => {
    let filtered = toJS(users);
    const searchString = searchRef.current.value;

    if (searchString)
      filtered = filtered.filter(
        (user) =>
          JSON.stringify(user).toUpperCase().includes(searchString.toUpperCase()) ||
          getText(user, 'address').toUpperCase().includes(searchString.toUpperCase())
      );

    if (showNotProcessed)
      filtered = filtered.filter(
        (user) => user.faces.length !== 0 && user.faces.some((face) => !face.isProcessed)
      );

    setVisibleUsers(filtered);
  }, [getText, setVisibleUsers, showNotProcessed, users]);

  const handleSearchKeyDown = (ev) => {
    if (ev.code === 'Enter') applySearch();
  };

  const applySearch = () => {
    const searchString = searchRef.current.value;
    setSearchString(searchString);
  };

  const resetSearch = () => {
    searchRef.current.value = '';
    setSearchString('');
  };

  const toggleNotProcessed = () => {
    setShowNotProcessed(!showNotProcessed);
  };

  const createUser = async () => {
    setFormType(FORM.CREATE);
    try {
      const newUser = await API.createUser();
      setUser(newUser);      
    } catch (err) {
      alert(err);
    }
  };

  const editUser = () => {
    setUser(openUser);
    setFormType(FORM.EDIT);
  };

  const removeUser = async () => {
    try {
      await API.removeUser(openUser.id);
      closeForm();
    } catch (err) {
      alert(err);
    }
  };

  const closeForm = async () => {
    if (formType === FORM.CREATE) {
      const isEmpty = !Object.keys(user).some((key) => key !== 'id' && user[key]?.length);
      if (isEmpty) await API.removeUser(user.id);
    }
    setUser(null);
    setFormType(null);
    getUsers();
  };

  const getText = useCallback(
    (user, field) => {
      let text;
      if (field === 'name') text = user.fullName;
      if (field === 'phone') text = user.phone;
      if (field === 'email') text = user.email;
      if (field === 'address') text = getAddresses(user).join('; ');
      if (field === 'contractNumber') text = user.contractNumber;
      return text || '___';
    },
    [getAddresses]
  );

  const getAddresses = useCallback((user) =>
    user.addresses.map((userAddr) => {
      let string = addresses.find((ad) => ad.id === userAddr.id).fullAddress;
      if (userAddr.flat) string = `${string}, кв.${userAddr.flat}`;
      return string;
    }), [addresses]);

  return (
    <div className={cl.root}>
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
      {/* TODO: remove */}
      {/* <label className={cl.checkbox}>
        <Checkbox onChange={toggleNotProcessed} checked={showNotProcessed} color='primary' />
        Только необработанные
      </label> */}

      <div className={cl.userButtons}>
        <Tooltip title='Редактировать пользователя'>
          <IconButton
            className={!openUser ? cl.disabled : ''}
            onClick={editUser}
          >
            <EditIcon style={{ color: '#2f7491' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title='Удалить пользователя'>
          <IconButton
            className={!openUser ? cl.disabled : ''}
            onClick={() => setFormType(FORM.REMOVE)}
          >
            <DeleteIcon style={{ color: '#2f7491' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title='Добавить пользователя'>
          <IconButton onClick={createUser}>
            <PersonAddIcon style={{ color: '#2f7491' }} />
          </IconButton>
        </Tooltip>        
      </div>

      <Dialog
        fullWidth
        maxWidth='lg'
        open={!!formType && formType !== FORM.REMOVE}
        onClose={closeForm}
      >
        <div className={`${cl.form} ${cl.formUser}`}>
          <h2>
            {formType === FORM.EDIT ? 'Редактировать пользователя' : 'Создать нового пользователя'}
          </h2>
          <UserCabinet  />
          <IconButton className={cl.closeForm} onClick={closeForm}>
            <CloseIcon />
          </IconButton>
        </div>
      </Dialog>

      <Dialog open={!!formType && formType === FORM.REMOVE} onClose={closeForm}>
        <div className={cl.form}>
          <h3>Вы уверены что хотите удалить пользователя?</h3>
          {openUser?.name && <p>{`${openUser.name} ${openUser.surname}`}</p>}
          {openUser?.phone && <p>{openUser.phone}</p>}
          <div className={cl.formButtons}>
            <Button onClick={removeUser}>Да</Button>
            <Button onClick={closeForm}>Нет</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
});

export { Controls };
