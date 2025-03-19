import { Form, Input } from 'antd';
// import { useTranslation } from "react-i18next";

// import userService from "@/api/services/userService";

import { ReturnButton } from './components/ReturnButton';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { encodeAESData } from '@/utils/aesUtils';
import { useCreateUserMutation } from '@/helpers/request';
import {
  LoginStateEnum,
  useLoginStateContext,
} from '@/components/login/components/LoginStateProvider';
import { User } from '@prisma/client';

function RegisterForm() {
  // const { t } = useTranslation();
  //? Create User
  const [form] = Form.useForm();
  //   const [createUser, { data, isSuccess, isError, isLoading, error }] =
  //     useCreateUserMutation(userData);

  const {
    mutate: createUser,
    data,
    isSuccess,
    isError,
    isPending, // 替换 isLoading
    error,
  } = useCreateUserMutation();

  const { loginState, backToLogin } = useLoginStateContext();

  // 将 useEffect 移到条件语句之前
  useEffect(() => {
    if (isSuccess) {
      toast.success('注册成功');
    //   console.log('注册成功', data);
      setTimeout(() => {
        backToLogin();
      }, 1000);
    }
    if (isError) {
      toast.error('注册失败' + error);
    }
  }, [isSuccess, isError]);

  if (loginState !== LoginStateEnum.REGISTER) return null;

  const handleClickRegister = async () => {
    try {
      const values = form.getFieldsValue();
      const pwd = values.password;
      values.password = encodeAESData(pwd);
      createUser(values); // 调用 createUser
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  return (
    <>
      <div className="mb-4 text-2xl font-bold xl:text-3xl">{'注册'}</div>
      <Form
        form={form}
        name="phone"
        size="large"
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="phone"
          rules={[{ required: true, message: '请输入手机号' }]}
        >
          <Input placeholder={'手机号'} />
        </Form.Item>
        {/* <Form.Item
          name="email"
          rules={[{ required: true, message: 'sys.login.emaildPlaceholder' }]}
        >
          <Input placeholder={'sys.login.email'} />
        </Form.Item> */}
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password type="password" placeholder={'密码'} />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: '请确认密码',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password type="password" placeholder={'确认密码'} />
        </Form.Item>
        <Form.Item>
          {/* <Button type="primary" htmlType="submit" className="w-full">
            {'注册'}
          </Button> */}
          <Button
            onClick={handleClickRegister}
            disabled={isPending}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                请稍等...
              </>
            ) : (
              '注 册'
            )}
          </Button>
        </Form.Item>

        {/* <div className="mb-2 text-xs text-gray">
          <span>{'sys.login.registerAndAgree'}</span>
          <a href="./" className="text-sm !underline">
            {'sys.login.termsOfService'}
          </a>
          {' & '}
          <a href="./" className="text-sm !underline">
            {'sys.login.privacyPolicy'}
          </a>
        </div> */}

        <ReturnButton
          iconType="back"
          title="登录"
          onClick={() => backToLogin()}
        />
      </Form>
    </>
  );
}

export default RegisterForm;
