import { DeclarationStatus, DraftCancellationStatus } from '@prisma/client';

export type FsmState = DeclarationStatus;
export type FsmEvent =
  | 'SUBMIT'
  | 'TRIGGER_MATCHING'
  | 'MATCH_FOUND'
  | 'ASSIGN_TO_AGENT'
  | 'VALIDATE'
  | 'REJECT'
  | 'SUSPEND'
  | 'RESUME'
  | 'CONTEST'
  | 'PLAN_RESTITUTION'
  | 'COMPLETE_RESTITUTION'
  | 'NO_MATCH'
  | 'EXPIRE_SUBMISSION'
  | 'EXPIRE_ARCHIVE'
  | 'PURGE'
  | 'CANCEL_DRAFT';

export interface FsmTransition {
  from: FsmState;
  event: FsmEvent;
  to: FsmState;
  allowedRoles: string[];
  requiresHumanValidation: boolean;
}

export const FSM_TRANSITIONS: FsmTransition[] = [
  { from: 'BROUILLON', event: 'SUBMIT', to: 'SOUMISE', allowedRoles: ['CITIZEN'], requiresHumanValidation: false },
  { from: 'BROUILLON', event: 'CANCEL_DRAFT', to: 'BROUILLON', allowedRoles: ['CITIZEN'], requiresHumanValidation: false },
  { from: 'SOUMISE', event: 'TRIGGER_MATCHING', to: 'EN_ATTENTE_RAPPROCHEMENT', allowedRoles: ['SYSTEM'], requiresHumanValidation: false },
  { from: 'SOUMISE', event: 'EXPIRE_SUBMISSION', to: 'EXPIREE', allowedRoles: ['SYSTEM'], requiresHumanValidation: false },
  { from: 'EN_ATTENTE_RAPPROCHEMENT', event: 'MATCH_FOUND', to: 'CORRESPONDANCE_TROUVEE', allowedRoles: ['SYSTEM'], requiresHumanValidation: false },
  { from: 'EN_ATTENTE_RAPPROCHEMENT', event: 'NO_MATCH', to: 'EN_ATTENTE_RAPPROCHEMENT', allowedRoles: ['SYSTEM'], requiresHumanValidation: false },
  { from: 'EN_ATTENTE_RAPPROCHEMENT', event: 'EXPIRE_SUBMISSION', to: 'EXPIREE', allowedRoles: ['SYSTEM'], requiresHumanValidation: false },
  { from: 'CORRESPONDANCE_TROUVEE', event: 'ASSIGN_TO_AGENT', to: 'EN_VALIDATION_HUMAINE', allowedRoles: ['AGENT', 'CENTER_MANAGER'], requiresHumanValidation: true },
  { from: 'EN_VALIDATION_HUMAINE', event: 'VALIDATE', to: 'VALIDEE', allowedRoles: ['AGENT', 'CENTER_MANAGER'], requiresHumanValidation: true },
  { from: 'EN_VALIDATION_HUMAINE', event: 'REJECT', to: 'REJETEE', allowedRoles: ['AGENT', 'CENTER_MANAGER'], requiresHumanValidation: true },
  { from: 'EN_VALIDATION_HUMAINE', event: 'SUSPEND', to: 'SUSPENDUE', allowedRoles: ['AGENT', 'CENTER_MANAGER'], requiresHumanValidation: true },
  { from: 'EN_VALIDATION_HUMAINE', event: 'CONTEST', to: 'CONTESTEE', allowedRoles: ['AGENT', 'CENTER_MANAGER', 'CITIZEN'], requiresHumanValidation: true },
  { from: 'EN_VALIDATION_HUMAINE', event: 'REJECT', to: 'REJETEE', allowedRoles: ['AUDITOR'], requiresHumanValidation: false },
  { from: 'SUSPENDUE', event: 'RESUME', to: 'CORRESPONDANCE_TROUVEE', allowedRoles: ['AUDITOR'], requiresHumanValidation: false },
  { from: 'SUSPENDUE', event: 'REJECT', to: 'REJETEE', allowedRoles: ['AUDITOR'], requiresHumanValidation: false },
  { from: 'CONTESTEE', event: 'ASSIGN_TO_AGENT', to: 'EN_VALIDATION_HUMAINE', allowedRoles: ['AGENT', 'CENTER_MANAGER'], requiresHumanValidation: false },
  { from: 'VALIDEE', event: 'PLAN_RESTITUTION', to: 'RESTITUTION_PLANIFIEE', allowedRoles: ['AGENT', 'CENTER_MANAGER'], requiresHumanValidation: false },
  { from: 'RESTITUTION_PLANIFIEE', event: 'COMPLETE_RESTITUTION', to: 'RESTITUEE', allowedRoles: ['AGENT', 'CENTER_MANAGER'], requiresHumanValidation: true },
  { from: 'RESTITUTION_PLANIFIEE', event: 'SUSPEND', to: 'SUSPENDUE', allowedRoles: ['AGENT', 'CENTER_MANAGER'], requiresHumanValidation: true },
  { from: 'RESTITUEE', event: 'EXPIRE_ARCHIVE', to: 'CLOTUREE', allowedRoles: ['SYSTEM'], requiresHumanValidation: false },
  { from: 'REJETEE', event: 'EXPIRE_ARCHIVE', to: 'ARCHIVEE', allowedRoles: ['SYSTEM'], requiresHumanValidation: false },
  { from: 'EXPIREE', event: 'EXPIRE_ARCHIVE', to: 'ARCHIVEE', allowedRoles: ['SYSTEM'], requiresHumanValidation: false },
];

export function isTerminal(state: FsmState): boolean {
  return state === 'CLOTUREE' || state === 'ARCHIVEE';
}

export function canTransition(
  currentState: FsmState,
  event: FsmEvent,
  userRole: string
): FsmTransition | null {
  return (
    FSM_TRANSITIONS.find(
      (t) => t.from === currentState && t.event === event && t.allowedRoles.includes(userRole)
    ) ?? null
  );
}

export function getAvailableTransitions(state: FsmState, userRole: string): FsmTransition[] {
  return FSM_TRANSITIONS.filter((t) => t.from === state && t.allowedRoles.includes(userRole));
}

export function isValidDraftCancellation(status: DraftCancellationStatus): boolean {
  return status === DraftCancellationStatus.ACTIVE;
}

export const TERMINAL_STATES: FsmState[] = ['CLOTUREE', 'ARCHIVEE'];
export const FINAL_STATES: FsmState[] = [...TERMINAL_STATES, 'REJETEE', 'EXPIREE'];
