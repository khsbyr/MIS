import React from 'react';
import loadable from 'react-loadable';
import Breadcrump from './Breadcrump';
import Loader from '../loader/Loader';
import CV from '../pages/training/tabs/cv';

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

const TrainingList = loadable({
  loader: () => import('../pages/training/TrainingList'),
  loading: Loader,
});

// const TrainingInfo = loadable({
//   loader: () => import('../pages/training/more/TraningInfo'),
//   loading: Loader,
// });
const Scope = loadable({
  loader: () => import('../pages/directory/scope'),
  loading: Loader,
});

// const Address = loadable({
//   loader: () => import('../pages/directory/address'),
//   loading: Loader,
// });

const Customerside = loadable({
  loader: () => import('../pages/directory/customerside'),
  loading: Loader,
});

const CriteriaReference = loadable({
  loader: () => import('../pages/directory/criteriareference'),
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
      case 'Training List'.toLowerCase():
        return <TrainingList />;

      case 'Human resources'.toLowerCase():
        return <CV />;

      /** Лавлах */
      case 'scope'.toLowerCase():
        return <Scope />;
      // case 'address'.toLowerCase():
      //   return <Address />;
      case 'Party in charge'.toLowerCase():
        return <Customerside />;
      case 'Types of indicators'.toLowerCase():
        return <CriteriaReference />;

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
