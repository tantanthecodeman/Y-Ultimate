import  {NextResponse} from 'next/server';
import  { supabase} from '@/lib/supabaseClients';

export async function POST(request: Request){
  try{
    const body= await request.json();
    const {tournament_id, name , captain_profile_id}=body;
    if(!tournament_id || !name){
      return NextResponse.json({error: 'missing tournament_id or name'}, {status:400});
    }

    const {data, error}= await supabase
    .from('teams')
      .insert([{ tournament_id, name, captain_profile_id }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ team: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });

  }
}