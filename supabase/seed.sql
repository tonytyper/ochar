-- the stand-in catalogue, so the shop has something in it while you add your
-- real bars. run it after schema.sql. the names, copy, ingredients and prices
-- are all made up: edit them in the table editor, or delete these rows.

insert into public.products
  (slug, name, description, ingredients, price, tone, in_stock, sort_order)
values
  ('lavender-field', 'Lavender Field', 'Lavender buds steeped in oat milk. A soft lather and a calm scent that stays with you.', array['Olive oil', 'Coconut oil', 'Shea butter', 'Oat milk', 'Lavender essential oil', 'Lavender buds', 'White kaolin clay'], 12.00, 'lavender', true, 10),
  ('sea-mist', 'Sea Mist', 'Blue clay and a pinch of sea salt. A dense, mineral bar that rinses completely clean.', array['Olive oil', 'Coconut oil', 'Castor oil', 'Blue kaolin clay', 'Sea salt', 'Bergamot essential oil', 'Petitgrain essential oil'], 12.00, 'sea', true, 20),
  ('wild-iris', 'Wild Iris', 'Orris root and violet leaf. Powdery and green, old-fashioned in the best way.', array['Olive oil', 'Coconut oil', 'Avocado oil', 'Orris root powder', 'Violet leaf absolute', 'Vetiver essential oil'], 13.00, 'orris', true, 30),
  ('blue-chamomile', 'Blue Chamomile', 'Chamomile, calendula and raw honey. Barely scented, and gentle enough for your face.', array['Olive oil', 'Coconut oil', 'Shea butter', 'German chamomile essential oil', 'Calendula petals', 'Raw honey'], 14.00, 'chamomile', true, 40),
  ('moonflower', 'Moonflower', 'Jasmine and tuberose over coconut milk. Rich and floral, made for a long bath.', array['Olive oil', 'Coconut oil', 'Cocoa butter', 'Coconut milk', 'Jasmine absolute', 'Tuberose absolute', 'Alkanet root'], 14.00, 'apricot', true, 50),
  ('rosemary-and-rain', 'Rosemary & Rain', 'Rosemary, spearmint and a thread of eucalyptus. The one for early mornings.', array['Olive oil', 'Coconut oil', 'Castor oil', 'Rosemary essential oil', 'Spearmint essential oil', 'Eucalyptus essential oil', 'French green clay'], 11.00, 'sage', false, 60),
  ('linen', 'Linen', 'Unscented, for sensitive skin. Just oats, white clay and a long, slow cure.', array['Olive oil', 'Coconut oil', 'Shea butter', 'Colloidal oatmeal', 'White kaolin clay'], 11.00, 'oat', true, 70),
  ('first-frost', 'First Frost', 'Fir needle, juniper and grapefruit peel. A winter bar, made in small runs until spring.', array['Olive oil', 'Coconut oil', 'Fir needle essential oil', 'Juniper berry essential oil', 'Grapefruit essential oil'], 13.00, 'fir', true, 80)
on conflict (slug) do nothing;
