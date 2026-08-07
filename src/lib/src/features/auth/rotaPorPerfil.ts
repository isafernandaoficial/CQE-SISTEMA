import type { PerfilUsuario } from './types/perfil'

/*
  Decide so a rota, nada mais. Nao busca nome, e-mail nem lista de
  equipe aqui. Isso mantem a separacao que corrigimos: o super
  administrador nunca passa pela mesma tela nem pelo mesmo caminho
  de dado que o administrador do consultorio.
*/
export function rotaPorPerfil(perfil: PerfilUsuario | null): string {
  switch (perfil) {
    case 'super_admin':
      return '/plataforma/clinicas'
    case 'admin':
    case 'diretor_tecnico':
      return '/consultorio/equipe'
    case 'profissional_saude':
      return '/consultorio/agenda'
    case 'financeiro':
    case 'contabilidade':
      return '/consultorio/financeiro'
    case 'secretaria':
      return '/consultorio/recepcao'
    case 'secretaria_virtual':
      return '/consultorio/agenda'
    default:
      return '/acesso'
  }
}
