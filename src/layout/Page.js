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

const ConsultingOrg = loadable({
  loader: () => import('../pages/consulting/consultingOrg'),
  loading: Loader,
});

const ConsultingPerson = loadable({
  loader: () => import('../pages/consulting/consultingPerson'),
  loading: Loader,
});

const Scope = loadable({
  loader: () => import('../pages/directory/scope'),
  loading: Loader,
});

const Projecttype = loadable({
  loader: () => import('../pages/directory/projecttype'),
  loading: Loader,
});

const Customerside = loadable({
  loader: () => import('../pages/directory/customerside'),
  loading: Loader,
});

const CriteriaReference = loadable({
  loader: () => import('../pages/directory/criteriareference'),
  loading: Loader,
});

const Activity = loadable({
  loader: () => import('../pages/directory/activity'),
  loading: Loader,
});

const Feedback = loadable({
  loader: () => import('../pages/other/feedback'),
  loading: Loader,
});

const IndicatorsReport = loadable({
  loader: () => import('../pages/other/IndicatorsReport'),
  loading: Loader,
});

const ProductiveProject = loadable({
  loader: () => import('../pages/project/productiveProject'),
  loading: Loader,
});

const VeterinarianProject = loadable({
  loader: () => import('../pages/project/veterinarianProject'),
  loading: Loader,
});

const Dashboard = loadable({
  loader: () => import('../pages/dashboard/dashboard'),
  loading: Loader,
});

const Plan = loadable({
  loader: () => import('../pages/projectReport/plan'),
  loading: Loader,
});

const Report = loadable({
  loader: () => import('../pages/projectReport/report'),
  loading: Loader,
});

const Makhis = loadable({
  loader: () => import('../pages/makhis/Makhis'),
  loading: Loader,
});

const TrainingParticipants = loadable({
  loader: () => import('../pages/directory/trainingParticipants'),
  loading: Loader,
});

const Trainers = loadable({
  loader: () => import('../pages/directory/trainers'),
  loading: Loader,
});

const Tejeel = loadable({
  loader: () => import('../pages/tejeel/tejeel'),
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
      case 'projecttype'.toLowerCase():
        return <Projecttype />;
      case 'Party in charge'.toLowerCase():
        return <Customerside />;
      case 'Types of indicators'.toLowerCase():
        return <CriteriaReference />;
      case 'activity'.toLowerCase():
        return <Activity />;

      /** Байгууллагын мэдээлэл */

      /** Тайлан */

      /** Зөвлөх үйлчилгээ */
      case 'Consulting organization'.toLowerCase():
        return <ConsultingOrg />;
      case 'Consultant individual'.toLowerCase():
        return <ConsultingPerson />;

      /** Бусад */
      case 'Feedback'.toLowerCase():
        return <Feedback />;
      case 'Indicators report'.toLowerCase():
        return <IndicatorsReport />;

      /** Төсөл */
      case 'Productive Partnership Project'.toLowerCase():
        return <ProductiveProject type={1} />;

      case 'Innovative project'.toLowerCase():
        return <ProductiveProject type={2} />;

      case 'Factory'.toLowerCase():
        return <ProductiveProject type={3} />;

      case 'Veterinary support'.toLowerCase():
        return <ProductiveProject type={4} />;

      case 'Young Veterinarian Program'.toLowerCase():
        return <VeterinarianProject />;

      /** Dashboard */
      case 'Dashboard'.toLowerCase():
        return <Dashboard />;

      case 'plan'.toLowerCase():
        return <Plan />;

      case 'report'.toLowerCase():
        return <Report />;

      case 'Makhis'.toLowerCase():
        return <Makhis />;

      case 'Training Participants'.toLowerCase():
        return <TrainingParticipants />;

      case 'Trainers'.toLowerCase():
        return <Trainers />;

      case 'Tejeel'.toLowerCase():
        return <Tejeel />;

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
