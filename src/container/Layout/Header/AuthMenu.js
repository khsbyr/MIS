import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Select, Dropdown, Menu, Button, Popconfirm } from "antd";
import { FaCheck } from "react-icons/fa";
import { TiArrowSortedDown } from "react-icons/ti";
import { ComponentWrapper } from "../../Search/Flight/FlightSearch.style";
import { useTranslation } from "react-i18next";

import { LOGIN } from "settings/constantRoutes";
import { propTypes } from "react-currency-format";

const { Option } = Select;

const AuthMenu = ({ location, className }) => {
  const { i18n } = useTranslation();
  const changeLanguage = (value) => {
    i18n.changeLanguage(value);
    localStorage.setItem("i18nextLng", value);
  };

  const getDefaultLanguage = () => {
    const lang = localStorage.getItem("i18nextLng");
    if (lang) return lang;
    return "mn";
  };



  return (
    <Menu className={className}>
      <Menu.Item key="0" style={{ marginRight: "20px", fontWeight: "700" }}>
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

      {/* <Menu.Item key="2">
        <NavLink to={LOGIN}>Нэвтрэх</NavLink>
      </Menu.Item> */}
    </Menu>
  );
};

export default withRouter(AuthMenu);
