import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const ADMIN_SECRET_PIN = process.env.ADMIN_PIN || '8899';

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

// POST a new product (Multiple images & stock supported)
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, price, description, images, in_stock, stock_quantity, pin } = body;

    if (pin !== ADMIN_SECRET_PIN) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin PIN' }, { status: 401 });
    }

    const firstImage = images && images.length > 0 ? images[0] : '';

    const { data, error } = await supabase
      .from('products')
      .insert([{
        title,
        category,
        price: Number(price),
        description,
        image_url: firstImage,
        images: images || [],
        in_stock: in_stock ?? true,
        stock_quantity: Number(stock_quantity) || 1
      }])
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, product: data[0] }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE a product
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
