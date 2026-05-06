import type { UserRole } from './auth'
import { apiFetch, formatApiError } from './client'

/* Tipo de dado para o payload de registro de usuário. */
export type RegisterPayload = {
  name: string
  email: string
  password: string
}

/* Tipo de dado para o payload de atualização de usuário. */
export type UpdateUserPayload = {
  name?: string
  email?: string
  password?: string
  role?: UserRole
}

/* Tipo de dado para o sucesso do registro de usuário. */
export type UserSuccess = {
  id: number
  name: string
  email: string
  role: UserRole
  dataCriacao: string
}

/* Função para registrar um novo usuário. */
export async function registerUser(
  payload: RegisterPayload,
): Promise<UserSuccess> {
  /* Faz o fetch para o endpoint de registro de usuário. */
  const res = await apiFetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
/* Tenta converter a resposta para JSON. Se não conseguir, retorna um objeto vazio. */
  const data: unknown = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(
      formatApiError(data as { message?: string | string[] }),
    )
  }
/* Converte a resposta para o tipo UserSuccess. */
  return data as UserSuccess
}

/* Função para atualizar um usuário. */
export async function updateUser(
  userId: number,
  payload: UpdateUserPayload,
): Promise<UserSuccess> {
  /* Faz o fetch para o endpoint de atualização de usuário. */
  const res = await apiFetch(`/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data: unknown = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(
      formatApiError(data as { message?: string | string[] }),
    )
  }
/* Converte a resposta para o tipo UserSuccess. */
  return data as UserSuccess
}

/* Função para deletar um usuário. */
export async function deleteUser(userId: number): Promise<void> {
  const res = await apiFetch(`/users/${userId}`, {
    method: 'DELETE',
  })
  if (!res.ok && res.status !== 204) {
    const data: unknown = await res.json().catch(() => ({}))
    /* Converte a resposta para o tipo RegisterSuccess. */
    throw new Error(formatApiError(data as { message?: string | string[] }))
  }
}
