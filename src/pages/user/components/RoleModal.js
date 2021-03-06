import React, { useEffect, useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { requireFieldFocus, errorCatch } from '../../../tools/Tools';
import { getService, postService, putService } from '../../../service/service';
import AutoCompleteSelect from '../../../components/Autocomplete';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

export default function RoleModal(props) {
  const { roleController, visible, isEditMode } = props;
  const [form] = Form.useForm();
  const [stateRoleLevel, setStateRoleLevel] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getService('roleLevel/get').then(result => {
      if (result) {
        setStateRoleLevel(result || []);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({
        ...roleController,
        roleLevelId: roleController?.roleLevel
          ? roleController?.roleLevel?.id
          : '',
      });
    }
  }, [roleController, form, isEditMode]);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.roleLevel = {
          id: values.roleLevelId,
        };
        if (isEditMode) {
          putService(`role/update/${roleController.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('role/post', values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        }
      })
      .catch(info => {
        errorCatch(info);
      });
  };

  return (
    <Modal
      title={t('User role create')}
      okText={t('Save')}
      cancelText={t('Cancel')}
      width={460}
      alignItems="center"
      visible={visible}
      onOk={save}
      onCancel={() => props.close()}
    >
      <Form
        {...layout}
        form={form}
        name="user"
        initialValues={{
          isActive: true,
        }}
        onFinish={values => {
          const formData = form.getFieldValue();
          props.save({ ...values, id: formData.id });
        }}
        onFinishFailed={requireFieldFocus}
      >
        <Form.Item
          label={t('Role name')}
          name="name"
          rules={[{ required: true, message: '' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="roleLevelId" layout="vertical" label={t('Role code')}>
          <AutoCompleteSelect
            valueField="id"
            size="medium"
            data={stateRoleLevel}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
