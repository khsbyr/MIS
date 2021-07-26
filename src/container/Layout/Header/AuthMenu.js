import { Menu, Select } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa';
import { TiArrowSortedDown } from 'react-icons/ti';
import { withRouter } from 'react-router-dom';

const { Option } = Select;

const AuthMenu = ({ location, className }) => {
  const { i18n } = useTranslation();
  const changeLanguage = value => {
    i18n.changeLanguage(value);
    localStorage.setItem('i18nextLng', value);
  };

  const getDefaultLanguage = () => {
    const lang = localStorage.getItem('i18nextLng');
    if (lang) return lang;
    return 'mn';
  };

  return (
    <Menu className={className}>
      <Menu.Item key="0" style={{ marginRight: '20px', fontWeight: '700' }}>
        <img src="/images/translation.png" alt="translate" width="20" />
        <Select
          bordered={false}
          defaultValue={getDefaultLanguage}
          onChange={changeLanguage}
          dropdownClassName="search-header-select-custom"
          suffixIcon={<TiArrowSortedDown className="select-icon" />}
          menuItemSelectedIcon={<FaCheck />}
        >
          <Option value="mn">MN</Option>
          <Option value="en">ENG</Option>
        </Select>
      </Menu.Item>
    </Menu>
  );
};

export default withRouter(AuthMenu);
