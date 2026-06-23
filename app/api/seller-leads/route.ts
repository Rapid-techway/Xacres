import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    const { name, phoneNumber, district, locationName, notes } = await req.json();

    // 1. Basic validation and abuse protection
    if (!name || !phoneNumber || !district || !locationName) {
      return NextResponse.json({ error: 'Missing required fields: name, phoneNumber, district, locationName' }, { status: 400 });
    }

    if (name.length > 150 || phoneNumber.length > 20 || district.length > 100 || locationName.length > 150) {
      return NextResponse.json({ error: 'Input constraints exceeded' }, { status: 400 });
    }

    // 2. Save lead to Supabase database (seller_leads table is publicly insertable)
    const { error: leadError } = await supabase
      .from('seller_leads')
      .insert({
        name: name,
        phone_number: phoneNumber,
        district: district,
        location_name: locationName,
        notes: notes || null
      });

    if (leadError) throw leadError;

    // 3. Trigger Telegram Bot Notification asynchronously
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      try {
        // Format HTML text safely
        const text = `🔔 <b>New Seller Lead on Xacres!</b>\n\n` +
          `👤 <b>Seller Name:</b> ${name}\n` +
          `📞 <b>Phone:</b> ${phoneNumber}\n` +
          `🏙️ <b>District:</b> ${district}\n` +
          `📍 <b>Location Detail:</b> ${locationName}\n` +
          `📝 <b>Seller Notes:</b> ${notes || 'No description provided'}`;

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        });
      } catch (tgErr) {
        // Log Telegram notification failure, but do not fail the HTTP request itself
        console.error('Failed to send Telegram notification:', tgErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Error processing seller lead submission:', err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Internal Server Error'
    }, { status: 500 });
  }
}
