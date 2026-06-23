import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    const { landId, name, phoneNumber, buyerDistrict, purchasePurpose, interestedDistrict } = await req.json();

    // 1. Basic validation and abuse protection
    if (!landId || !name || !phoneNumber || !buyerDistrict || !purchasePurpose || !interestedDistrict) {
      return NextResponse.json({ error: 'Missing required fields: landId, name, phoneNumber, buyerDistrict, purchasePurpose, interestedDistrict' }, { status: 400 });
    }

    if (name.length > 100 || phoneNumber.length > 25 || buyerDistrict.length > 100 || purchasePurpose.length > 150 || interestedDistrict.length > 100) {
      return NextResponse.json({ error: 'Input constraints exceeded' }, { status: 400 });
    }

    // 2. Fetch land details to verify it exists and to format Telegram message
    const { data: land, error: landError } = await supabase
      .from('lands')
      .select('title, slug, district, village, area_acres, listed_price')
      .eq('id', landId)
      .maybeSingle();

    if (landError || !land) {
      return NextResponse.json({ error: 'Property not found or invalid ID' }, { status: 404 });
    }

    // 3. Save lead to Supabase database (leads table is publicly insertable)
    const { error: leadError } = await supabase
      .from('buyer_leads')
      .insert({
        land_id: landId,
        name: name,
        phone_number: phoneNumber,
        buyer_district: buyerDistrict,
        purchase_purpose: purchasePurpose,
        interested_district: interestedDistrict
      });

    if (leadError) throw leadError;

    // 4. Trigger Telegram Bot Notification asynchronously
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://xacres.vercel.app';
        const propertyLink = `${appUrl.replace(/\/$/, '')}/lands/${land.slug}`;

        // Format HTML text safely
        const text = `🔔 <b>New Lead on Xacres!</b>\n\n` +
          `🏡 <b>Land:</b> ${land.title}\n` +
          `📍 <b>Location:</b> ${land.village}, ${land.district}\n` +
          `📏 <b>Size:</b> ${land.area_acres} Acres\n\n` +
          `👤 <b>Name:</b> ${name}\n` +
          `📞 <b>Phone:</b> ${phoneNumber}\n` +
          `🏙️ <b>Buyer Location (District):</b> ${buyerDistrict}\n` +
          `🎯 <b>Purpose:</b> ${purchasePurpose}\n` +
          `📍 <b>Interested In:</b> ${interestedDistrict}\n\n` +
          `🔗 <a href="${propertyLink}">View Listing on Xacres</a>`;

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: false,
          }),
        });
      } catch (tgErr) {
        // Log Telegram notification failure, but do not fail the HTTP request itself
        console.error('Failed to send Telegram notification:', tgErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Error processing lead submission:', err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Internal Server Error'
    }, { status: 500 });
  }
}
