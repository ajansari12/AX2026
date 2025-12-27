/*
  # Update Author Avatars to Local SVG Files

  1. Changes
    - Updates all 3 author avatar images from Unsplash URLs to local SVG files
    - Each author now uses a custom-designed SVG avatar in /avatars/

  2. Avatar Mappings
    - Alex Stratton -> alex-stratton.svg
    - Sarah Chen -> sarah-chen.svg
    - Marcus Cole -> marcus-cole.svg
*/

UPDATE authors SET avatar_url = '/avatars/alex-stratton.svg' WHERE id = 'a1000000-0000-0000-0000-000000000001';
UPDATE authors SET avatar_url = '/avatars/sarah-chen.svg' WHERE id = 'a1000000-0000-0000-0000-000000000002';
UPDATE authors SET avatar_url = '/avatars/marcus-cole.svg' WHERE id = 'a1000000-0000-0000-0000-000000000003';