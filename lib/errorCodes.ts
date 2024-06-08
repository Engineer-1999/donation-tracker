export const errorCodes = {
  form_password_incorrect: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  form_identifier_not_found: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  form_password_length_too_short:
    'كلمة المرور قصيرة جدا، برجاء إدخال كلمة مرور أقوي',
  form_code_incorrect: 'رمز التاكيد غير صحيح',
};

type ErrorCode = keyof typeof errorCodes;

export const generateErrorMessage = (errorCode: string) => {
  return errorCodes[errorCode as ErrorCode];
};
