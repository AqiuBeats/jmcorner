'use client';
import LoginForm from '@/components/login/LoginForm';
// import MobileForm from '@/components/login/MobileForm';
// import QrCodeFrom from '@/components/login/QrCodeForm';
import RegisterForm from '@/components/login/RegisterForm';
// import ResetForm from '@/components/login/ResetForm';

import { LoginStateProvider } from '@/components/login/components/LoginStateProvider';
import { AuroraBackground } from '@/components/ui/aurora-background';

// const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

const Login = ({ searchParams }: { searchParams: { loginState?: string } }) => {
  const type = searchParams.loginState; //use现在是一个实验型API,不需要管
  console.log('type', type);
  // const { t } = useTranslation();
  // const token = useUserToken();

  // // 判断用户是否有权限
  // if (token.accessToken) {
  // 	// 如果有授权，则跳转到首页
  // 	return <Navigate to={HOMEPAGE} replace />;
  // }

  //   const gradientBg = rgbAlpha(themeVars.colors.background.defaultChannel, 0.9);
  // const bg = `linear-gradient(135deg, rgba(var(--colors-palette-primary-lightChannel), .2), rgba(var(--colors-palette-primary-defaultChannel), .2)) var(--colors-common-white)`;

  return (
    // bg-[#ffe8e4]
    <AuroraBackground>
      <div className="relative flex !min-h-screen !w-full !flex-row ">
        {/* <div
				className="hidden grow flex-col items-center justify-center gap-[80px] bg-center  bg-no-repeat md:flex"
				style={{
					background: bg,
				}}
			>
				<div className="text-3xl font-bold leading-normal lg:text-4xl xl:text-5xl">Slash Admin</div>
				<img className="max-w-[480px] xl:max-w-[560px]" src={DashboardImg} alt="" />
				<Typography.Text className="flex flex-row gap-[16px] text-2xl">
					{t("sys.login.signInSecondTitle")}
				</Typography.Text>
			</div> */}

        {/* bg-gradient-to-t from-[#ffe8e4] to-[#ffe8e4]/70 */}
        <div
          className="m-auto flex !h-screen w-full max-w-[480px] flex-col justify-center px-[16px] lg:px-[64px]
	    "
        >
          <LoginStateProvider>
            <LoginForm loginState={type} />
            {/* <MobileForm /> */}
            {/* <QrCodeFrom /> */}
            <RegisterForm />
            {/* <ResetForm /> */}
          </LoginStateProvider>
        </div>

        <div className="absolute right-2 top-0 flex flex-row">
          {/* <LocalePicker /> */}
          {/* <SettingButton /> */}
        </div>
      </div>
    </AuroraBackground>
  );
};
export default Login;
