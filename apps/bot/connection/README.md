# WhatsApp connection boundary

Implementar aquí el adaptador `WhatsAppProvider` (`connectQr`, `requestPairingCode`, `disconnect`, `getStatus`). El API nunca debe importar SDKs en frontend. Persistir credenciales únicamente mediante un secret store/cifrado y emitir eventos al Bot Manager.