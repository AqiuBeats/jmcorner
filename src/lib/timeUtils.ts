export const timeUTCToCN = (
  utcDateString: string | Date,
  format?: '/' | '-' | ':',
) => {
  let utcDate: Date;
  if (typeof utcDateString === 'string') {
    utcDate = new Date(utcDateString);
  } else {
    utcDate = utcDateString;
  }
  const chinaDate = new Date(utcDate.getTime());
  const formattedDate = chinaDate.toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai', // 指定时区为中国时间
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 使用24小时制
  });

  if (format === '/' || !format) {
    return formattedDate;
  } else if (format === ':') {
    return formattedDate.replace(/\//g, ':');
  }
  return formattedDate.replace(/\//g, '-');
};
