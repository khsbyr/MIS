import { Col, Row, Select } from 'antd';
import { Chart } from 'primereact/chart';
import React from 'react';
import ContentWrapper from './criteria.style';

const stackedOptions = {
  indexAxis: 'y',
  maintainAspectRatio: false,
  aspectRatio: 1.2,

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

function dashboardCriteria() {
  const { Option, OptGroup } = Select;

  return (
    <div>
      <ContentWrapper>
        <Row>
          <Col lg={20}>
            {/* <div style={{ marginLeft: '12%', width: '50%' }}> */}
            <Select
              placeholder="Шалгуур үзүүлэлтийн бүрэлдэхүүн сонгох"
              style={{ width: '100%' }}
              // onChange={value => selectComposition(value)}
              size="small"
            >
              <OptGroup label="ТӨСЛИЙН ХӨГЖЛИЙН ЗОРИЛГЫН ТҮВШНИЙ  ШАЛГУУР ҮЗҮҮЛЭЛТҮҮД">
                <Option value={1}>Малын эрүүл мэндийн үйлчилгээ</Option>
                <Option value={2}>
                  Нэмүү өртгийн сүлжээний эдийн засгийн эргэлтийг нэмэгдүүлэх
                </Option>
              </OptGroup>
              <OptGroup label="ДУНД ТҮВШНИЙ ШАЛГУУР ҮЗҮҮЛЭЛТҮҮД">
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
            {/* </div> */}
            <div style={{ marginLeft: '12%' }}>
              <Chart type="bar" data={stackedData} options={stackedOptions} />
            </div>
          </Col>
        </Row>
      </ContentWrapper>
    </div>
  );
}

export default dashboardCriteria;
