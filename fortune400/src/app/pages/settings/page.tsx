// settings/page.tsx

import React from 'react';
import LoginComponent from "@/app/components/LoginComponent";
import SignupComponent from "@/app/components/SignupComponent";

export default function SettingsPage() {
  return (
    <div>
      <SignupComponent/>
      <LoginComponent />
      
    </div>
  );
}
