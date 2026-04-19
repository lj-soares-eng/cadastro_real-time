import { useState, type FormEvent } from "react"
import { type FieldErrors, validateProfileForm } from "../validation/profileForm"
import { registerUser } from "../api/users"

/* Tipo de dado para os campos editaveis */
type EditableField = 'name' | 'email' | 'password' | 'confirmPassword'

/* Hook para o formulário de registro de perfil */
export function useRegisterProfile() {
  /* Estado para o nome do usuário */
  const [name, setName] = useState('')
  /* Estado para o e-mail do usuário */
  const [email, setEmail] = useState('')
  /* Estado para a senha do usuário */
  const [password, setPassword] = useState('')
  /* Estado para a confirmação de senha do usuário */
  const [confirmPassword, setConfirmPassword] = useState('')
  /* Estado para os erros do formulário */
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  /* Estado para o erro do formulário */
  const [formError, setFormError] = useState<string | null>(null)
  /* Estado para a mensagem de sucesso */
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  /* Estado para o envio do formulário */
  const [isSubmitting, setIsSubmitting] = useState(false)

  /* Função para mudar o valor de um campo */
  const fieldSetters: Record<EditableField, (value: string) => void> = {
    name: setName,
    email: setEmail,
    password: setPassword,
    confirmPassword: setConfirmPassword,
  }

  /* Função para mudar o valor de um campo */
    function onFieldChange(field: EditableField, value: string) {
        fieldSetters[field]?.(value)
        if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    /* Funcao para submeter o formulario */
    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setFormError(null)
        setSuccessMessage(null)
    
        const errors = validateProfileForm(
          { name, email, password, confirmPassword },
          'register',
        )
        setFieldErrors(errors)
        if (Object.keys(errors).length > 0) {
          return
        }
    
        /* Setando o estado de submissao */
        setIsSubmitting(true)
        void registerUser({
          name: name.trim().replace(/\s+/g, ' '),
          email: email.trim(),
          password,
        })
          .then(() => {
            setSuccessMessage('Conta criada com sucesso. Você já pode entrar.')
            setPassword('')
            setConfirmPassword('')
          })
          .catch((err: unknown) => {
            const message =
              err instanceof Error ? err.message : 'Não foi possível cadastrar.'
            setFormError(message)
          })
          .finally(() => {
            setIsSubmitting(false)
          })
      }
    
  /* Retorno do hook */
  return {
    name,
    email,
    password,
    confirmPassword,
    fieldErrors,
    formError,
    successMessage,
    isSubmitting,
    handleSubmit,
    onFieldChange,
  }
}
