import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase admin/auth validator client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Setup S3 Client for Cloudflare R2
const r2Endpoint = process.env.R2_ENDPOINT || '';
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
const r2BucketName = process.env.R2_BUCKET_NAME || '';
const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: r2Endpoint,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate Request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing Authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid credentials or session expired' }, { status: 401 });
    }

    // 2. Parse Multipart Form Data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 3. Process File Upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique file key to prevent namespace collisions
    const uniqueId = Math.random().toString(36).substring(2, 11);
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `lands/${Date.now()}-${uniqueId}-${cleanFileName}`;

    await r2Client.send(new PutObjectCommand({
      Bucket: r2BucketName,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type || 'image/jpeg',
    }));

    // 4. Return Public Direct URL
    const publicUrl = `${r2PublicUrl.replace(/\/$/, '')}/${fileKey}`;

    return NextResponse.json({
      success: true,
      $id: fileKey, // Keep compatibility with existing code $id fields
      url: publicUrl,
      name: file.name
    });
  } catch (err: unknown) {
    console.error('Error uploading to Cloudflare R2:', err);
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'Internal Server Error' 
    }, { status: 500 });
  }
}
