import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sortArray, menuIcon } from '../tools/Tools';

const { SubMenu } = Menu;
export default function AppMenu({ menus, collapsed }) {
  const buildMenu = buildMenus =>
    sortArray(buildMenus, 'priority').map((menu, index) => {
      if (menu.menus.length) {
        return (
          <SubMenu
            key={menu.code + index}
            icon={<FontAwesomeIcon icon={menuIcon(menu.code)} />}
            title={collapsed ? '' : menu.name}
          >
            {buildMenu(menu.menus)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item
          key={menu.code}
          icon={<FontAwesomeIcon icon={menuIcon(menu.code)} />}
        >
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
