import { Button, Col, Row, Select } from 'antd';
import { Chart } from 'primereact/chart';
import React from 'react';
import ContentWrapper from './map.style';

const stackedOptions = {
  indexAxis: 'y',
  maintainAspectRatio: false,
  aspectRatio: 0.9,

  plugins: {
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    legend: {
      display: true,
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: 'white',
      },
      grid: {
        color: '#ebedef',
        display: false,
      },
    },
    y: {
      stacked: true,
      ticks: {
        color: 'white',
      },
      grid: {
        color: '#ebedef',
        display: false,
      },
    },
  },
};

const stackedData = {
  labels: [
    'Залуу мэргэжилтэн (тоо)',
    'Залуу мэргэжилтэн (тоо) эмэгтэй',
    'ХХАБ-ын төслийн нэгжийн ажилчид (Эр)',
    'ХХАБ-ын төслийн нэгжийн ажилчид (Эм)',
  ],
  datasets: [
    {
      type: 'bar',
      label: 'Гүйцэтгэл',
      backgroundColor: '#66BB6A',
      data: [80, 40, 30, 50],
    },
    {
      type: 'bar',
      label: '',
      backgroundColor: '#42A5F5',
      data: [20, 60, 70, 50],
    },
  ],
};

function dashboardDetail(props) {
  const aimagList = props.list;
  const { Option, OptGroup } = Select;

  return (
    <div>
      <ContentWrapper>
        <Row style={{ marginTop: '-50%', marginLeft: '10%' }}>
          <Col span={24}>
            {aimagList?.map(z => (
              <Button
                type="primary"
                style={{
                  marginLeft: '10px',
                  marginTop: '20px',
                  width: '200px',
                  height: '60px',
                  backgroundColor: '#36577a',
                  borderColor: '#36577a',
                }}
              >
                {z.name}
              </Button>
            ))}
          </Col>
        </Row>
        <Row justify="space-between" style={{ marginTop: '18%' }}>
          <Col lg={1} />
          <Col lg={9}>
            <h1 className="title">Сургалт</h1>
            <Row gutter={20}>
              <Col lg={12}>
                <div className="body">
                  Нийт сургалтын тоо <p className="total">24</p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="body">
                  Гүйцэтгэлийн хувь <p className="total">91%</p>
                </div>
              </Col>
              <Col lg={24}>
                <div className="body2">
                  Сургалтанд хамрагдагсдын тоо <p className="total2">128</p>
                </div>
              </Col>
            </Row>
          </Col>

          <Col lg={9}>
            <h1 className="title">Төсөл</h1>
            <Row gutter={20}>
              <Col lg={12}>
                <div className="body">
                  Нийт төслийн тоо <p className="total">24</p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="body">
                  Гүйцэтгэлийн хувь <p className="total">91%</p>
                </div>
              </Col>
              <Col lg={24}>
                <div className="body2">
                  Төсөлд хамрагдагсдын тоо <p className="total2">128</p>
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg={1} />
        </Row>
        <Row>
          <Col lg={20}>
            <div style={{ marginLeft: '12%', width: '50%' }}>
              <Select
                placeholder="Шалгуур үзүүлэлтийн бүрэлдэхүүн сонгох"
                style={{ width: '100%' }}
                // onChange={value => selectComposition(value)}
                size="small"
              >
                <OptGroup label="ТӨСЛИЙН ХӨГЖЛИЙН ЗОРИЛГЫН ТӨВШНИЙ  ШАЛГУУР ҮЗҮҮЛЭЛТҮҮД">
                  <Option value={1}>Малын эрүүл мэндийн үйлчилгээ</Option>
                  <Option value={2}>
                    Нэмүү өртгийн сүлжээний эдийн засгийн эргэлтийг нэмэгдүүлэх
                  </Option>
                </OptGroup>
                <OptGroup label="ДУНД ТӨВШНИЙ ШАЛГУУР ҮЗҮҮЛЭЛТҮҮД">
                  <Option value={3}>Малын эрүүл мэндийн үйлчилгээ</Option>
                  <Option value={4}>
                    Нэмүү өртгийн сүлжээний эдийн засгийн эргэлтийг нэмэгдүүлэх
                  </Option>
                  <Option value={5}>Төслийн хэрэгжилтийг дэмжлэг</Option>
                  <Option value={6}>
                    Болзошгүй онцгой байдлын хариу арга хэмжээний бүрэлдэхүүн
                    хэсэг
                  </Option>
                </OptGroup>
              </Select>
            </div>
            <div style={{ marginLeft: '12%' }}>
              <Chart type="bar" data={stackedData} options={stackedOptions} />
            </div>
          </Col>
        </Row>
      </ContentWrapper>
    </div>
  );
}

export default dashboardDetail;
