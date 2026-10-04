export interface BotStats {
  id: string;
  botId: string;
  messagesReceived: number;
  commandsExecuted: number;
  uniqueUsers: number;
  uniqueGroups: number;
  uptimeSeconds: number;
  errorsCount: number;
  lastMessageAt?: string | null;
  connectedAt?: string | null;
  history?: {
    hour: string;
    messages: number;
    commands: number;
  }[];
  topCommands?: {
    name: string;
    count: number;
  }[];
  updatedAt: string;
}
