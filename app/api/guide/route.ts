import { NextResponse } from "next/server";
import { g } from "@/lib/content";
const esc=(s:string)=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c] as string));
export async function POST(request:Request){
 let body:Record<string,unknown>;try{body=await request.json();}catch{return NextResponse.json({success:false,message:"Μη έγκυρα δεδομένα."},{status:400});}
 if(typeof body.website==="string"&&body.website.trim())return NextResponse.json({success:true});
 const email=typeof body.email==="string"?body.email.trim().toLowerCase():"";const name=typeof body.name==="string"?body.name.trim().slice(0,80):"";
 if(email.length>200||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return NextResponse.json({success:false,message:"Συμπλήρωσε έγκυρο email."},{status:400});
 const key=process.env.RESEND_API_KEY,from=process.env.MAIL_FROM,notify=process.env.NOTIFY_EMAIL||g.email;
 if(!key||!from)return NextResponse.json({success:false,message:"Η αποστολή email δεν έχει ρυθμιστεί ακόμη."},{status:503});
 const base=(process.env.SITE_URL||`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL||"mario-k-official.vercel.app"}`).replace(/\/+$/,"");const guideUrl=`${base}/odigos-mousikis-gamou?access=email`;
 try{const customer=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({from,to:email,subject:"Ο δωρεάν οδηγός μουσικής γάμου — MARIO K",html:`<p>Γεια σου ${esc(name||"και ευχαριστούμε")},</p><p>Ο οδηγός μουσικής γάμου είναι έτοιμος.</p><p><a href="${guideUrl}">Άνοιξε τον οδηγό και αποθήκευσέ τον ως PDF</a>.</p><p>Περιλαμβάνει ενδεικτικό χρονοδιάγραμμα και ερωτηματολόγιο μουσικής.</p><p>MARIO K</p>`}),cache:"no-store",signal:AbortSignal.timeout(8000)});if(!customer.ok)return NextResponse.json({success:false,message:"Δεν στάλθηκε το email. Δοκίμασε ξανά."},{status:502});
 if(notify)await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({from,to:notify,subject:"Νέα λήψη οδηγού μουσικής γάμου",html:`<p>Νέα εγγραφή για τον οδηγό γάμου.</p><p><b>Όνομα:</b> ${esc(name||"Δεν δηλώθηκε")}</p><p><b>Email:</b> ${esc(email)}</p>`}),cache:"no-store",signal:AbortSignal.timeout(8000)}).catch(()=>{});
 return NextResponse.json({success:true});}catch{return NextResponse.json({success:false,message:"Η αποστολή απέτυχε. Δοκίμασε ξανά."},{status:502});}
}
