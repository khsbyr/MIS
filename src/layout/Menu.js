import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { sortArray, menuIcon } from '../tools/Tools';

const { SubMenu } = Menu;

export default function AppMenu({ menus, collapsed }) {
  const { t } = useTranslation();
  const buildMenu = buildMenus =>
    sortArray(buildMenus, 'priority').map((menu, index) => {
      if (menu.menus.length) {
        return (
          <SubMenu
            key={menu.code + index}
            icon={<FontAwesomeIcon icon={menuIcon(menu.code)} />}
            title={collapsed ? '' : t(menu.code)}
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
          <Link to={menu.path}>{t(menu.code)}</Link>
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
