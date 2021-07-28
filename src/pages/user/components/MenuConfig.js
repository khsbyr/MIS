import React, { useState, useEffect, useContext } from 'react';
import { Modal, Tree, Alert, message } from 'antd';
import { CheckSquareFilled } from '@ant-design/icons';
import { getService, postService } from '../../../service/service';
import { ToolsContext } from '../../../context/Tools';
import { errorCatch } from '../../../tools/Tools';

let oldData = [];

export default function MenuConfig(props) {
  const { visible, role } = props;
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [roleTree, setRoleTree] = useState([]);
  const toolsStore = useContext(ToolsContext);

  const convertTree = list => {
    const result = list.filter(row => row.status);
    result.forEach(menu => {
      menu.key = menu.id;
      menu.title = menu.name;
      menu.children = convertTree(menu.menus);
    });
    return result.sort((a, b) => (a.priority > b.priority ? 1 : -1));
  };

  useEffect(() => {
    toolsStore.setIsShowLoader(true);
    getService('menu/get').then(result => {
      const list = result.content || [];
      setRoleTree(convertTree(list));
      getService('/gap-core-service/menuShows', {
        search: `userRoleId:${role.id}`,
        size: 500,
      })
        .then(Response => {
          if (!Response) return;
          Response.content.forEach(item => {
            item.key = item.menu?.id;
            checkedKeys.push(item.key);
          });
          oldData = Response.content;
          setCheckedKeys([...checkedKeys]);
        })
        .finally(() => toolsStore.setIsShowLoader(false));
    });
  }, []);

  const onCheck = checkedKeysValue => {
    setCheckedKeys(checkedKeysValue);
  };

  const save = () => {
    const saveData = [];
    checkedKeys.forEach(key => {
      const findObj = oldData.find(item => item.key === key);
      if (!findObj) {
        saveData.push({
          isAccess: true,
          userRoleId: role.id,
          menu: { id: key },
        });
      }
    });

    // check boliulsan bol isAccess=false bolgoj bn
    oldData.forEach(item => {
      if (!checkedKeys.includes(item.key)) {
        saveData.push({
          isAccess: false,
          id: item.id,
          userRoleId: role.id,
          menu: { id: item.key },
        });
      }
    });

    if (!saveData.length) {
      message.warn('Өөрчлөгдсөн өгөгдөл олдсонгүй');
      return;
    }
    toolsStore.setIsShowLoader(true);
    postService('/gap-core-service/menuShows', saveData)
      .then(() => {
        props.close();
        toolsStore.setIsShowLoader(false);
        message.success('Амжилттай хадгалагдлаа');
      })
      .catch(error => {
        toolsStore.setIsShowLoader(false);
        errorCatch(error);
      });
  };

  return (
    <Modal
      title="Цэс тохируулах"
      className="permission"
      visible={visible}
      centered
      width={700}
      okText="Хадгалах"
      cancelText="Болих"
      bodyStyle={{ height: '70vh' }}
      onOk={save}
      onCancel={() => props.close()}
    >
      <h2>{role?.name}</h2>
      <p>
        <Alert
          message="Зөвхөн тухайн дүрд хамаарах цэсүүдийг сонгоно уу"
          type="info"
          icon={<CheckSquareFilled />}
          showIcon
        />
      </p>
      <Tree
        checkable
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        treeData={roleTree}
      />
    </Modal>
  );
}
