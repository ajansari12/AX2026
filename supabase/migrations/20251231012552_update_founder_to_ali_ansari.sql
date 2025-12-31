/*
  # Update Founder Author to Ali Ansari

  1. Changes
    - Updates the founder author entry from "Alex Stratton" to "Ali Ansari"
    - Updates the bio to "Axrategy Team"
    - Updates the avatar URL to point to the renamed file

  2. Affected Records
    - Author with id 'a1000000-0000-0000-0000-000000000001' (Founder)

  3. Notes
    - This change ensures consistency across the website, blog posts, and database
    - The avatar file has been renamed from alex-stratton.svg to ali-ansari.svg
*/

UPDATE authors 
SET 
  name = 'Ali Ansari',
  bio = 'Axrategy Team',
  avatar_url = '/avatars/ali-ansari.svg'
WHERE id = 'a1000000-0000-0000-0000-000000000001';
