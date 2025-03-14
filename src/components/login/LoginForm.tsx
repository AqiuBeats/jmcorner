'use client';
import { Checkbox, Col, Divider, Form, Input, Row } from 'antd';
import { AiFillGithub, AiFillGoogleCircle, AiFillWechat } from 'react-icons/ai';
import { DEFAULT_USER } from '@/_mock/assets';
import { signIn } from 'next-auth/react';
import CryptoJS from 'crypto-js';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function LoginForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const secretKey = process.env.AES_SECRET_KEY || '';
  const handleClickLogin = async () => {
    // toast.success('Success!', {
    //   description: 'Your action was completed successfully.',
    // });
    setLoading(true);
    const values = form.getFieldsValue();
    const pwd = values.password;
    values.password = CryptoJS.AES.encrypt(pwd, secretKey).toString(); // 替换密码为加密后的密码
    const result = await signIn('credentials', {
      redirect: false,
      ...values,
      callbackUrl: '/',
      json: true,
    });
    if (result?.ok) {
      toast.success('', {
        description: '登录成功!',
      });
      // setTimeout(() => {
      //   redirect('/');
      // }, 1000);
      // redirect('/');
    }
    setLoading(false);
  };

  const handleClickRegister = async () => {
    const values = form.getFieldsValue();
    const pwd = values.password;
    values.password = CryptoJS.AES.encrypt(pwd, secretKey).toString(); // 替换密码为加密后的密码
    console.log('values', values);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    console.log('res', res);

    if (res.ok) {
      // await signIn('credentials', values);
    } else {
      alert('注册失败，请检查输入');
    }
  };

  return (
    <>
      <div className="mb-4 text-2xl font-bold xl:text-3xl">{'登录'}</div>
      <Form
        form={form}
        name="login"
        size="large"
        initialValues={{
          remember: true,
          phone: '13147173415',
          password: DEFAULT_USER.password,
          // action: 'login',
        }}
        // onFinish={handleFinish}
      >
        {/* <div className="mb-4 flex flex-col">
          <Alert
            description={
              <div className="flex flex-col">
                <div className="flex">
                  <span className="flex-shrink-0 text-text-disabled">
                    {'账号'}:
                  </span>
                  <span className="ml-1 text-text-secondary">
                    {DEFAULT_USER.username}
                  </span>
                </div>
                <div className="flex">
                  <span className="flex-shrink-0 text-text-disabled">
                    {'密码'}:
                  </span>
                  <span className="ml-1 text-text-secondary">
                    {DEFAULT_USER.password}
                  </span>
                </div>
              </div>
            }
            showIcon
          />
        </div> */}

        <Form.Item
          name="phone"
          rules={[{ required: true, message: '请输入账号' }]}
        >
          <Input placeholder={'账号'} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password type="password" placeholder={'密码'} />
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
            onClick={handleClickLogin}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                请稍等...
              </>
            ) : (
              '登 录'
            )}
          </Button>

          {/* <Button type="primary" onClick={handleClickLogin}>
            {'登 录'}
          </Button>
          <Button type="primary" onClick={handleClickRegister}>
            {'注 册'}
          </Button> */}
        </Form.Item>

        <Row align="middle" gutter={8}>
          <Col span={9} flex="1">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              {'手机登录'}
            </Button>
          </Col>
          <Col span={9} flex="1">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              {'二维码登录'}
            </Button>
          </Col>
          <Col span={6} flex="1">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              {'注册'}
            </Button>
          </Col>
        </Row>

        <Divider className="!text-xs">{'其他登录方式'}</Divider>

        <div className="flex cursor-pointer justify-around text-2xl">
          <AiFillGithub />
          <AiFillWechat />
          <AiFillGoogleCircle />
        </div>
      </Form>
    </>
  );
}

export default LoginForm;
