import { Link } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import { useEditProfileForm } from '../hooks/useEditProfile'
import ProfileForm from '../components/ProfileForm'
import { editProfileFields } from '../validation/formVariantConfig'

/* Pagina de edicao de perfil */
export default function EditPage() {
  /* Hook para o formulario de edicao de perfil */
  const {
    loading,
    name,
    email,
    password,
    confirmPassword,
    fieldErrors,
    formError,
    successMessage,
    isSubmitting,
    onFieldChange,
    handleSubmit,
  } = useEditProfileForm()

  /* Renderizacao do componente */
  if (loading) {
    return (
      <div className="auth-shell">
        <div className="auth-card auth-card-page-wide">
          <p className="text-muted-center">
            Carregando…
          </p>
        </div>
      </div>
    )
  }

  /* Retorno do componente */
  return (
    <div className="auth-shell">
      <div className="auth-card auth-card-page-wide">
        <h1 className="auth-title">Atualizar perfil</h1>
        <p className="auth-subtitle">
          Atualize nome, e-mail e, se quiser, sua senha.
        </p>
        
        {/* Mensagem de sucesso */}
        {successMessage ? (
          <AlertMessage variant="success">
            {successMessage}
              </AlertMessage>
        ) : null}

        {/* Mensagem de erro */}
        {formError ? (
          <AlertMessage variant="error">
            {formError}
              </AlertMessage>
            ) : null}

        {/* Formulario de edicao de perfil */}
        <ProfileForm fields={editProfileFields}
          name={name}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          fieldErrors={fieldErrors}
          isSubmitting={isSubmitting}
          onFieldChange={onFieldChange}
          onSubmit={handleSubmit}
        />

        {/* Botao de voltar para a tela inicial */}
        <p className="auth-footer">
          <Link className="auth-link" to="/welcome">
            Voltar para a tela inicial
          </Link>
        </p>
      </div>
    </div>
  )
}
