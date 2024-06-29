'use client';

import { useSignUp } from '@clerk/nextjs';

import { useState } from 'react';
import RegisterForm from './forms/registerForm';
import UserDetailsForm from './forms/userDetailsForm';
import VerifyingForm from './forms/verifyingForm';

const RegisterPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [userDetails, setUserDetails] = useState(false);

  const title = {
    initial: 'إنشاء حساب جديد',
    verifying: 'تأكيد بريدك الالكتروني',
    userDetails: 'ادخل بياناتك',
  } as const;

  const description = {
    initial: 'برجاء ملء البيانات ادناه لإنشاء حساب جديد في منصة سخاء.',
    verifying:
      'ادخل الرمز المروري الذي تم إرساله إلى بريدك الالكتروني للتأكيد.',
    userDetails: 'ادخل بياناتك ادناه حتى نتمكن من إنشاء حسابك الجديد.',
  } as const;

  return (
    <>
      <h1 className='text-2xl font-bold mb-4'>
        {verifying && !userDetails
          ? title['verifying']
          : userDetails
            ? title['userDetails']
            : title['initial']}
      </h1>
      <p className='text-sm text-gray-500'>
        {verifying && !userDetails
          ? description['verifying']
          : userDetails
            ? description['userDetails']
            : description['initial']}
      </p>
      {verifying && !userDetails ? (
        <VerifyingForm
          setActive={setActive}
          signUp={signUp}
          isLoaded={isLoaded}
          verefyinging={loading}
          setVerefyinging={setLoading}
          setUserDetails={setUserDetails}
        />
      ) : userDetails ? (
        <UserDetailsForm />
      ) : (
        <RegisterForm
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
