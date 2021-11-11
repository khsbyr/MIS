import React from 'react';
import { NavLink } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { getParents } from './utils';

const Breadcrump = ({ route }) => (
  <Breadcrumb>
    {getParents(route).map((crumb, index, list) => (
      <Breadcrumb.Item key={index}>
        {index < list.length - 1 ? (
          <NavLink to={crumb.url}>{crumb.name}</NavLink>
        ) : (
          crumb.name
        )}
      </Breadcrumb.Item>
    ))}
  </Breadcrumb>
);

export default Breadcrump;
