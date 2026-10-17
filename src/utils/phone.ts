export const toDigits = (value: string) => value.replace(/\D/g, '');

// "01012345678" → "010-1234-5678", 입력 중인 값도 변환
export const formatPhone = (value: string) => {
  const d = toDigits(value).slice(0, 11);
  return [d.slice(0, 3), d.slice(3, 7), d.slice(7)].filter(Boolean).join('-');
};

export const isValidPhone = (value: string) => /^010\d{8}$/.test(toDigits(value));
