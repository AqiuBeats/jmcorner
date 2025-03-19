import { Button } from 'antd';
// import { useTranslation } from "react-i18next";
import { MdArrowForwardIos, MdArrowBackIosNew } from 'react-icons/md';

interface ReturnButtonProps {
  iconType: 'forward' | 'back';
  title: string;
  onClick: () => void;
}

export function ReturnButton({ iconType, title, onClick }: ReturnButtonProps) {
  // const { t } = useTranslation();
  return (
    <Button block type="link" onClick={onClick}>
      <div className="flex items-center justify-center hover:underline">
        {iconType === 'forward' && <MdArrowForwardIos />}
        {iconType === 'back' && <MdArrowBackIosNew />}
        <span className="text-sm">{title}</span>
      </div>
    </Button>
  );
}
