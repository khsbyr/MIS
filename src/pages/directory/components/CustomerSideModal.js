import { Form, Input, Modal, message } from 'antd';
import React, { useEffect } from 'react';
// import AutoCompleteSelect from '../../../components/Autocomplete';
import { postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from '../../training/tabs/components/CvModal.style';
import validateMessages from '../../../tools/validateMessage';

const { TextArea } = Input;

export default function CustomerSideModal(props) {
  const { Customersidecontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  // const [stateGender, setStateGender] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        ...Customersidecontroller,
      });
    }
  }, []);

  // const onChange = e => {
  //   setStateGender(e.target.value);
  // };

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.isTrue = true;
        if (isEditMode) {
          putService(`customerSide/update/${Customersidecontroller.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('customerSide/post', values)
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
        title="Харилцах тал бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={600}
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
            <Form.Item
              label="Харилцах тал:"
              name="name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea style={{ width: '100%', height: '100px' }} />
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
