// settings/page.tsx

import React from 'react';
import LoginComponent from "@/app/components/LoginModal";
import RegisterComponent from "@/app/components/RegisterComponent";
import SignUpModal from '@/app/components/LoginModal';

export default function SettingsPage() {
  return (
    <div>
      <RegisterComponent/>  
      <LoginComponent open={false} 
                      onClose={function (): void {
                      throw new Error('Function not implemented.');
      } }/>    
    </div>
  );
}
