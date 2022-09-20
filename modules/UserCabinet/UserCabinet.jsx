import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton, Tooltip, Dialog, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

import { store } from 'store';
import { InfoRequest } from 'components';

import { Edit, Faces } from './components';
import cl from './UserCabinet.module.scss';

const UserCabinet = observer(() => {
  const { isAdmin } = store;
  const { user, editUser } = store.userStore;
  const { addresses } = store.addressesStore;
  const [showEdit, setShowEdit] = useState(false);

  const getAddresses = () =>
    user.addresses.map((userAddr) => {
      let string = addresses.find((ad) => ad.id === userAddr.id).fullAddress;
      if (userAddr.flat) string = `${string}, кв.${userAddr.flat}`;
      return string;
    });

  if (!user) return null;

  return (
    <div className={cl.root}>
      <div className={cl.user}>
        <Paper className={cl.info}>
          <AssignmentIndIcon className={cl.infoIcon} color='primary' />
          <div className={cl.titleWarp}>
            <h2>{user.fullName || 'Заполните данные'}</h2>
            <div className={cl.infoEdit}>
              <Tooltip title='Редактировать'>
                <IconButton
                  onClick={() => {
                    setShowEdit(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <dl>
            <dt>Телефон</dt>
            <dd>{user.phone || '___'}</dd>
            <dt>Email</dt>
            <dd>{user.email || '___'}</dd>
            <dt>Адреса</dt>
            <dd>
              {getAddresses().map((addr) => (
                <div key={addr}>{addr}</div>
              ))}
              {getAddresses().length === 0 && '___'}
            </dd>
            {/* <dt>Номер договора</dt>
            <dd>{user.contractNumber || '___'}</dd> */}
          </dl>
        </Paper>

        <Faces className={cl.facesWrap} />
      </div>

      {!isAdmin && <InfoRequest className={cl.infoRequest} />}

      <Dialog maxWidth='md' open={showEdit} onClose={() => setShowEdit(false)}>
        <Edit onSave={editUser} onCancel={() => setShowEdit(false)} />
      </Dialog>
    </div>
  );
});

export { UserCabinet };
