import {randomBytes,scrypt,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
const derive=promisify(scrypt);
export async function hashPassword(password){const salt=randomBytes(16).toString('hex');const key=await derive(password,salt,64);return salt+':'+key.toString('hex');}
export async function checkPassword(password,stored){try{const [salt,key]=stored.split(':');const given=await derive(password,salt,64);const expected=Buffer.from(key,'hex');return expected.length===given.length&&timingSafeEqual(expected,given);}catch{return false;}}
export const hashToken=t=>createHash('sha256').update(t).digest('hex');
export const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(new Date(s).getTime())&&new Date(s).toISOString().slice(0,10)===s;
export function validSchedule(schedule,fee){return Array.isArray(schedule)&&schedule.length>0&&schedule.length<=12&&schedule.every(s=>validDate(s.date)&&Number.isSafeInteger(s.amount)&&s.amount>0)&&schedule.reduce((a,s)=>a+s.amount,0)===fee;}
