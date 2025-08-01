-- Insert food items with images from dishes directory
-- Generated SQL to populate Food table with dish images

INSERT INTO "public"."Food" (id, name, image_path) VALUES
    (gen_random_uuid(), 'Burger', '/images/dishes/burger.png'),
    (gen_random_uuid(), 'Chicken Rice', '/images/dishes/chicken_rice.png'),
    (gen_random_uuid(), 'Dim Sum', '/images/dishes/dim_sum.png'),
    (gen_random_uuid(), 'Hotpot', '/images/dishes/hotpot.png'),
    (gen_random_uuid(), 'Pasta', '/images/dishes/pasta.png'),
    (gen_random_uuid(), 'Prata', '/images/dishes/prata.png'),
    (gen_random_uuid(), 'Ramen', '/images/dishes/ramen.png'),
    (gen_random_uuid(), 'Sushi', '/images/dishes/sushi.png'),
    (gen_random_uuid(), 'Taco', '/images/dishes/taco.png'),
    (gen_random_uuid(), 'Thai Green Curry', '/images/dishes/thai_green_curry.png');