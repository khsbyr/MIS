import React from 'react';
import loadable from 'react-loadable';
import Breadcrump from './Breadcrump';
import Loader from '../loader/Loader';

const MenuSettings = loadable({
  loader: () => import('../pages/settings/MenuSettings'),
  loading: Loader,
});

const Users = loadable({
  loader: () => import('../pages/user/user'),
  loading: Loader,
});

const Roles = loadable({
  loader: () => import('../pages/user/role'),
  loading: Loader,
});

const SignUpRequest = loadable({
  loader: () => import('../pages/user/signUpRequest'),
  loading: Loader,
});

const Criteria = loadable({
  loader: () => import('../pages/criteria/criteria'),
  loading: Loader,
});

const Page = ({ route }) => {
  const PageContent = () => {
    switch (route.code.toLowerCase()) {
      /* тохиргоо */
      case 'menu'.toLowerCase():
        return <MenuSettings />;

      /** Хэрэглэгчийн эрхийн тохиргоо */
      case 'users'.toLowerCase():
        return <Users />;
      case 'user role'.toLowerCase():
        return <Roles />;
      case 'signuprequest'.toLowerCase():
        return <SignUpRequest />;

      /** Шалгуур үзүүлэлт */
      case 'indicator'.toLowerCase():
        return <Criteria />;

      /** Сургалт */
      case 'trainning'.toLowerCase():
        return <Criteria />;

      /** Лавлах */

      /** Байгууллагын мэдээлэл */

      /** Тайлан */

      default:
        return null;
    }
  };

  return (
    <>
      {route.parent && <Breadcrump route={route} />}
      {PageContent()}
    </>
  );
};

export default Page;
