export const DEFAULT_AESTHETIC_MENU_HEADER = `─── ׁ ׅ  𝐇ᴏʟᴀ!, sᴏʏ {{bot.name}} ({{bot.type}}) . 𐔌՞ ܸ.ˬ.ܸ՞𐦯
✎ ᴀᴏ̨ᴜɪ ᴛɪᴇɴᴇs ʟᴀ ʟɪsᴛᴀ ᴅᴇ ʟᴏs ᴄᴏᴍᴀɴᴅᴏs

︵𝆣᷼ ͡︵᷼𝆣 ᷼͡︵᷼𝆣 ᷼͡︵ ᅟິᅟᅟ︵𝆣᷼ ͡︵᷼𝆣 ᷼͡︵᷼𝆣 ᷼͡︵

༉‧₊˚. │ 𝐄ɴʟᴀᴄᴇ ❚❙  ⋆˚꩜｡
{{bot.website}}
──

༉‧₊˚. │𝐃ᴇᴠᴇʟᴏᴘᴇʀ ❚❙  ⋆˚꩜｡
{{bot.developer}}
──

ᅟᅟ︶͜︶͜︶ᅟᅟ֪ᅟ֪ᅟᅟ︶͜︶͜︶

«ᴄᴏɴᴇᴄᴛᴀᴛᴇ ᴄᴏᴍᴏ sᴜʙ-ʙᴏᴛ ᴇɴ ɴᴜᴇsᴛʀᴀ ᴡᴇʙ ᴏғɪᴄɪᴀʟ ✎ {{bot.website}}»

{{categories}}`;

export const DEFAULT_CATEGORY_TEMPLATES: Record<
  string,
  { symbol: string; headerSymbol: string; defaultDescription: string }
> = {
  Anime: {
    symbol: '❀ ૮₍ ˃̵͈᷄ . ฅ ₎ა   ݁',
    headerSymbol: '- ≽ ^⎚ ˕ ⎚^ ≼',
    defaultDescription: 'ᴄᴏᴍᴀɴᴅᴏs ᴅᴇ ʀᴇᴀᴄᴄɪᴏɴᴇs ᴅᴇ ᴀɴɪᴍᴇ.',
  },
  IA: {
    symbol: '❀  ₍ᐢ.  ̫.ᐢ₎    ݁',
    headerSymbol: '•  ≽(˵◝ ⩊  ◜˵ マ≼',
    defaultDescription: 'ʜᴀʙʟᴀ ᴄᴏɴ ɪɴᴛᴇʟɪɢᴇɴᴄɪᴀ ᴀʀᴛɪғɪᴄɪᴀʟ',
  },
  Juegos: {
    symbol: '❀  ₍ᐢ.  ̫.ᐢ₎    ݁',
    headerSymbol: '✦ ≽ 🎮 ≼',
    defaultDescription: 'ᴍɪɴɪᴊᴜᴇɢᴏs ʏ ᴅɪᴠᴇʀsɪᴏ́ɴ ᴇɴ ɢʀᴜᴘᴏs',
  },
  Descargas: {
    symbol: '❀  ₍ᐢ.  ̫.ᐢ₎    ݁',
    headerSymbol: '✦ ≽ 📥 ≼',
    defaultDescription: 'ᴅᴇsᴄᴀʀɢᴀ ᴍᴜ́sɪᴄᴀ, ᴠɪᴅᴇᴏs ʏ ᴍᴇᴅɪᴀ',
  },
  Stickers: {
    symbol: '❀  ₍ᐢ.  ̫.ᐢ₎    ݁',
    headerSymbol: '✦ ≽ 🖼️ ≼',
    defaultDescription: 'ᴄʀᴇᴀᴄɪᴏ́ɴ ʏ ᴇᴅɪᴄɪᴏ́ɴ ᴅᴇ sᴛɪᴄᴋᴇʀs',
  },
  Moderación: {
    symbol: '❀  ₍ᐢ.  ̫.ᐢ₎    ݁',
    headerSymbol: '✦ ≽ 🛡️ ≼',
    defaultDescription: 'ʜᴇʀʀᴀᴍɪᴇɴᴛᴀs ᴅᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴄɪᴏ́ɴ',
  },
  Herramientas: {
    symbol: '❀  ₍ᐢ.  ̫.ᐢ₎    ݁',
    headerSymbol: '✦ ≽ 🛠️ ≼',
    defaultDescription: 'ᴜᴛɪʟɪᴅᴀᴅᴇs ʏ sᴇʀᴠɪᴄɪᴏs ɢᴇɴᴇʀᴀʟᴇs',
  },
  Owner: {
    symbol: '❀  ₍ᐢ.  ̫.ᐢ₎    ݁',
    headerSymbol: '✦ ≽ 👑 ≼',
    defaultDescription: 'ᴄᴏᴍᴀɴᴅᴏs ᴇxᴄʟᴜsɪᴠᴏs ᴅᴇʟ ᴄʀᴇᴀᴅᴏʀ',
  },
  Información: {
    symbol: '❀  ₍ᐢ.  ̫.ᐢ₎    ݁',
    headerSymbol: '✦ ≽ ℹ️ ≼',
    defaultDescription: 'ɪɴғᴏʀᴍᴀᴄɪᴏ́ɴ ʏ ᴇsᴛᴀᴅᴏ ᴅᴇʟ sɪsᴛᴇᴍᴀ',
  },
};

