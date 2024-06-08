'use client';

import { useSignUp } from '@clerk/nextjs';

import { useState } from 'react';
import LoginForm from './loginForm';
import VerifyingForm from './verifyingForm';

const RegisterPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <h1 className='text-2xl font-bold mb-4'>
        {verifying ? 'تأكيد بريدك الالكتروني' : 'إنشاء حساب جديد'}
      </h1>
      <p className='text-sm text-gray-500'>
        {verifying
          ? 'ادخل الرمز المروري الذي تم إرساله إلى بريدك الالكتروني للتأكيد.'
          : 'برجاء ملء البيانات ادناه لإنشاء حساب جديد في منصة سخاء.'}
      </p>
      {verifying ? (
        <VerifyingForm
          setActive={setActive}
          signUp={signUp}
          isLoaded={isLoaded}
          verefyinging={loading}
          setVerefyinging={setLoading}
        />
      ) : (
        <LoginForm
          setVerifying={setVerifying}
          signUp={signUp}
          isLoaded={isLoaded}
          authenticating={loading}
          setAuthenticating={setLoading}
        />
      )}
    </>
  );
};

export default RegisterPage;
