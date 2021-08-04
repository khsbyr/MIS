import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import StopIcon from '@material-ui/icons/Stop';
import DescriptionIcon from '@material-ui/icons/Description';
import { sortArray } from '../tools/Tools';

const { SubMenu } = Menu;

export default function AppMenu({ menus, collapsed }) {
  const buildMenu = buildMenus =>
    sortArray(buildMenus, 'priority').map((menu, index) => {
      if (menu.menus.length) {
        return (
          <SubMenu
            key={menu.code + index}
            icon={<DescriptionIcon />}
            title={collapsed ? '' : menu.name}
          >
            {buildMenu(menu.menus)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={menu.code} icon={<StopIcon />}>
          <Link to={menu.path}>{menu.name}</Link>
        </Menu.Item>
      );
    });

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={['dashboard']}
      inlineCollapsed={collapsed}
    >
      {buildMenu(menus)}
    </Menu>
  );
}
