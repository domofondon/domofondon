import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { IconButton, Tooltip, TextField, Dialog, Paper, Checkbox } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';

import { Button } from 'components';
import { store } from 'store';
import { API } from 'api';

import cl from './Admins.module.scss';

const FORM = {
  CREATE: 'CREATE',
  REMOVE: 'REMOVE',
  EDIT: 'EDIT',
};

const textFields = [
  { label: 'Имя', field: 'name' },
  { label: 'Фамилия', field: 'surname' },
  { label: 'Телефон', field: 'phone', required: true },
];

const Admins = observer(({ className }) => {
  const { admins, getAdmins, getUsers, admin } = store.adminStore;
  const [openAdmin, setOpenAdmin] = useState(null);
  const [formType, setFormType] = useState(null);
  const formRef = useRef();

  useEffect(() => {
    if (openAdmin) {
      setOpenAdmin(toJS(admins).find((admin) => admin.id === openAdmin.id) || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admins]);

  const createOrEditAdmin = async (ev) => {
    ev.preventDefault();

    const params = {};
    textFields.forEach(({ field }) => {
      const value = formRef.current.elements[field].value || '';
      params[field] = value;
    });
    params.isSuperAdmin = formRef.current.elements.isSuperAdmin.checked;

    try {
      if (formType === FORM.CREATE) await API.createAdmin(params);
      if (formType === FORM.EDIT) await API.editAdmin({ id: openAdmin.id, ...params });
      await getAdmins();
      setFormType(null);
      getUsers();
    } catch (err) {
      alert(err);
    }
    return false;
  };

  const removeAdmin = async () => {
    try {
      await API.removeAdmin(openAdmin.id);
      await getAdmins();
    } catch (err) {
      alert(err);
    }
    setFormType(null);
    getUsers();
  };

  const getText = ({ name, surname, phone }, field) => {
    let text;
    if (field === 'name') text = (name || surname) && `${name} ${surname || ''}`;
    if (field === 'phone') text = phone;
    return text || '___';
  };

  return (
    <div className={`${cl.root} ${className}`}>
      <Paper className={cl.controls}>
        <h3>Администраторы</h3>
        {!admin.isSuperAdmin && (
          <>
            <Tooltip title='Редактировать админа'>
              <IconButton
                className={`${!openAdmin ? cl.disabled : ''}`}
                onClick={() => setFormType(FORM.EDIT)}
              >
                <EditIcon style={{ color: '#2f7491' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Удалить администратора'>
              <IconButton
                className={`${!openAdmin ? cl.disabled : ''}`}
                onClick={() => setFormType(FORM.REMOVE)}
              >
                <DeleteIcon style={{ color: '#2f7491' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Добавить администратора'>
              <IconButton onClick={() => setFormType(FORM.CREATE)}>
                <PersonAddIcon style={{ color: '#2f7491' }} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Paper>
      <div className={cl.tableWrap}>
        <table className={cl.table}>
          <thead>
            <tr>
              <th data-content='phone'>Номер телефона</th>
              <th data-content='name'>Имя Фамилия</th>
              <th data-content='isSuperAdmin'>СуперАдмин</th>
            </tr>
          </thead>
          <tbody>
            {toJS(admins).map((admin) => (
              <tr
                className={openAdmin && openAdmin.id === admin.id ? cl.selectedTr : ''}
                key={admin.id}
                onClick={() => setOpenAdmin(admin)}
                onDoubleClick={() => setOpenAdmin(null)}
              >
                <td data-content='phone'>{getText(admin, 'phone')}</td>
                <td data-content='name'>{getText(admin, 'name')}</td>
                <td data-content='isSuperAdmin'>
                  {admin.isSuperAdmin && <CheckIcon style={{ color: 'green' }} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog maxWidth='md' open={!!formType} onClose={() => setFormType(null)}>
        {formType === FORM.REMOVE && (
          <div className={cl.form}>
            <h3>Вы уверены что хотите удалить администратора?</h3>
            {openAdmin?.name && <p>{`${openAdmin.name} ${openAdmin.surname}`}</p>}
            {openAdmin?.phone && <p>{openAdmin.phone}</p>}
            <div className={cl.formButtons}>
              <Button onClick={removeAdmin}>Да</Button>
              <Button onClick={() => setFormType(null)}>Нет</Button>
            </div>
          </div>
        )}

        {(formType === FORM.CREATE || formType === FORM.EDIT) && (
          <form className={cl.form} ref={formRef} onSubmit={createOrEditAdmin}>
            <h2 className={cl.title}>
              {formType === FORM.CREATE ? 'Добавить админа' : 'Редактировать админа'}
            </h2>
            <div className={cl.fields}>
              {textFields.map(({ label, field, required }) => (
                <TextField
                  key={field}
                  className={cl.field}
                  label={label}
                  name={field}
                  defaultValue={(formType === FORM.EDIT && openAdmin[field]) || ''}
                  required={required}
                />
              ))}
              <div className={cl.field}>
                <label>
                  <Checkbox
                    color='primary'
                    name='isSuperAdmin'
                    defaultChecked={formType === FORM.EDIT ? openAdmin.isSuperAdmin : false}
                  />
                  СуперАдмин
                </label>
              </div>
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

export { Admins };
