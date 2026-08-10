# Test repo — ব্লগ সেটআপ (Netlify CMS)

এই ব্রাঞ্চে (static-blog) আমি Netlify CMS ইন্টিগ্রেশন জন্য প্রয়োজনীয় ফাইলগুলো যোগ করেছি। নিচে ধাপে ধাপে নির্দেশ দেয়া আছে কিভাবে Netlify ব্যবহার করে আপনি GUI‑ভিত্তিক admin দিয়ে পোস্ট করতে পারবেন (PAT ব্যবহার না করেই)।

কী আছে এখানে:
- admin/index.html — Netlify CMS loader (এখান থেকে CMS UI খুলবে)
- admin/config.yml — Netlify CMS কনফিগ (git-gateway backend, posts collection)
- netlify.toml — Netlify deploy নির্দেশ (publish folder root)

Netlify সেটআপ (ধাপে ধাপে)
1. Netlify এ একটি অ্যাকাউন্ট তৈরি করুন (https://app.netlify.com/). 
2. New site → "Import from Git" → GitHub → আপনার রিপো (nisht-eng/test) connect করুন।
   - Deploy settings এ Branch to deploy হিসেবে `static-blog` নির্বাচন করুন।
3. Deploy site করুন — এটি আপনার সাইটকে Netlify এ হোস্ট করবে।

Netlify Identity & Git Gateway চালু করা
1. Netlify site dashboard → Settings → Identity → Enable Identity service (Enable Identity)
2. Identity → Registration preferences: নির্ভর করে; simplest: Invite only বা Open (Open হলে কেউ সাইন আপ করতে পারবে)
3. Identity → Services → Git Gateway → Enable Git Gateway
   - Git Gateway ব্যবহার করতে Netlify আপনাকে GitHub repo access দিতে বলবে — অনুমোদন করুন।
4. Identity → Invite users: আপনার নিজের ইমেইল Invite করে Accept করে নিন OR Open registration দিয়ে Sign up করুন।

Admin UI ব্যবহার
- একবার site ডিপ্লয় হয়ে Identity + Git Gateway enabled হলে, যান:
  https://<your-netlify-site>.netlify.app/admin/
- Netlify Identity দিয়ে লগইন করুন (Sign in with email) — এরপর আপনি Netlify CMS UI থেকে নতুন পোস্ট create, edit, delete করতে পারবেন।

অতিরিক্ত তথ্য ও নিরাপত্তা
- Netlify Identity + Git Gateway সেটআপ করলে ব্যবহারকারীরা ব্রাউজার-ভিত্তিক লগইন দিয়ে GitHub‑এ commit তৈরি করতে পারবে — PAT ব্যবহারের প্রয়োজন নেই।
- যদি আপনি চাইলে আমি Netlify সেটআপে সাহায্য করতে পারি (আপনি আমাকে বলতে পারেন আপনার Netlify site name বা আমাকে collaborator/invite করতে পারেন) — কিন্তু নিরাপত্তার কারণে আপনার Netlify অ্যাকাউন্ট credentials আমাকে দেবেন না।

প্রয়োগের পর আমি যা করব
- আপনি Netlify এ সাইট connect ও deploy করলে আমাকে বলুন — আমি CMS দিয়ে একটি টেস্ট পোস্ট তৈরি করে দেখব এবং নিশ্চিত করব যে `posts/` ডিরেক্টরিতে commit হচ্ছে এবং index.html তা দেখাচ্ছে।
- চাইলে আমি আরও কনফিগ (media handling, custom collections, default templates) করে দেব।

