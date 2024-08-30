'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from './AuthForm';
import userServices from '@/services/userServices';
import { useDynamicToast } from '@/lib/toastUtils';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { showToast } = useDynamicToast();

  const handleLogin = async (data: any) => {
    setIsLoading(true);
    try {
      await userServices.login({
        email: data.email,
        password: data.password,
      });
      router.push('/dashboard');
      showToast("Success", "You have successfully logged in.", "default");
    } catch (error: any) {
      showToast('Error', error.message, "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: any) => {
    setIsLoading(true);
    try {
      await userServices.signup({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        monthlyIncome: Number(data.monthlyIncome),
        profileImageUrl: data.profileImageUrl,
        bio: data.bio,
        skills: data.skills,
        interests: data.interests,
      });
      router.push('/dashboard');
      showToast("Success", "User created successfully.", "default");
    } catch (error: any) {
      showToast('Error', error.message, "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      isLogin={isLogin}
      step={step}
      handleLogin={handleLogin}
      handleSignup={handleSignup}
      setStep={setStep}
      setIsLogin={setIsLogin}
      isLoading={isLoading}
    />
  );
};

export default LoginPage;
