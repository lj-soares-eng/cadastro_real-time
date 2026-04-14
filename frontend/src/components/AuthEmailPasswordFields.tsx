import AuthTextField from './AuthTextField'
import { type FieldErrors } from '../validation/profileForm'
import { type LoginProfileConfig } from '../validation/formVariantConfig'

/* Função para mudar o valor de um campo */
function fieldChange(
    onFieldChange: (field: AuthEmailPasswordField, value: string) => void,
    field: AuthEmailPasswordField,
  ) {
    return (value: string) => onFieldChange(field, value)
  }

/* Tipo de dado para as propriedades do componente ProfileForm */
type AuthEmailPasswordFieldsProps = {
    email: string
    password: string
    fieldErrors: FieldErrors
    config: LoginProfileConfig
    onFieldChange: (
        field: 'email' | 'password',
        value: string,
      ) => void  
    }  

/* Tipo de campo de login */
type AuthEmailPasswordField = 'email' | 'password'

/* Componente de campos de e-mail e senha */
export default function AuthEmailPasswordFields({
  email,
  password,
  fieldErrors,
  config,
  onFieldChange,
}: AuthEmailPasswordFieldsProps) {

  /* Retorno do componente */
  return (
    <>
      {/* Campo de e-mail */}
      <AuthTextField
        id={config.idEmail}
        label="E-mail"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onValueChange={fieldChange(onFieldChange, 'email')}
        error={fieldErrors.email}
        placeholder="user@provider.com"
      />

      {/* Campo de senha */}
      <AuthTextField
        id={config.idPassword}
        label={config.labelPassword}
        type="password"
        name="password"
        autoComplete={config.passwordAutoComplete}
        value={password}
        onValueChange={fieldChange(onFieldChange, 'password')}
        error={fieldErrors.password}
        placeholder={config.placeholderPassword}
      />
    </>
  )
}
