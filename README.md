# Test repo — ব্লগ সেটআপ

এই ব্রাঞ্চে (static-blog) আমি একটি সরল, SEO-ফ্রেন্ডলি এবং মোবাইল-রেস্পন্সিভ ব্লগ টেমপ্লেট যোগ করেছি। নিচে দ্রুত নোট এবং কীভাবে ব্যবহার করবেন তা আছে।

ফিচার:
- index.html: হোমপেজ, পোস্ট তালিকা দেখায় (posts/ ডিরেক্টরি থেকে)
- post.html: পোস্ট দেখার পেইজ (post.html?file=posts/2026-08-10-welcome.md)
- admin/index.html: ব্রাউজার-ভিত্তিক admin পেইজ — Personal Access Token ব্যবহার করে `posts/` এ markdown ফাইল আপলোড করে
- css/: স্টাইলশীট
- posts/: sample markdown পোস্ট

কীভাবে কাজ করে (দ্রুত):
1. GitHub Personal Access Token (PAT) তৈরি করুন — Settings > Developer settings > Personal access tokens। Token-এ "repo" স্কোপ দিন (কমপক্ষে repo:contents)।
2. `admin/` পেইজে গিয়ে টোকেন পেস্ট করুন, শিরোনাম, slug (ফাইল নাম) ও কন্টেন্ট লিখে Publish চাপুন।
3. পেজটি `static-blog` ব্রাঞ্চে ফাইল তৈরি করবে।
4. সাইট দেখতে GitHub Pages সেটিংসে যেতে হবে: Settings > Pages > Branch: `static-blog` এবং root (/) নির্বাচন করুন। তারপর সাইট আপনার GitHub Pages URL এ প্রকাশিত হবে।

নিরাপত্তা নোটস:
- Admin পেইজটি একটি সহজ পদ্ধতি ব্যবহার করে যা ব্রাউজারে সরাসরি PAT লাগে; production-এ OAuth App/Netlify CMS/Identity ব্যবহার করা নিরাপদ।
- PAT দিলে পূর্ণ repo-অ্যাক্সেস দেয়া হতে পারে — সরাসরি ব্যবহার করার সময় সাবধান থাকুন।

ফলো-আপ:
- আপনি চাইলে আমি Netlify-মুখী Netlify CMS বা GitHub OAuth সেটআপ করতে পারি যাতে ব্যবহারকারীর জন্য সহজ লগইন প্রস্তুত হয়।
- আপনি চাইলে আমি আরও থিমিং, sitemap generation, RSS feed, এবং Google Analytics যোগ করে দেব।

