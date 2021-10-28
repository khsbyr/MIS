import React from 'react';
import { Button, Tooltip } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import style from './style.module.scss';

export default function priorityButton(props) {
  const priorityChange = (e, isUp) => {
    e.preventDefault();
    e.stopPropagation();
    props.onChange(isUp);
  };

  return (
    <div className={style.priority}>
      <Tooltip placement="left" title="Дээш">
        <Button
          icon={<CaretUpOutlined />}
          size="small"
          className={style.priorityBtn}
          onClick={e => priorityChange(e, true)}
        />
      </Tooltip>
      <Tooltip placement="left" title="Доош">
        <Button
          icon={<CaretDownOutlined />}
          size="small"
          className={style.priorityBtn}
          onClick={e => priorityChange(e, false)}
        />
      </Tooltip>
    </div>
  );
}
