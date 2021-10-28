import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { sortArray, menuIcon } from '../tools/Tools';

const { SubMenu } = Menu;
const rootSubmenuKeys = [
  'User0',
  'Indicator1',
  'Training2',
  'Project3',
  'Makhis4',
  'Tejeel5',
  'Directory registration6',
  'Feedback7',
  'Consulting service8',
  'Dashboard9',
  'Project implementing unit10',
  'settings11',
];

export default function AppMenu({ menus, collapsed }) {
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState(['Dashboard8']);

  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

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
      openKeys={openKeys}
      onOpenChange={onOpenChange}
    >
      {buildMenu(menus)}
    </Menu>
  );
}
