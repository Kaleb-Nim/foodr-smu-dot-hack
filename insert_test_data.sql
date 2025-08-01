-- Test data for Foodr app: 5 users, 1 group, and ratings
-- This creates a complete test scenario with varied user preferences

-- First, let's create variables for the UUIDs we'll use
-- Note: In production, you might want to use specific UUIDs for consistency

-- Insert 5 test users with blob icons
INSERT INTO "public"."User" (id, name, "blobIcon") VALUES
    ('11111111-1111-1111-1111-111111111111', 'Alice', '/images/blob1.png'),
    ('22222222-2222-2222-2222-222222222222', 'Bob', '/images/blob2.png'),
    ('33333333-3333-3333-3333-333333333333', 'Charlie', '/images/blob3.png'),
    ('44444444-4444-4444-4444-444444444444', 'Diana', '/images/blob4.png'),
    ('55555555-5555-5555-5555-555555555555', 'Eve', '/images/blob5.png');

-- Create a test group with Alice as leader
INSERT INTO "public"."Group" (id, code, name, "createdAt", leader_id_fk) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'TEST123', 'Foodie Test Group', NOW(), '11111111-1111-1111-1111-111111111111');

-- Add all 5 users as group members (many-to-many relationship)
INSERT INTO "public"."_GroupMembership" ("A", "B") VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'), -- Alice
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'), -- Bob
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333'), -- Charlie
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444'), -- Diana
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555'); -- Eve

-- Now create ratings - each user rates all dishes with varied preferences
-- We'll need to reference the food IDs, so let's assume the food data was inserted first

-- Alice's ratings (loves Asian food, dislikes heavy dishes)
INSERT INTO "public"."Ratings" (id, person_id_fk, food_id_fk, rating) 
SELECT 
    gen_random_uuid(),
    '11111111-1111-1111-1111-111111111111',
    f.id,
    CASE f.name
        WHEN 'Sushi' THEN 'SUPER_LIKE'
        WHEN 'Ramen' THEN 'SUPER_LIKE'
        WHEN 'Dim Sum' THEN 'SUPER_LIKE'
        WHEN 'Thai Green Curry' THEN 'LIKE'
        WHEN 'Chicken Rice' THEN 'LIKE'
        WHEN 'Pasta' THEN 'LIKE'
        WHEN 'Prata' THEN 'LIKE'
        WHEN 'Burger' THEN 'DISLIKE'
        WHEN 'Hotpot' THEN 'DISLIKE'
        WHEN 'Taco' THEN 'DISLIKE'
    END::public."FoodRating"
FROM "public"."Food" f;

-- Bob's ratings (meat lover, dislikes spicy food)
INSERT INTO "public"."Ratings" (id, person_id_fk, food_id_fk, rating) 
SELECT 
    gen_random_uuid(),
    '22222222-2222-2222-2222-222222222222',
    f.id,
    CASE f.name
        WHEN 'Burger' THEN 'SUPER_LIKE'
        WHEN 'Hotpot' THEN 'SUPER_LIKE'
        WHEN 'Chicken Rice' THEN 'SUPER_LIKE'
        WHEN 'Sushi' THEN 'LIKE'
        WHEN 'Pasta' THEN 'LIKE'
        WHEN 'Prata' THEN 'LIKE'
        WHEN 'Taco' THEN 'LIKE'
        WHEN 'Thai Green Curry' THEN 'DISLIKE'
        WHEN 'Ramen' THEN 'DISLIKE'
        WHEN 'Dim Sum' THEN 'DISLIKE'
    END::public."FoodRating"
FROM "public"."Food" f;

-- Charlie's ratings (loves everything, very positive eater)
INSERT INTO "public"."Ratings" (id, person_id_fk, food_id_fk, rating) 
SELECT 
    gen_random_uuid(),
    '33333333-3333-3333-3333-333333333333',
    f.id,
    CASE f.name
        WHEN 'Pizza' THEN 'SUPER_LIKE'  -- Note: no pizza in our list, so this won't match
        WHEN 'Pasta' THEN 'SUPER_LIKE'
        WHEN 'Burger' THEN 'SUPER_LIKE'
        WHEN 'Sushi' THEN 'SUPER_LIKE'
        WHEN 'Ramen' THEN 'LIKE'
        WHEN 'Thai Green Curry' THEN 'LIKE'
        WHEN 'Hotpot' THEN 'LIKE'
        WHEN 'Chicken Rice' THEN 'LIKE'
        WHEN 'Dim Sum' THEN 'LIKE'
        WHEN 'Prata' THEN 'DISLIKE'
        WHEN 'Taco' THEN 'DISLIKE'
    END::public."FoodRating"
FROM "public"."Food" f;

-- Diana's ratings (health-conscious, prefers lighter dishes)
INSERT INTO "public"."Ratings" (id, person_id_fk, food_id_fk, rating) 
SELECT 
    gen_random_uuid(),
    '44444444-4444-4444-4444-444444444444',
    f.id,
    CASE f.name
        WHEN 'Sushi' THEN 'SUPER_LIKE'
        WHEN 'Thai Green Curry' THEN 'SUPER_LIKE'
        WHEN 'Chicken Rice' THEN 'LIKE'
        WHEN 'Dim Sum' THEN 'LIKE'
        WHEN 'Pasta' THEN 'LIKE'
        WHEN 'Ramen' THEN 'LIKE'
        WHEN 'Hotpot' THEN 'DISLIKE'
        WHEN 'Burger' THEN 'DISLIKE'
        WHEN 'Prata' THEN 'DISLIKE'
        WHEN 'Taco' THEN 'DISLIKE'
    END::public."FoodRating"
FROM "public"."Food" f;

-- Eve's ratings (adventurous eater, loves unique flavors)
INSERT INTO "public"."Ratings" (id, person_id_fk, food_id_fk, rating) 
SELECT 
    gen_random_uuid(),
    '55555555-5555-5555-5555-555555555555',
    f.id,
    CASE f.name
        WHEN 'Thai Green Curry' THEN 'SUPER_LIKE'
        WHEN 'Hotpot' THEN 'SUPER_LIKE'
        WHEN 'Taco' THEN 'SUPER_LIKE'
        WHEN 'Dim Sum' THEN 'SUPER_LIKE'
        WHEN 'Ramen' THEN 'LIKE'
        WHEN 'Prata' THEN 'LIKE'
        WHEN 'Sushi' THEN 'LIKE'
        WHEN 'Pasta' THEN 'DISLIKE'
        WHEN 'Burger' THEN 'DISLIKE'
        WHEN 'Chicken Rice' THEN 'DISLIKE'
    END::public."FoodRating"
FROM "public"."Food" f;