import { NextResponse } from "next/server";
import { g } from "@/lib/content";
const esc=(s:string)=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c] as string));
export async function POST(request:Request){
 let body:Record<string,unknown>;try{body=await request.json();}catch{return NextResponse.json({success:false,message:"Μη έγκυρα δεδομένα."},{status:400});}
 if(typeof body.website==="string"&&body.website.trim())return NextResponse.json({success:true});
 const phone=typeof body.phone==="string"?body.phone.trim():"";const name=typeof body.name==="string"?body.name.trim().slice(0,80):"";const time=typeof body.time==="string"?body.time:"";
 const times=["10:00–12:00","12:00–14:00","14:00–16:00","16:00–18:00","18:00–20:00","20:00–21:00"];
 if(phone.length>30||(phone.match(/\d/g)||[]).length<7||!/^[+\d\s().-]+$/.test(phone)||!times.includes(time))return NextResponse.json({success:false,message:"Έλεγξε το τηλέφωνο και την ώρα επικοινωνίας."},{status:400});
 const key=process.env.RESEND_API_KEY,from=process.env.MAIL_FROM,to=process.env.NOTIFY_EMAIL||g.email;
 if(!key||!from||!to)return NextResponse.json({success:false,message:"Η υπηρεσία αιτημάτων κλήσης δεν έχει ρυθμιστεί ακόμη."},{status:503});
 try{const r=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({from,to,subject:`Νέο αίτημα «Καλέστε με» — ${phone}`,html:`<h2>Αίτημα τηλεφωνικής επικοινωνίας — MARIO K</h2><p><b>Τηλέφωνο:</b> ${esc(phone)}</p><p><b>Όνομα:</b> ${esc(name||"Δεν δηλώθηκε")}</p><p><b>Επιθυμητή ώρα:</b> ${esc(time)}</p><p>Πηγή: MARIO K Official</p>`}),cache:"no-store",signal:AbortSignal.timeout(8000)});if(!r.ok)return NextResponse.json({success:false,message:"Δεν στάλθηκε το αίτημα. Δοκίμασε ξανά ή κάλεσε απευθείας."},{status:502});return NextResponse.json({success:true});}catch{return NextResponse.json({success:false,message:"Η αποστολή απέτυχε. Δοκίμασε ξανά."},{status:502});}
}
