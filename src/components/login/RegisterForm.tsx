import { Form, Input } from 'antd';
// import { useTranslation } from "react-i18next";

// import userService from "@/api/services/userService";

import { ReturnButton } from './components/ReturnButton';
// import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { encodeAESData } from '@/utils/aesUtils';
import { useCreateUserMutation } from '@/helpers/request';
import {
  LoginStateEnum,
  useLoginStateContext,
} from '@/components/login/components/LoginStateProvider';
// import { User } from '@prisma/client';

function RegisterForm() {
  // const { t } = useTranslation();
  //? Create User
  const [form] = Form.useForm();

  const {
    mutate: createUser,
    // data,
    // isSuccess,
    // isError,
    isPending, // 替换 isLoading
    // error,
  } = useCreateUserMutation();

  const { loginState, backToLogin } = useLoginStateContext();

  type FormObj = {
    phone: string;
    password: string;
    remember: boolean;
  };

  const handleClickRegister = (values: FormObj) => {
    const pwd = values.password;
    values.password = encodeAESData(pwd);
    createUser(values);
  };

  if (loginState !== LoginStateEnum.REGISTER) return null;

  return (
    <>
      <div className="mb-4 text-2xl font-bold xl:text-3xl">{'注册'}</div>
      <Form
        form={form}
        name="phone"
        size="large"
        initialValues={{ remember: true }}
        onFinish={handleClickRegister}
      >
        <Form.Item
          name="phone"
          rules={[
            { required: true, message: '请输入手机号' },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入有效的手机号',
            },
          ]}
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
          rules={[
            { required: true, message: '请输入密码' },
            { min: 8, message: '密码必须至少 8 位' },
          ]}
        >
          <Input.Password placeholder={'密码'} />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: '请输入密码',
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
            type="submit"
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
