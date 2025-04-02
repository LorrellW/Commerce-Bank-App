//account/page.tsx
"use client";

import { useUser } from "@/app/context/UserContext";
import { IdcardOutlined, PlusOutlined } from "@ant-design/icons";
import { Table, Button, Modal, Form, Input } from "antd";
import { styleText } from "node:util";
import { useState } from "react";

interface Account {
  key: string;
  name: string;
  type: string;
  amount: number;
}

interface AccountFormValues {
  name: string;
  type: string;
  amount: number;
}

export default function AccountPage() {
  const {user} = useUser();
  // if (!user) {
  //   return <p className="text-center text-lg text-gray-600">Loading user info...</p>;
  // }
   
  console.log(user);
  const [accounts, setAccounts] = useState<Account[]>([
    {
      key: '1',
      name: 'Account 1',
      type: 'checking',
      amount: 50,
    },
    {
      key: '2',
      name: 'Account 2',
      type: 'savings',
      amount: 50,
    },
  ]);

  const [activeAccount, setActiveAccount] = useState<Account>(accounts[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
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
  const onFinish = (values: AccountFormValues) => {
    const newAccount: Account = {
      key: String(accounts.length + 1),
      ...values,
    };
    setAccounts([...accounts, newAccount]);
    setActiveAccount(newAccount); // Optionally set as active
    setIsModalVisible(false);
  };

  return (
    <section>
      <p className="text-5xl text-center text-black font-thin font-sans pt-10 pb-24">{user?.firstName ?? "Guest"}'s account</p>
      <div>
      </div>
      {/* Render account card buttons dynamically */}
      <div className="shadow-xl grid grid-cols-3 gap-4 place-items-center">
        {accounts.map((account) => (
          <Button
            className="shadow-md bg-gray-100 border-cyan-700 mb-10 w-[50%] h-full"
            key={account.key}
            onClick={() => setActiveAccount(account)}
          >
            <IdcardOutlined />
            {account.name}
          </Button>
        ))}
        <Button
          className="grid grid-flow-row place-content-center place-items-center shadow-md bg-gray-100 border-cyan-700 mb-10 w-[50%] h-full"
          onClick={showModal}
        >
          Add New Account <PlusOutlined />
        </Button>
      </div>

      {/* Render table based on the active account */}
      <Table className="px-24 py-6" dataSource={[activeAccount]} columns={columns} />

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
