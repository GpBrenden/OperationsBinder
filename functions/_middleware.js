import {jwtVerify,createRemoteJWKSet} from 'jose';
const keys=new Map();
export function roleFor(email,env){const list=s=>(s||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);if(list(env.ADMIN_EMAILS).includes(email))return 'admin';if(list(env.EDITOR_EMAILS).includes(email))return 'editor';return 'employee';}
export async function onRequest(context){const {env,request}=context;
 const reply=(error,status)=>new Response(JSON.stringify({error}),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
 if(!env.ACCESS_TEAM_DOMAIN||!env.ACCESS_AUD)return reply('Cloudflare Access has not been configured.',503);
 const issuer=env.ACCESS_TEAM_DOMAIN.replace(/\/$/,'');if(!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(issuer))return reply('Invalid Access configuration.',503);
 const token=request.headers.get('Cf-Access-Jwt-Assertion');if(!token)return reply('Sign-in is required.',401);
 try{if(!keys.has(issuer))keys.set(issuer,createRemoteJWKSet(new URL(issuer+'/cdn-cgi/access/certs')));const {payload}=await jwtVerify(token,keys.get(issuer),{issuer,audience:env.ACCESS_AUD,algorithms:['RS256']});if(typeof payload.sub!=='string'||typeof payload.email!=='string'||!payload.exp)throw Error();const email=payload.email.toLowerCase();context.data.user={id:payload.sub,email,role:roleFor(email,env)};}catch{return reply('Your sign-in could not be verified. Sign in again.',401);}
 if(!['GET','HEAD','OPTIONS'].includes(request.method)&&new URL(request.url).pathname.startsWith('/api/')){if(request.headers.get('Origin')!==new URL(request.url).origin)return reply('Request origin rejected.',403);if(!request.headers.get('Content-Type')?.startsWith('application/json'))return reply('JSON is required.',415);}
 const response=await context.next();const headers=new Headers(response.headers);headers.set('X-Content-Type-Options','nosniff');headers.set('Referrer-Policy','same-origin');headers.set('Cache-Control','private, no-store');return new Response(response.body,{status:response.status,headers});
}
