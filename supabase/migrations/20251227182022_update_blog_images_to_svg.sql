/*
  # Update Blog Post Images to Local SVG Covers

  1. Changes
    - Updates all 12 blog post cover images from Unsplash URLs to local SVG files
    - Each blog post now uses a custom-designed SVG cover in /blog-covers/

  2. Image Mappings
    - ai-sales-agents-guide -> ai-agents-guide.svg
    - stop-copy-pasting-zapier -> zapier-automations.svg
    - speed-to-lead-rule -> speed-to-lead.svg
    - conversion-first-design -> conversion-design.svg
    - reactivate-dead-leads -> sms-sequence.svg
    - chatgpt-vs-claude -> chatgpt-vs-claude.svg
    - automating-boring-stuff -> automation-backoffice.svg
    - client-portal-reduces-churn -> client-retention.svg
    - mobile-nav-best-practices -> mobile-nav.svg
    - seo-is-dead-for-local -> local-service-ads.svg
    - building-second-brain -> second-brain.svg
    - chaos-to-crm -> crm-migration.svg
*/

UPDATE blog_posts SET image_url = '/blog-covers/ai-agents-guide.svg' WHERE slug = 'ai-sales-agents-guide';
UPDATE blog_posts SET image_url = '/blog-covers/zapier-automations.svg' WHERE slug = 'stop-copy-pasting-zapier';
UPDATE blog_posts SET image_url = '/blog-covers/speed-to-lead.svg' WHERE slug = 'speed-to-lead-rule';
UPDATE blog_posts SET image_url = '/blog-covers/conversion-design.svg' WHERE slug = 'conversion-first-design';
UPDATE blog_posts SET image_url = '/blog-covers/sms-sequence.svg' WHERE slug = 'reactivate-dead-leads';
UPDATE blog_posts SET image_url = '/blog-covers/chatgpt-vs-claude.svg' WHERE slug = 'chatgpt-vs-claude';
UPDATE blog_posts SET image_url = '/blog-covers/automation-backoffice.svg' WHERE slug = 'automating-boring-stuff';
UPDATE blog_posts SET image_url = '/blog-covers/client-retention.svg' WHERE slug = 'client-portal-reduces-churn';
UPDATE blog_posts SET image_url = '/blog-covers/mobile-nav.svg' WHERE slug = 'mobile-nav-best-practices';
UPDATE blog_posts SET image_url = '/blog-covers/local-service-ads.svg' WHERE slug = 'seo-is-dead-for-local';
UPDATE blog_posts SET image_url = '/blog-covers/second-brain.svg' WHERE slug = 'building-second-brain';
UPDATE blog_posts SET image_url = '/blog-covers/crm-migration.svg' WHERE slug = 'chaos-to-crm';