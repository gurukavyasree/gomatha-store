import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET all products
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST a new product
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, price, description, image_url } = body;

    const { data, error } = await supabase
      .from('products')
      .insert([{ title, category, price: Number(price), description, image_url }])
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, product: data[0] }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
