'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { ArrowPathIcon, ArrowRightIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AuthFormProps {
  isLogin: boolean;
  isLoading: boolean;
  step: number;
  handleLogin: (data: LoginFormData) => void;
  handleSignup: (data: SignupFormData) => void;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData extends LoginFormData {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImageUrl?: string;
  bio?: string;
}

type FormData = LoginFormData & Partial<SignupFormData>;

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const signupSchemas = [
  yup.object().shape({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  }),
  yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    phoneNumber: yup.string().matches(/^[0-9]+$/, 'Phone Number must be digits only').required('Phone Number is required'),
  }),
  yup.object().shape({
    profileImageUrl: yup.string().url('Invalid URL'),
    bio: yup.string(),
  }),
];

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  isLoading,
  step,
  handleLogin,
  handleSignup,
  setStep,
  setIsLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const schema: any = isLogin ? loginSchema : signupSchemas[step - 1];

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    watch
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (isLogin) {
      reset();
    } else {
      reset({
        email: watch('email') || '',
      });
    }
    setStep(1);
  }, [isLogin, reset, watch, setStep]);

  const onSubmit = (data: FormData) => {
    if (isLogin) {
      handleLogin(data as LoginFormData);
    } else if (step === 3) {
      handleSignup(data as SignupFormData);
    }
  };

  const handleNextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      setStep(step + 1);
    }
  };

  const renderField = (name: keyof FormData, type: string, placeholder: string) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="relative">
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            className={`w-full bg-gray-800 text-white placeholder-gray-500 border-gray-600 ${errors[name] ? 'border-red-500' : ''}`}
          />
          {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message}</p>}
        </div>
      )}
    />
  );

  const renderPasswordField = () => (
    <div className="relative">
      <Input
        {...control.register('password')}
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        className={`w-full bg-gray-800 text-white placeholder-gray-500 border-gray-600 ${errors.password ? 'border-red-500' : ''}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-3 flex items-center"
      >
        {showPassword ? <EyeIcon className="h-5 w-5 text-gray-300" /> : <EyeSlashIcon className="h-5 w-5 text-gray-300" />}
      </button>
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
    </div>
  );

  const loginFields = [
    renderField('email', 'email', 'Email'),
    renderPasswordField(),
  ];

  const signupFields = [
    step === 1 && renderField('username', 'text', 'Username'),
    step === 1 && renderField('email', 'email', 'Email'),
    step === 1 && renderPasswordField(),
    step === 2 && renderField('firstName', 'text', 'First Name'),
    step === 2 && renderField('lastName', 'text', 'Last Name'),
    step === 2 && renderField('phoneNumber', 'tel', 'Phone Number'),
    step === 3 && renderField('profileImageUrl', 'url', 'Profile Image URL'),
    step === 3 && (
      <Controller
        name="bio"
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="Short bio"
            className={`w-full bg-gray-800 text-white placeholder-gray-500 border-gray-600 ${errors.bio ? 'border-red-500' : ''}`}
          />
        )}
      />
    ),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-800 shadow-md shadow-emerald-400 p-8 rounded-2xl  w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          {isLogin ? 'Lets Dress Up!' : 'Join Us Today'}
        </h2>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {isLogin ? loginFields : signupFields}
          <Button
            type={isLogin || step === 3 ? "submit" : "button"}
            onClick={!isLogin && step < 3 ? handleNextStep : undefined}
            className="w-full py-4 bg-emerald-400 hover:bg-emerald-500 text-white"
            disabled={isLoading}
          >
            {isLoading ? <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" /> : (
              <>
                {isLogin ? 'Sign In' : (step < 3 ? 'Next' : 'Sign Up')}
                {!isLogin && step < 3 && <ArrowRightIcon className="h-5 w-5 ml-2" />}
              </>
            )}
          </Button>
        </motion.form>
        <p className="mt-6 text-center text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setStep(1);
            }}
            className="ml-1 text-emerald-400 hover:underline font-semibold"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
