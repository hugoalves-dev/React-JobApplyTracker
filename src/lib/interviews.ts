// Mirrors the legacy interview funnel statuses. Entering one only asks for
// confirmation: neither a status nor a scheduled flag proves attendance.
const INTERVIEW_STATUSES = new Set([
  'ENTREVISTA_MARCADA',
  'FIZ_A_RH_AGUARDANDO_ATUALIZACAO',
  'FIZ_A_HIRING_MANAGER_AGUARDANDO_ATUALIZACAO',
  'TESTE_TECNICO',
  'FIZ_TESTE_TECNICO_AGUARDANDO_ATUALIZACAO',
  'RH_NEGOCIACAO',
  'Pending HR Response',
  'Pending Hiring Manager Response',
  'Technical Test',
  'Pending Technical Test Response',
  'Offer Negotiation',
])

export function requiresInterviewConfirmation(previousStatus: string | null | undefined, nextStatus: string | null) {
  return nextStatus !== previousStatus && nextStatus !== null && INTERVIEW_STATUSES.has(nextStatus)
}
