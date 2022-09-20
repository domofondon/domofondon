import React, { useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { IconButton, Tooltip, Paper, Checkbox } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import { useForceUpdate } from 'helpers/hooks';
import { photoURLs } from 'helpers';
import { store } from 'store';

import cl from './Faces.module.scss';

const Faces = observer(({ openUser, className }) => {
  const { setFaceProcessed } = store.adminStore;
  const forceUpdate = useForceUpdate();

  const loadPhotoURLs = useCallback(async () => {
    await photoURLs.loadByUser(openUser);
    forceUpdate();
  }, [forceUpdate, openUser]);

  useEffect(() => {
    if (openUser) loadPhotoURLs();
  }, [loadPhotoURLs, openUser]);

  const uploadPhoto = (ev, { url, fileName }) => {
    ev.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = () => {
      const blob = xhr.response;
      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', `${fileName}.jpg`);
      link.click();
    };
    xhr.open('GET', url);
    xhr.send();
  };

  const setProcessed = (faceId, isProcessed) => {
    setFaceProcessed({ userId: openUser.id, faceId, isProcessed });
  };

  return (
    <Paper className={`${className} ${cl.root}`}>
      <h3>Domofon face</h3>
      <div className={cl.faces}>
        {openUser &&
          toJS(openUser.faces).map((face) => {
            const { id, fileId, isProcessed, name = '', surname = '' } = face;
            const fileName = `${openUser.phone}_${fileId}`;
            const url = photoURLs.get(fileId);
            if (!url) return null;

            return (
              <div key={id} className={cl.face}>
                <img src={url} alt='user' />
                <div className={cl.faceControls}>
                  <p>Имя: {name ? `${name} ${surname}` : '___'}</p>
                  <p>
                    Обработано:
                    <Checkbox
                      color='primary'
                      value='mock'
                      checked={!!isProcessed}
                      onChange={(ev) => setProcessed(id, ev.target.checked)}
                    />
                  </p>
                  <div className={cl.saveButton}>
                    <Tooltip title='Скачать'>
                      <IconButton onClick={(ev) => uploadPhoto(ev, { url, fileName })}>
                        <SaveIcon className={cl.saveIcon} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Paper>
  );
});

export { Faces };
