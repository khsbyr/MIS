import { Col, Form, Input, message, Modal, Rate, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import AutocompleteSelect from '../../../../components/Autocomplete';
import { useProjectStore } from '../../../../context/ProjectContext';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';

const { TextArea } = Input;

export default function RatingModal(props) {
  const { isModalVisible, EditRow, isEditMode } = props;
  const [form] = Form.useForm();
  const [externalOrg, setExternalOrg] = useState();
  const { ProjectList } = useProjectStore();

  useEffect(() => {
    getService(
      `externalMonitoring/getOrgListByProjectId/${ProjectList.id}`
    ).then(result => {
      if (result) {
        setExternalOrg(result || []);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({
        ...EditRow,
        org: EditRow.organization.id,
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.organization = { id: values.org };
        values.project = { id: ProjectList.id };
        if (isEditMode) {
          putService(`rating/update/${EditRow.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`rating/post`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
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
    <div>
      <Modal
        title="Үнэлгээ өгөх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={600}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
        <div>
          <Form
            form={form}
            labelAlign="left"
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row gutter={30}>
              <Col span={24}>
                <Form.Item name="org" label="Байгууллага сонгох">
                  <AutocompleteSelect
                    className="FormItem"
                    placeholder="Байгууллага сонгох"
                    valueField="id"
                    data={externalOrg}
                    size="medium"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="rating" label="Үнэлгээ өгөх">
                  <Rate defaultValue={EditRow?.rating} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="description" label="Тайлбар">
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
