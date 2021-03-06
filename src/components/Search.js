import React from 'react';
import '../styles/index.scss';
import 'antd/dist/antd.css';
import { Input } from 'antd';

const { Search } = Input;
const onSearch = () => {};
const Searchs = () => (
  <div className="searchbar" style={{ padding: '15px 10px 10px 10px' }}>
    <Search
      placeholder="Хайлт"
      onSearch={onSearch}
      className="search-button"
      style={{ width: '100%', borderRadius: '20px', height: '30px' }}
    />
  </div>
);
export default Searchs;
