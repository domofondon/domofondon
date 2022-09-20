import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import { Button } from 'components';

import cl from './Camera.module.scss';

const Camera = ({ onCancel, onSave }) => {
  const [photo, setPhoto] = useState(null);
  const webcamRef = useRef(null);

  const takePhoto = () => {
    const photo = webcamRef.current.getScreenshot();
    if (photo) setPhoto(photo);
  };

  const handleSaveClick = async () => {
    const res = await fetch(photo);
    const blob = await res.blob();
    await onSave(blob);
    onCancel();
  };

  return (
    <div className={cl.root}>
      {photo && (
        <>
          <img src={photo} alt='user' />
          <div className={cl.buttons}>
            <Button theme='grey' onClick={handleSaveClick}>
              Сохранить
            </Button>
            <Button theme='grey' onClick={() => setPhoto(null)}>
              Новое фото
            </Button>
            <Button theme='grey' onClick={onCancel}>
              Отмена
            </Button>
          </div>
        </>
      )}

      {!photo && (
        <>
          <Webcam ref={webcamRef} screenshotFormat='image/jpeg' />
          <IconButton className={cl.cameraIcon} onClick={takePhoto}>
            <PhotoCameraIcon />
          </IconButton>
        </>
      )}
    </div>
  );
};

export { Camera };
