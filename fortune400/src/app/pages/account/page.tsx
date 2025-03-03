"use client";

import { IdcardOutlined, PlusOutlined } from "@ant-design/icons";
import { Table, Button, Modal, Form, Input } from "antd";
import { useState } from "react";

export default function AccountPage() {
  const [accounts, setAccounts] = useState([
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ]);
  const [activeAccount, setActiveAccount] = useState(accounts[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
  ];

  // Show modal for adding a new account
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hide modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle form submission to add new account
  const onFinish = (values: any) => {
    const newAccount = {
      key: String(accounts.length + 1),
      ...values,
    };
    setAccounts([...accounts, newAccount]);
    setActiveAccount(newAccount); // Optionally set as active
    setIsModalVisible(false);
  };

  return (
    <section>
      <p className="text-6xl text-center text-black p-12">Hello, John Smith</p>
      {/* Render account card buttons dynamically */}
      <div className=" shadow-xl grid grid-cols-3 gap-4 place-items-center">
        {accounts.map((account) => (
          <Button className='shadow-md bg-gray-100 border-cyan-700 mb-10  w-[50%] h-full' key={account.key} onClick={() => setActiveAccount(account)}>
            <IdcardOutlined />
            {account.name}
          </Button>
        ))}
        <Button className='grid grid-flow-row place-content-center place-items-center shadow-md bg-gray-100 border-cyan-700 mb-10 w-[50%] h-full'
 onClick={showModal}>Add New Account<PlusOutlined/></Button>
      </div>

      {/* Render table based on the active account */}
      <Table className="px-24 py-6"dataSource={[activeAccount]} columns={columns} />

      {/* Modal for adding a new account */}
      <Modal
  title="Add New Account"
  open={isModalVisible} // changed from visible to open
  onCancel={handleCancel}
  footer={null}
      >
        <Form onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Account
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
