/*
  Perfis confirmados hoje no banco, vindos do projeto anterior:
  admin, secretaria, profissional_saude, super_admin

  Perfis novos, ainda nao criados no banco, que fazem parte do
  desenho de permissoes que fechamos: financeiro, contabilidade,
  diretor_tecnico, secretaria_virtual

  Assim que o resultado da consulta de schema confirmar os valores
  reais do enum app_role no banco, ajusta essa lista para bater
  exatamente com o que existe, sem inventar nome diferente do
  banco.
*/
export type PerfilUsuario =
  | 'admin'
  | 'secretaria'
  | 'profissional_saude'
  | 'super_admin'
  | 'diretor_tecnico'
  | 'financeiro'
  | 'contabilidade'
  | 'secretaria_virtual'

export interface PapelDoUsuario {
  userId: string
  clinicId: string | null
  perfil: PerfilUsuario
  ativo: boolean
}
