import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=process.cwd(), web=path.join(root,'apps/web');
const state={bots:[{id:'atlas-01',name:'Atlas Bot',type:'WhatsApp Bot',prefix:'.',developer:'Lyan',website:'https://example.com',description:'Tu asistente inteligente para WhatsApp.',status:'connected',commands:42,createdAt:'2026-09-18T12:00:00Z',stats:{messages:1294,executed:438,users:183,groups:24,uptime:'4h 32m'}}], logs:[{time:'03:21:44',level:'INFO',message:'Bot conectado'},{time:'03:22:01',level:'COMMAND',message:'.menu'},{time:'03:22:10',level:'COMMAND',message:'.chatgpt'},{time:'03:22:11',level:'INFO',message:'Respuesta enviada'}]};
const json=(res,data,status=200)=>{res.writeHead(status,{'content-type':'application/json','access-control-allow-origin':'*'});res.end(JSON.stringify(data));};
const body=req=>new Promise(resolve=>{let s='';req.on('data',x=>s+=x);req.on('end',()=>{try{resolve(s?JSON.parse(s):{})}catch{resolve({})}})});
function sendFile(res,file){if(!existsSync(file))return json(res,{error:'Not found'},404); const ext=path.extname(file);res.writeHead(200,{'content-type':ext==='.html'?'text/html':'text/css'});readFile(file).then(x=>res.end(x));}
const server=http.createServer(async(req,res)=>{const u=new URL(req.url,`http://${req.headers.host}`), p=u.pathname;
 if(req.method==='OPTIONS'){res.writeHead(204);return res.end()}
 if(p.startsWith('/api/')){let m=p.match(/^\/api\/bots(?:\/([^/]+))?(?:\/(.*))?$/), id=m?.[1], tail=m?.[2];
  if(req.method==='GET'&&p==='/api/bots')return json(res,state.bots);
  if(req.method==='POST'&&p==='/api/bots'){const b=await body(req);if(!b.name||!b.prefix)return json(res,{error:'name and prefix required'},422);const bot={id:crypto.randomUUID(),...b,type:b.type||'WhatsApp Bot',status:'disconnected',commands:0,createdAt:new Date().toISOString()};state.bots.push(bot);return json(res,bot,201)}
  const bot=state.bots.find(x=>x.id===id);if(!bot)return json(res,{error:'Bot not found'},404);
  if(req.method==='GET'&&!tail)return json(res,bot);
  if(req.method==='PATCH'&&!tail){Object.assign(bot,await body(req));return json(res,bot)}
  if(req.method==='POST'&&tail==='connect'){bot.status='waiting_qr';return json(res,{status:bot.status,message:'Real provider connection required'})}
  if(req.method==='POST'&&tail==='disconnect'){bot.status='disconnected';return json(res,bot)}
  if(req.method==='GET'&&tail==='status')return json(res,{status:bot.status});
  if(req.method==='GET'&&tail==='logs')return json(res,state.logs);
  if(req.method==='GET'&&tail==='stats')return json(res,bot.stats||{messages:0,executed:0,users:0,groups:0,uptime:'—'});
  if(req.method==='GET'&&tail==='menu')return json(res,{template:'default',preview:buildMenu(bot)});
  return json(res,{error:'Route not found'},404);
 }
 if(p==='/')return sendFile(res,path.join(web,'index.html')); return sendFile(res,path.join(web,p.replace(/^\//,'')));
});
function buildMenu(b){return `─── 𝐇ᴏʟᴀ!, sᴏʏ ${b.name} (${b.type}) ───\n\n✎ ᴀǫᴜɪ ᴛɪᴇɴᴇs ʟᴀ ʟɪsᴛᴀ ᴅᴇ ʟᴏs ᴄᴏᴍᴀɴᴅᴏs\n\n༉‧₊˚. │ 𝐄ɴʟᴀᴄᴇ ❚❙\n${b.website||'—'}\n\n༉‧₊˚. │𝐃ᴇᴠᴇʟᴏᴘᴇʀ ❚❙\n${b.developer||'—'}\n\n«ᴄᴏɴᴇᴄᴛᴀᴛᴇ ᴄᴏᴍᴏ sᴜʙ-ʙᴏᴛ»\n\n${b.prefix}menu  ·  ${b.prefix}help`}
server.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log(`Mikasa running on http://0.0.0.0:${process.env.PORT||3000}`));
