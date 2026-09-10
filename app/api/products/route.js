import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const ADMIN_SECRET_PIN = process.env.ADMIN_PIN || '8899'; // Set your PIN in Vercel or default to 8899

// GET all products (Public)
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

// POST a new product (Protected)
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, price, description, image_url, pin } = body;

    if (pin !== ADMIN_SECRET_PIN) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin PIN' }, { status: 401 });
    }

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

// DELETE a product (Protected)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const pin = searchParams.get('pin');

    if (pin !== ADMIN_SECRET_PIN) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin PIN' }, { status: 401 });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
