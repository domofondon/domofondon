import { useState, useCallback } from 'react';
import { TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import { Button } from 'components';

import cl from './EditFace.module.scss';

const textFields = [
  { label: 'Имя', field: 'name' },
  { label: 'Фамилия', field: 'surname' },
];

const EditFace = ({ data: propsData, onSave, onCancel }) => {
  const [data, setData] = useState(propsData);

  const handleChange = useCallback((field, value) => setData({ ...data, [field]: value }), [data]);

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
      <div className={cl.buttons}>
        <Button startIcon={<SaveIcon />} onClick={handleSaveClick}>
          Сохранить
        </Button>
        <Button onClick={onCancel}>Отмена</Button>
      </div>
    </form>
  );
};

export { EditFace };
