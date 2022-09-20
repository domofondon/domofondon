import { useState, useEffect } from 'react';
import 'firebase/auth';
import Link from 'next/link';
import { Card, TextField, Checkbox } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { CodeInput, Button, Loading } from 'components';
import { authAPI } from 'api/authAPI';

import cl from './Login.module.scss';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    authAPI.recaptchaVerifierInvisible(() => {
      setIsCodeSent(true);
      setIsLoading(false);
    });
  }, []);

  const signIn = (ev) => {
    ev.preventDefault();
    const validPhone = `+7${phone.replace(/\D/g, '').slice(1)}`;
    if (validPhone.length !== 12) return;

    try {
      setIsLoading(true);
      authAPI.phoneSignIn(validPhone);
    } catch (err) {
      setIsLoading(false);
      alert(err.message);
    }
  };

  const verifyCode = (ev) => {
    ev.preventDefault();
    try {
      authAPI.verifyCode(code);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePhoneChange = (ev) => setPhone(ev.target.value);

  return (
    <div className={cl.root}>
      <Card className={cl.card}>
        <h1 className={cl.title}>Войти в личный кабинет</h1>
        {isLoading && <Loading />}

        {!isCodeSent && !isLoading && (
          <form className={cl.form} onSubmit={signIn}>
            <TextField
              label="Введите телефон"
              type="tel"
              name="phone"
              className={cl.input}
              onChange={handlePhoneChange}
            />
            <label className={cl.confirm}>
              <Checkbox
                onChange={() => setIsConfirmed(!isConfirmed)}
                checked={isConfirmed}
                color="primary"
              />
              <span className={cl.confirmText}>Ознакомлен с политикой конфиденциальности</span>
              <Link href="/politics">
                <a  target="_blank">
                  <ExitToAppIcon />
                </a>
              </Link>
            </label>
            <Button disabled={!isConfirmed} className={cl.button} type="submit">
              Далее
            </Button>
          </form>
        )}

        <div id="recaptcha" />

        {isCodeSent && !isLoading && (
          <form className={cl.form} onSubmit={verifyCode}>
            <div className={cl.phone}>{phone}</div>
            <CodeInput className={cl.input} onChange={setCode} />
            <Button className={cl.button} type="submit">
              Отправить код
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export { Login };
