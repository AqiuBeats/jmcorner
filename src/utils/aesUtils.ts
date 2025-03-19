import CryptoJS from 'crypto-js';

const secretKey = process.env.AES_SECRET_KEY || '';

export const encodeAESData = (data: string) => {
  const encodeData = CryptoJS.AES.encrypt(data, secretKey).toString();
  return encodeData;
};

export const decodeAESData = (password: string) => {
  const bytes = CryptoJS.AES.decrypt(password, secretKey);
  const decode_pwd = bytes.toString(CryptoJS.enc.Utf8);
  return decode_pwd;
};