export const DEFAULT_CATEGORIES = [
  { name: 'Anime', icon: 'Sparkles', symbol: '- ≽ ^⎚ ˕ ⎚^ ≼', description: 'ᴄᴏᴍᴀɴᴅᴏs ᴅᴇ ʀᴇᴀᴄᴄɪᴏɴᴇs ᴅᴇ ᴀɴɪᴍᴇ.', order: 1 },
  { name: 'IA', icon: 'Bot', symbol: '•  ≽(˵◝ ⩊  ◜˵ マ≼', description: 'ʜᴀʙʟᴀ ᴄᴏɴ ɪɴᴛᴇʟɪɢᴇɴᴄɪᴀ ᴀʀᴛɪғɪᴄɪᴀʟ', order: 2 },
  { name: 'Juegos', icon: 'Gamepad2', symbol: '✦ ≽ 🎮 ≼', description: 'ᴍɪɴɪᴊᴜᴇɢᴏs ʏ ᴅɪᴠᴇʀsɪᴏ́ɴ ᴇɴ ɢʀᴜᴘᴏs', order: 3 },
  { name: 'Descargas', icon: 'Download', symbol: '✦ ≽ 📥 ≼', description: 'ᴅᴇsᴄᴀʀɢᴀ ᴍᴜ́sɪᴄᴀ, ᴠɪᴅᴇᴏs ʏ ᴍᴇᴅɪᴀ', order: 4 },
  { name: 'Stickers', icon: 'Smile', symbol: '✦ ≽ 🖼️ ≼', description: 'ᴄʀᴇᴀᴄɪᴏ́ɴ ʏ ᴇᴅɪᴄɪᴏ́ɴ ᴅᴇ sᴛɪᴄᴋᴇʀs', order: 5 },
  { name: 'Moderación', icon: 'Shield', symbol: '✦ ≽ 🛡️ ≼', description: 'ʜᴇʀʀᴀᴍɪᴇɴᴛᴀs ᴅᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴄɪᴏ́ɴ', order: 6 },
  { name: 'Herramientas', icon: 'Wrench', symbol: '✦ ≽ 🛠️ ≼', description: 'ᴜᴛɪʟɪᴅᴀᴅᴇs ʏ sᴇʀᴠɪᴄɪᴏs ɢᴇɴᴇʀᴀʟᴇs', order: 7 },
  { name: 'Información', icon: 'Info', symbol: '✦ ≽ ℹ️ ≼', description: 'ɪɴғᴏʀᴍᴀᴄɪᴏ́ɴ ʏ ᴇsᴛᴀᴅᴏ ᴅᴇʟ sɪsᴛᴇᴍᴀ', order: 8 },
];

