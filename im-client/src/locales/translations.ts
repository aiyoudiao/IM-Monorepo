export const translations = {
  en: {
    send: "Send",
    typeMessage: "Type a message...",
    uploadImage: "Upload Image",
    languageSelector: "Select Language",
    emailFeedback: "I'd like to receive feedback to this email address",
    saveEmail: "Save",
    emailPlaceholder: "Enter your email",
    emailSaved: "Email saved successfully!",
    invalidEmail: "Please enter a valid email address",
  },
  zh: {
    send: "发送",
    typeMessage: "输入消息...",
    uploadImage: "上传图片",
    languageSelector: "选择语言",
    emailFeedback: "我希望通过这个电子邮箱接收反馈",
    saveEmail: "保存",
    emailPlaceholder: "输入您的电子邮箱",
    emailSaved: "电子邮箱保存成功！",
    invalidEmail: "请输入有效的电子邮箱地址",
  },
  es: {
    send: "Enviar",
    typeMessage: "Escribe un mensaje...",
    uploadImage: "Subir imagen",
    languageSelector: "Seleccionar idioma",
    emailFeedback:
      "Me gustaría recibir comentarios en esta dirección de correo electrónico",
    saveEmail: "Guardar",
    emailPlaceholder: "Ingrese su correo electrónico",
    emailSaved: "¡Correo electrónico guardado con éxito!",
    invalidEmail:
      "Por favor, introduce una dirección de correo electrónico válida",
  },
};

export type LanguageCode = keyof typeof translations;
