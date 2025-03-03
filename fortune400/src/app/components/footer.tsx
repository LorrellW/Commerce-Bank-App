//src\app\components\footer.tsx
import { GithubOutlined, MailOutlined } from '@ant-design/icons'
import { LinkedinOutlined } from '@ant-design/icons'
import { DiscordOutlined } from '@ant-design/icons'
import { MessageOutlined } from '@ant-design/icons'
import React from 'react';
import { Input } from 'antd';

interface FooterProps {
  companyName?: string; // optional prop
  rightsReserverd?: string; //optional prop
}

export default function Footer({ companyName = "Fortune400", rightsReserverd = "All rights reserved." }: FooterProps) {
  return (
    <footer className="flex p-6 grid-cols-2 justify-evenly bg-primary text-white h-64 items-start">
      <div className='justify-start w-1/3 text-sm space-y-1'>
        <p>&copy; {new Date().getFullYear()} {companyName}.</p>
        <p>{rightsReserverd}</p>
        <section className='py-4 space-x-6'>
          <GithubOutlined style={{ fontSize: '24px' }} />
          <LinkedinOutlined style={{ fontSize: '24px' }} />
          <DiscordOutlined style={{ fontSize: '24px' }} />
          <MessageOutlined style={{ fontSize: '24px' }} />
        </section>
      </div>

      <div className='w-1/2'>
        <section className='flex grid-cols-3 justify-evenly py-4'>
          <div className='col-span-1'>
            <p className='pb-8'>Company</p>
            <div className='text-xs  space-y-4'>
              <p>Blog</p>
              <p>About Us</p>
              <p>Contact Us</p>
            </div>
          </div>

          <div className='col-span-2'>
            <p className='pb-8'>Support</p>
            <div className='text-xs space-y-4'>
              <p>Terms of service</p>
              <p>Privacy policy</p>
              <p>Legal</p>
            </div>
          </div>

          <div className='col-span-3 justify-items-start'>
            <div className='flex flex-row space-x-6 justify-evenly'>
            <p className='pb-6'>Stay up to date</p>
            <MailOutlined className='pb-6' />
            </div>
            <div className='flex'>
              <Input className='flex flex-row px-2'></Input>
            </div>
          </div>
        </section>
      </div>
    </footer>

  );
}