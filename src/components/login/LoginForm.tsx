'use client';
import { Checkbox, Col, Divider, Form, Input, Row } from 'antd';
import { AiFillGithub, AiFillGoogleCircle, AiFillWechat } from 'react-icons/ai';
import { DEFAULT_USER } from '@/_mock/assets';
import { signIn } from 'next-auth/react';
import CryptoJS from 'crypto-js';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { encodeAESData } from '@/utils/aesUtils';
import {
  LoginStateEnum,
  useLoginStateContext,
} from '@/components/login/components/LoginStateProvider';
import { ReturnButton } from './components/ReturnButton';
import { useLoginMutation } from '@/helpers/request';
import { errorToString } from '@/utils/errorUtils';
import { useRouter } from 'next/navigation'; // 引入 useRouter

function LoginForm() {
  const router = useRouter(); // 使用 useRouter
  const { loginState, setLoginState } = useLoginStateContext();

  const {
    mutate: login,
    data,
    isSuccess,
    isError,
    isPending, // 替换 isLoading
    error,
  } = useLoginMutation();

  const handleClickLogin = async (values: any) => {
    const pwd = values.password;
    values.password = encodeAESData(pwd);
    login(values, {
      onSuccess: () => {
        toast.success('登录成功!');
        // redirect('/square');
        router.push('/square'); // 使用 router.push 替代 redirect
      },
      onError: (error) => {
        toast.error('登录失败:' + errorToString(error));
      },
    });
    // const result = await signIn('credentials', {
    //   redirect: false,
    //   ...values,
    //   callbackUrl: '/',
    //   json: true,
    // });
    // if (result?.ok) {
    //   toast.success('', {
    //     description: '登录成功!',
    //   });
    //   // setTimeout(() => {
    //   //   redirect('/');
    //   // }, 1000);
    //   // redirect('/');
    // }
  };

  if (loginState !== LoginStateEnum.LOGIN) return null;

  return (
    <>
      <div className="mb-4 text-2xl font-bold xl:text-3xl">{'登录'}</div>
      <Form
        name="login"
        size="large"
        initialValues={{
          remember: true,
        }}
        onFinish={handleClickLogin}
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
        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 8, message: '密码必须至少 8 位' },
          ]}
        >
          <Input.Password placeholder={'密码'} />
        </Form.Item>
        <Form.Item>
          <Row align="middle">
            <Col span={12}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>{'记住我'}</Checkbox>
              </Form.Item>
            </Col>
            <Col span={12} className="text-right">
              {/* <Button type="link" className="!underline" size="small">
                {'忘记密码?'}
              </Button> */}
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          {/* <Button
            onClick={handleClickLogin}
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            {'登 录'}
          </Button> */}

          <Button
            type="submit"
            // onClick={handleClickLogin}
            disabled={isPending}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                请稍等...
              </>
            ) : (
              '登 录'
            )}
          </Button>
        </Form.Item>

        {/* <Row align="middle" gutter={8}>
          <Col span={9} flex="1">
            <Button
              onClick={() => setLoginState(LoginStateEnum.MOBILE)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {'手机登录'}
            </Button>
          </Col>
          <Col span={9} flex="1">
            <Button
              onClick={() => setLoginState(LoginStateEnum.QR_CODE)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {'二维码登录'}
            </Button>
          </Col>
          <Col span={6} flex="1">
            <Button
              onClick={() => setLoginState(LoginStateEnum.REGISTER)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {'注册'}
            </Button>
          </Col>
        </Row> */}

        {/* <Divider className="!text-xs">{'其他登录方式'}</Divider> */}

        {/* <div className="flex cursor-pointer justify-around text-2xl">
          <AiFillGithub />
          <AiFillWechat />
          <AiFillGoogleCircle />
        </div> */}
        <ReturnButton
          iconType="forward"
          title="注册"
          onClick={() => setLoginState(LoginStateEnum.REGISTER)}
        />
      </Form>
    </>
  );
}

export default LoginForm;