export const DEFAULT_INITIAL_COMMANDS = [
  {
    name: 'menu',
    aliases: ['help', 'comandos', 'panel'],
    categoryName: 'Información',
    description: 'Muestra la lista de comandos y categorías disponibles',
    usage: '{{bot.prefix}}menu',
    response: 'AUTO_GENERATED_MENU',
    enabled: true,
    permissions: { allowPrivate: true, allowGroup: true, adminOnly: false, ownerOnly: false },
  },
  {
    name: 'ping',
    aliases: ['p', 'latencia'],
    categoryName: 'Información',
    description: 'Verifica la velocidad de respuesta del bot',
    usage: '{{bot.prefix}}ping',
    response: '🏓 ¡Pong!\n⚡ Velocidad de respuesta: {{latency}}ms\n⏱️ Uptime: {{uptime}}',
    enabled: true,
    permissions: { allowPrivate: true, allowGroup: true, adminOnly: false, ownerOnly: false },
  },
  {
    name: 'chatgpt',
    aliases: ['gpt', 'ia'],
    categoryName: 'IA',
    description: 'Habla con ChatGPT',
    usage: '{{bot.prefix}}chatgpt <pregunta>',
    response: '🤖 *Respuesta de ChatGPT para {{user.name}}:*\n\n{{respuesta}}',
    enabled: true,
    permissions: { allowPrivate: true, allowGroup: true, adminOnly: false, ownerOnly: false },
  },
  {
    name: 'gemini',
    aliases: ['gem', 'bard'],
    categoryName: 'IA',
    description: 'Habla con Gemini',
    usage: '{{bot.prefix}}gemini <consulta>',
    response: '✨ *Gemini AI:*\n\n{{respuesta}}',
    enabled: true,
    permissions: { allowPrivate: true, allowGroup: true, adminOnly: false, ownerOnly: false },
  },
  {
    name: 'imagine',
    aliases: ['dalle', 'genimg'],
    categoryName: 'IA',
    description: 'Crea una imagen hecha por la IA',
    usage: '{{bot.prefix}}imagine <prompt>',
    response: '🎨 Generando imagen para: "{{args}}"...',
    enabled: true,
    permissions: { allowPrivate: true, allowGroup: true, adminOnly: false, ownerOnly: false },
  },
  {
    name: 'peek',
    aliases: ['espiar', 'mirar'],
    categoryName: 'Anime',
    description: 'Espiar a alguien.',
    usage: '{{bot.prefix}}peek + <mention>',
    response: '❀ ૮₍ ˃̵͈᷄ . ฅ ₎ა {{user.name}} está espiando a {{mention}} discretamente...',
    enabled: true,
    permissions: { allowPrivate: false, allowGroup: true, adminOnly: false, ownerOnly: false },
  },
  {
    name: 'hug',
    aliases: ['abrazar', 'abrazo'],
    categoryName: 'Anime',
    description: 'Dar un abrazo cálido a alguien',
    usage: '{{bot.prefix}}hug @usuario',
    response: '🫂 {{user.name}} le ha dado un gran abrazo a {{mention}} (つ✧ω✧)つ',
    enabled: true,
    permissions: { allowPrivate: false, allowGroup: true, adminOnly: false, ownerOnly: false },
  },
  {
    name: 'kiss',
    aliases: ['besar', 'beso'],
    categoryName: 'Anime',
    description: 'Darle un beso a alguien',
    usage: '{{bot.prefix}}kiss @usuario',
    response: '💋 {{user.name}} le ha dado un tierno beso a {{mention}} (*♡∀♡)',
    enabled: true,
    permissions: { allowPrivate: false, allowGroup: true, adminOnly: false, ownerOnly: false },
  },
  {
    name: 'sticker',
    aliases: ['s', 'stk'],
    categoryName: 'Stickers',
    description: 'Convierte una imagen o video corto en sticker',
    usage: '{{bot.prefix}}sticker (responde a una foto)',
    response: '✨ ¡Sticker creado con éxito por {{bot.name}}!',
    enabled: true,
    permissions: { allowPrivate: true, allowGroup: true, adminOnly: false, ownerOnly: false },
  },
  {
    name: 'tagall',
    aliases: ['todos', 'mencionartodos'],
    categoryName: 'Moderación',
    description: 'Menciona a todos los miembros de un grupo',
    usage: '{{bot.prefix}}tagall <mensaje>',
    response: '📢 *ATENCIÓN GRUPO*\n{{args}}\n\n{{group.mentions}}',
    enabled: true,
    permissions: { allowPrivate: false, allowGroup: true, adminOnly: true, ownerOnly: false },
  },
];
