/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

import { store } from 'store';
import { Button, Container } from 'components';
import { authAPI } from 'api/authAPI';

import cl from './Header.module.scss';

const Header = observer(() => {
  const { isAdmin } = store;
  const { user } = store.userStore;
  const { admin, admins } = store.adminStore;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const hasAuth = (isAdmin && admin) || (!isAdmin && user);
  const data = isAdmin ? admin : user;

  useEffect(() => {
    setIsOpen(false);
  }, [router.route]);

  const getUserName = () => {
    if ((isAdmin && admins.length === 0) || !data) return '';
    return (
      (isAdmin ? admins.find((admin) => admin.phone === data.phone)?.fullName : data.fullName) ||
      data.phone
    );
  };

  const handleLogoutClick = async () => {
    try {
      await authAPI.logout();
      setIsOpen(false);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <header className={`${cl.root} ${isOpen ? cl.mobilOpen : ''}`}>
      <IconButton size="large" onClick={() => setIsOpen(!isOpen)} className={cl.mobilMenu}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <Container className={cl.container}>
        {process.env.NEXT_PUBLIC_MARK && <div className={cl.mark}>{process.env.NEXT_PUBLIC_MARK}</div>}
        <ul className={cl.menu}>
          <li className={router.asPath === "/" ? cl.active : undefined}>
            <Link href='/'>
              <a>Главная</a>
            </Link>
          </li>
          {hasAuth && (
            <li className={router.asPath === "/cabinet" ? cl.active : undefined}>
              <Link href='/cabinet'>
                <a>Личный кабинет</a>
              </Link>
            </li>
          )}
        </ul>
        <div className={cl.userInfo}>
          {hasAuth ? (
            <>
              {!isAdmin && user?.paidUntil && (
                <span className={cl.paidUntil}>
                  <span>Оплачено до: </span>
                  {user.paidUntil}
                </span>
              )}
              <span className={cl.userName}>{getUserName()}</span>
              <Button theme='outlined' onClick={handleLogoutClick}>
                Выйти
              </Button>
            </>
          ) : (
            <Link href='/cabinet'>
              <a>
                <Button theme='outlined'>Личный кабинет</Button>
              </a>
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
});

export { Header };
