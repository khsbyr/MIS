import { Col, Form, Input, InputNumber, message, Modal, Row } from 'antd';
import React, { useEffect } from 'react';
import { postService, putService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './Modal.style';

export default function investmentModal(props) {
  const { EditRow, isModalVisible, isEditMode, summaryID } = props;
  const [form] = Form.useForm();
  // const [total, setTotal] = useState(0);
  // const [invest, setInvest] = useState(0);
  // const [company, setCompany] = useState(0);

  // const totalValue = value => {
  //   setTotal(value);
  // };

  // const investValue = value => {
  //   setInvest(value);
  // };

  // const companyValue = value => {
  //   setCompany(value);
  // };

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        ...EditRow,
        operationExpense: EditRow.projectInvestment.operationExpense,
        total: EditRow.projectInvestment.total,
        costOfCompany: EditRow.projectInvestment.costOfCompany,
        projectInvestment: EditRow.projectInvestment.projectInvestment,
        description: EditRow.projectInvestment.description,
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (values.costOfCompany + values.projectInvestment > values.total) {
          message.warning('Нийт дүнгээс их байх боломжгүй!');
        } else if (isEditMode) {
          putService(
            `projectInvestment/update/${EditRow.projectInvestment.id}`,
            values
          )
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`projectInvestment/post/${summaryID}`, values)
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
        title="Хөрөнгө оруулалт"
        okText="Хадгалах"
        cancelText="Буцах"
        width={800}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
        <ContentWrapper>
          <Form
            form={form}
            labelAlign="left"
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row gutter={30}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item
                  label="Үйл ажиллагаа буюу зардал:"
                  name="operationExpense"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="МАА-н ЭЗЭН төслийн хөрөнгө оруулалт:"
                  name="projectInvestment"
                >
                  <InputNumber type="number" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Нийт  дүн:" name="total">
                  <InputNumber type="number" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  label="Компаниас гаргах зардал хуваалт"
                  name="costOfCompany"
                >
                  <InputNumber type="number" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item
                  label="Санхүүжилтийн эх үүсвэр болон нэмэлт тайлбар:"
                  name="description"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
