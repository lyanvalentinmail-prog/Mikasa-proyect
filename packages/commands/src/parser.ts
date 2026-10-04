export interface ParsedMessage {
  isCommand: boolean;
  prefix: string;
  commandName: string;
  args: string[];
  rawArgs: string;
  body: string;
}

export function parseMessage(text: string, prefix: string): ParsedMessage {
  const trimmed = text.trim();
  if (!trimmed.startsWith(prefix)) {
    return {
      isCommand: false,
      prefix,
      commandName: '',
      args: [],
      rawArgs: '',
      body: trimmed,
    };
  }

  const withoutPrefix = trimmed.slice(prefix.length).trim();
  const parts = withoutPrefix.split(/\s+/);
  const commandName = parts[0]?.toLowerCase() || '';
  const args = parts.slice(1);
  const rawArgs = withoutPrefix.slice(commandName.length).trim();

  return {
    isCommand: commandName.length > 0,
    prefix,
    commandName,
    args,
    rawArgs,
    body: trimmed,
  };
}
