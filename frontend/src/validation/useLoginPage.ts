import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginRequest } from '../api/auth'
import {
  type LoginFieldErrors,
  validateLoginForm,
} from './profileForm'

type LoginField = 'email' | 'password'

/* Hook para o formulário da página de login */
export function useLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /* Setters de campos */
  const fieldSetters: Record<LoginField, (value: string) => void> = {
    email: setEmail,
    password: setPassword,
  }

  /* Função para mudar o valor de um campo */
  function onFieldChange(field: LoginField, value: string) {
    fieldSetters[field]?.(value)
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  /* Função para enviar o formulário */
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)

    const errors = validateLoginForm(email, password)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }

    setIsSubmitting(true)
    void loginRequest({ email: email.trim(), password, clientType: 'web' })
      .then(() => {
        navigate('/welcome')
        setPassword('')
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Não foi possível entrar.'
        setFormError(message)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  /* Retorno do hook */
  return {
    email,
    password,
    fieldErrors,
    formError,
    isSubmitting,
    handleSubmit,
    onFieldChange,
  }
}
