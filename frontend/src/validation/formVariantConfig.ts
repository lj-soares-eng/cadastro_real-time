export const loginProfileConfig = {
  idEmail: 'login-email',
  idPassword: 'login-password',
  labelPassword: 'Senha',
  placeholderPassword: '••••••',
  passwordAutoComplete: 'current-password',
} as const

export const registerProfileConfig = {
  idEmail: 'register-email',
  idPassword: 'register-password',
  labelPassword: 'Senha',
  placeholderPassword: 'Mínimo 6 caracteres',
  passwordAutoComplete: 'new-password',
} as const

export const editProfileConfig = {
  idEmail: 'edit-email',
  idPassword: 'edit-password',
  labelPassword: 'Nova senha (opcional)',
  placeholderPassword: 'Deixe em branco para manter',
  passwordAutoComplete: 'new-password',
} as const

export type LoginProfileConfig = 
 typeof loginProfileConfig 
|typeof registerProfileConfig
|typeof editProfileConfig

export const registerProfileFields = {
    ...registerProfileConfig,

    idName: 'register-name',
    idConfirm: 'register-confirm',
    labelConfirm: 'Confirmar senha',
    placeholderConfirm: 'Repita a senha',
    submitIdle: 'Criar conta',
    submitBusy: 'Cadastrando…',
  } as const

export const editProfileFields = {
    ...editProfileConfig,

    idName: 'edit-name',
    idConfirm: 'edit-confirm',
    labelConfirm: 'Confirmar nova senha',
    placeholderConfirm: 'Repita a nova senha',
    submitIdle: 'Salvar alterações',
    submitBusy: 'Salvando…',
  } as const
  export type FormFieldsConfig =
    | typeof registerProfileFields
    | typeof editProfileFields