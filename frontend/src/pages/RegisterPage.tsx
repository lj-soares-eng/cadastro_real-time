import { Link } from 'react-router-dom'
import RegisterProfileForm from '../components/RegisterProfileForm'
import { useRegisterProfile } from '../validation/useRegisterProfile'
import AlertMessage from '../components/AlertMessage'

/* Pagina de registro */
export default function RegisterPage() {
  /* Hook para o formulario de registro de perfil */
  const { name,
          email, 
          password, 
          confirmPassword, 
          fieldErrors, 
          formError, 
          successMessage, 
          isSubmitting,
          handleSubmit, 
          onFieldChange, } = useRegisterProfile()


  /* Renderizacao do componente */
  return (
    <div className="auth-shell">
      <div className="auth-card max-w-105">
        <h1 className="auth-title">Registrar-se</h1>
        <p className="auth-subtitle">
          Preencha os dados para criar sua conta.
        </p>

        {/* Mensagem de sucesso */}
        {successMessage ? (
        <AlertMessage variant="success">
          {successMessage}{' '}
              <Link className="auth-link" to="/login">
                Ir para o login
              </Link>
            </AlertMessage>
          ) : null}

        {/* Mensagem de erro */}
        {formError ? (
        <AlertMessage variant="error">{formError}</AlertMessage>
            ) : null}
            
        <RegisterProfileForm 
        name={name} 
        email={email} 
        password={password} 
        confirmPassword={confirmPassword} 
        fieldErrors={fieldErrors} 
        isSubmitting={isSubmitting}
        onFieldChange={onFieldChange} 
        onSubmit={handleSubmit} />
        
        {/* Link para a pagina de login */}
        <p className="auth-footer">
          Já tem conta? <Link className="auth-link" to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
