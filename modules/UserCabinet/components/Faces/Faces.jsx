import React, { useState, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { IconButton, Tooltip, Dialog, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import { Button } from 'components';
import { store } from 'store';
import { photoURLs, ImageTools } from 'helpers';
import { useForceUpdate } from 'helpers/hooks';

import { EditFace } from '../EditFace/EditFace';
import cl from './Faces.module.scss';
import { Camera } from '../Camera/Camera';

const Faces = observer(({ className }) => {
  const { isAdmin } = store;
  const { user, addFace, editFace, deleteFace } = store.userStore;
  const forceUpdate = useForceUpdate();
  const [editingFace, setEditingFace] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const loadPhotoURLs = useCallback(async () => {
    await photoURLs.loadByUser(user);
    forceUpdate();
  }, [forceUpdate, user]);

  useEffect(() => loadPhotoURLs(), [loadPhotoURLs]);

  useEffect(() => {
    if (user) loadPhotoURLs();
  }, [loadPhotoURLs, user]);

  const handlePhotoAdd = (ev) => {
    const MAX_SIZE = 5 * 1024 * 1024;
    const file = ev.target?.files[0];

    ImageTools.resize(
      file,
      {
        width: 700, // maximum width
        height: 700, // maximum height
      },
      (blob) => {
        if (blob.size > MAX_SIZE) {
          alert('Файл слишком большой, пожалуйста загрузите другой');
          return;
        }
        addFace(blob);
      }
    );
  };

  return (
    <Paper className={`${cl.root} ${className}`}>
      <h3>Фото</h3>
      <div className={cl.faces}>
        <div className={`${cl.faceNew} ${cl.face}`}>
          <Tooltip title='Загрузить фото'>
            <IconButton onClick={() => {}} component='label'>
              <input type='file' hidden onChange={handlePhotoAdd} accept='.jpg' />
              <PersonAddIcon className={cl.newFaceIcon} />
            </IconButton>
          </Tooltip>
          {!isAdmin && (
            <>
              <div className={cl.or}>или</div>
              <Button
                className={cl.cameraButton}
                theme='grey'
                onClick={() => setIsCameraOpen(true)}
                startIcon={<PhotoCameraIcon />}
              >
                Сделать селфи
              </Button>
            </>
          )}
        </div>
        {toJS(user.faces).map((face) => {
          const { id, fileId, name = '', surname = '' } = face;
          const url = photoURLs.get(fileId);
          if (!url) return null;

          return (
            <div key={id} className={cl.face}>
              <img src={url} alt='user' />
              <div className={cl.faceControls}>
                <p>
                  {name} {surname}
                </p>
                <Tooltip title='Редактировать'>
                  <IconButton onClick={() => setEditingFace(face)}>
                    <EditIcon className={cl.faceIcon} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Удалить'>
                  <IconButton onClick={() => deleteFace(id)}>
                    <DeleteIcon className={cl.faceIcon} />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
      <Dialog maxWidth='md' open={!!editingFace} onClose={() => setEditingFace(null)}>
        <EditFace data={editingFace} onSave={editFace} onCancel={() => setEditingFace(null)} />
      </Dialog>

      <Dialog maxWidth='md' open={!!isCameraOpen} onClose={() => setIsCameraOpen(false)}>
        <Camera onSave={addFace} onCancel={() => setIsCameraOpen(false)} />
      </Dialog>
    </Paper>
  );
});

export { Faces };
