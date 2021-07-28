import React, { useEffect, useState, useContext } from 'react';
import { Modal, Button, Form, Input, TreeSelect, Checkbox } from 'antd';
import { errorCatch, requireFieldFocus, sortArray } from '../../../tools/Tools';
import { getService } from '../../../service/service';
import { ToolsContext } from '../../../context/Tools';

const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 7,
    span: 17,
  },
};

export default function MenuModal(props) {
  const toolsStore = useContext(ToolsContext);

  const { visible, isEditMode, editValue } = props;
  const [form] = Form.useForm();
  const [parentMenus, setParentMenus] = useState([]);
  const [treeValue, setTreeValue] = useState();

  const convertTree = listArg => {
    const list = listArg.filter(row => row.status);
    list.forEach(menu => {
      menu.value = menu.id;
      menu.title = menu.name;
      menu.children = convertTree(menu.menus);
    });
    return sortArray(list, 'priority');
  };

  useEffect(() => {
    toolsStore.setIsShowLoader(true);
    const param = isEditMode
      ? { search: `id!${editValue.id} AND isParent:true` }
      : { search: `isParent:true` };
    getService('/gap-core-service/menus', param)
      .then(result => {
        const list = result.content || [];
        setParentMenus(convertTree(list));
        if (isEditMode) {
          form.setFieldsValue(editValue);
          setTreeValue(editValue.parentId);
        }
      })
      .catch(error => errorCatch(error))
      .finally(() => toolsStore.setIsShowLoader(false));
  }, []);

  const save = values => {
    if (isEditMode) values.id = editValue.id;
    if (values.parentId) values.parent = { id: values.parentId };
    props.save(values);
  };

  const onChangeTree = value => {
    setTreeValue(value);
  };

  return (
    <Modal
      title="Цэс бүртгэх"
      visible={visible}
      footer={false}
      onCancel={() => props.close(false)}
      width={600}
    >
      <Form
        {...layout}
        form={form}
        name="user"
        initialValues={{
          isActive: true,
        }}
        onFinish={save}
        onFinishFailed={requireFieldFocus}
      >
        <Form.Item label="Эцэг цэс" name="parentId">
          <TreeSelect
            allowClear
            value={treeValue}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={parentMenus}
            placeholder="Сонгох"
            size="small"
            treeDefaultExpandAll
            onChange={onChangeTree}
          />
        </Form.Item>
        <Form.Item
          label="Цэсний код"
          name="code"
          rules={[{ required: true, message: '' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Цэсний нэр"
          name="name"
          rules={[{ required: true, message: '' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Дэлгэрэнгүй нэр" name="description">
          <Input />
        </Form.Item>
        <Form.Item label="URL хаяг" name="url">
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout} name="isSeparator" valuePropName="checked">
          <Checkbox>Холбоостой эсэх</Checkbox>
        </Form.Item>
        <div style={{ textAlign: 'right' }}>
          <Button
            htmlType="button"
            style={{ marginRight: 8 }}
            onClick={() => props.close()}
          >
            Болих
          </Button>
          <Button type="primary" htmlType="submit">
            Хадгалах
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
