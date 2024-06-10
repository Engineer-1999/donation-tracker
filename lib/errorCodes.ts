export const errorMessages = {
  form_password_incorrect: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  form_identifier_not_found: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  form_password_length_too_short:
    'كلمة المرور قصيرة جدا، برجاء إدخال كلمة مرور أقوي',
  form_code_incorrect: 'رمز التاكيد غير صحيح',
  form_identifier_exists: 'هذا البريد الإلكتروني قد يكون مسجل لدينا بالفعل',
};

type ErrorCode = keyof typeof errorMessages;

export const generateErrorMessage = (errorCode: string) => {
  return errorMessages[errorCode as ErrorCode];
};
