import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const ADMIN_SECRET_PIN = process.env.ADMIN_PIN || '8899';
const ADMIN_SECRET_PASS = process.env.ADMIN_PASSWORD || 'Gomatha@2026';

function isAuthorized(key) {
  return key === ADMIN_SECRET_PIN || key === ADMIN_SECRET_PASS;
}

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
    const { title, category, price, description, images, in_stock, stock_quantity, pin, password } = body;
    const userAuthKey = pin || password;

    if (!isAuthorized(userAuthKey)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin Password or PIN' }, { status: 401 });
    }

    const firstImage = images && images.length > 0 ? images[0] : '';

    const { data, error } = await supabase
      .from('products')
      .insert([{
        title,
        category: category || 'Sarees',
        price: Number(price),
        description: description || '',
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

// PUT edit/update an existing product
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, category, price, description, in_stock, stock_quantity, pin, password } = body;
    const userAuthKey = pin || password;

    if (!isAuthorized(userAuthKey)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin Password or PIN' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        title,
        category,
        price: Number(price),
        description: description || '',
        in_stock: Boolean(in_stock),
        stock_quantity: Number(stock_quantity),
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, product: data[0] }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userAuthKey = searchParams.get('pin') || searchParams.get('password');

    if (!isAuthorized(userAuthKey)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin Password or PIN' }, { status: 401 });
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
