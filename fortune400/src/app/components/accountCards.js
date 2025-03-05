import React from 'react';
import { Card, Col, Row } from 'antd';
const Cards = () => (
    <div className=' min-w-[110%] max-w-96 place-content-center'>
  <Row gutter={30}>
    <Col className='justify-evenly' span={4}>
      <Card className='bg-lightText' title="Account 1" variant="borderless">
        Card content
      </Card>
    </Col>
    <Col span={4}>
      <Card title="Account 2" variant="border">
        Card content
      </Card>
    </Col>
    <Col span={4}>
      <Card title="Add New Account" variant="border">
        Card content
      </Card>
    </Col>
  </Row>
  </div>
);
export default Cards;