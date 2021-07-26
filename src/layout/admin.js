// /* eslint-disable jsx-a11y/anchor-is-valid */
// import React, { useEffect, useContext } from 'react';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import { Layout } from 'antd';
// import PageHeader from './Header';
// // import { getService } from '../service/Service';
// import { ToolsContext } from '../context/Tools';
// // import Page from './Page';
// // import Menu from './Menu';
// // import { buildPaths, generateRoutes } from './utils';

// const { Sider, Content } = Layout;

// let menus = [];

// function Admin() {
//   const toolsStore = useContext(ToolsContext);
//   const [collapsed, setCollapsed] = React.useState(false);
//   const [routes, setRoutes] = React.useState([]);

//   useEffect(() => {
//     if (!toolsStore.user) return;
//     getService('/gap-core-service/menus/getByToken').then(result => {
//       if (!result) return;
//       console.log('menus', result);
//       menus = result;
//       setRoutes(generateRoutes(result));
//     });
//   }, []);

//   return (
//     <Router basename={process.env.PUBLIC_URL}>
//       <Layout style={{ height: '100%' }}>
//         <Sider
//           className="admin-sider-style"
//           width="310px"
//           theme="light"
//           trigger={null}
//           collapsible
//           collapsed={collapsed}
//         >
//           <div className="flex-center">
//             <img src={shilen} className="image" alt="logo" />
//             {!collapsed && <a className="name">ШИЛЭН ДАНС</a>}
//           </div>
//           <Menu menus={buildPaths(menus)} collapsed={collapsed} />
//         </Sider>
//         <Layout className="tabs-content" theme="white">
//           <PageHeader collapsed={collapsed} setCollapsed={setCollapsed} />
//           <Content className="main-content">
//             <Switch>
//               {routes.map(route => (
//                 <Route key={route.code} path={route.path}>
//                   <Page route={route} />
//                 </Route>
//               ))}
//             </Switch>
//           </Content>
//         </Layout>
//       </Layout>
//     </Router>
//   );
// }
// export default Admin;
