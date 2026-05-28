// Searchable food database — Indian-focused, with common staples too.
// kcal is per the stated serving. veg:false = contains meat/fish/egg.
// These are approximate, typical home-portion values.

export const FOODS = [
  // --- Kerala dishes ---
  { name: 'Appam', kcal: 120, serving: '1', veg: true, cat: 'Kerala' },
  { name: 'Puttu', kcal: 180, serving: '1 cylinder', veg: true, cat: 'Kerala' },
  { name: 'Idiyappam', kcal: 90, serving: '1', veg: true, cat: 'Kerala' },
  { name: 'Kappa (tapioca)', kcal: 220, serving: '1 cup', veg: true, cat: 'Kerala' },
  { name: 'Kadala curry', kcal: 180, serving: '1 cup', veg: true, cat: 'Kerala' },
  { name: 'Vegetable stew', kcal: 160, serving: '1 cup', veg: true, cat: 'Kerala' },
  { name: 'Avial', kcal: 150, serving: '1 cup', veg: true, cat: 'Kerala' },
  { name: 'Thoran (veg stir-fry)', kcal: 110, serving: '1 cup', veg: true, cat: 'Kerala' },
  { name: 'Olan', kcal: 130, serving: '1 cup', veg: true, cat: 'Kerala' },
  { name: 'Sambar', kcal: 140, serving: '1 cup', veg: true, cat: 'Kerala' },
  { name: 'Moru curry (kachiya moru)', kcal: 90, serving: '1 cup', veg: true, cat: 'Kerala' },
  { name: 'Kerala fish curry (meen curry)', kcal: 280, serving: '1 cup', veg: false, cat: 'Kerala' },
  { name: 'Fish fry (Kerala)', kcal: 300, serving: '1 piece', veg: false, cat: 'Kerala' },
  { name: 'Kerala chicken curry', kcal: 310, serving: '1 cup', veg: false, cat: 'Kerala' },
  { name: 'Chicken stew', kcal: 260, serving: '1 cup', veg: false, cat: 'Kerala' },
  { name: 'Egg roast', kcal: 200, serving: '2 eggs', veg: false, cat: 'Kerala' },
  { name: 'Beef ularthiyathu', kcal: 360, serving: '1 cup', veg: false, cat: 'Kerala' },
  { name: 'Fish molee', kcal: 260, serving: '1 cup', veg: false, cat: 'Kerala' },
  { name: 'Porotta', kcal: 230, serving: '1', veg: true, cat: 'Kerala' },
  { name: 'Pazham pori (banana fritter)', kcal: 110, serving: '1', veg: true, cat: 'Kerala' },
  { name: 'Parippu vada', kcal: 90, serving: '1', veg: true, cat: 'Kerala' },
  { name: 'Unniyappam', kcal: 70, serving: '1', veg: true, cat: 'Kerala' },
  { name: 'Sukhiyan', kcal: 100, serving: '1', veg: true, cat: 'Kerala' },
  { name: 'Nendran banana (steamed)', kcal: 130, serving: '1', veg: true, cat: 'Kerala' },
  { name: 'Payasam', kcal: 250, serving: '1 cup', veg: true, cat: 'Kerala' },
  { name: 'Kerala red rice (cooked)', kcal: 210, serving: '1 cup', veg: true, cat: 'Kerala' },

  // --- Breads & rice ---
  { name: 'Roti / Chapati', kcal: 120, serving: '1 medium', veg: true, cat: 'Grains' },
  { name: 'Plain Paratha', kcal: 180, serving: '1', veg: true, cat: 'Grains' },
  { name: 'Aloo Paratha', kcal: 280, serving: '1', veg: true, cat: 'Grains' },
  { name: 'Naan', kcal: 260, serving: '1', veg: true, cat: 'Grains' },
  { name: 'Plain Rice (cooked)', kcal: 200, serving: '1 cup', veg: true, cat: 'Grains' },
  { name: 'Jeera Rice', kcal: 240, serving: '1 cup', veg: true, cat: 'Grains' },
  { name: 'Veg Pulao', kcal: 280, serving: '1 cup', veg: true, cat: 'Grains' },
  { name: 'Chicken Biryani', kcal: 480, serving: '1 plate', veg: false, cat: 'Grains' },
  { name: 'Veg Biryani', kcal: 380, serving: '1 plate', veg: true, cat: 'Grains' },
  { name: 'Idli', kcal: 60, serving: '1', veg: true, cat: 'Breakfast' },
  { name: 'Plain Dosa', kcal: 170, serving: '1', veg: true, cat: 'Breakfast' },
  { name: 'Masala Dosa', kcal: 290, serving: '1', veg: true, cat: 'Breakfast' },
  { name: 'Upma', kcal: 250, serving: '1 cup', veg: true, cat: 'Breakfast' },
  { name: 'Poha', kcal: 270, serving: '1 cup', veg: true, cat: 'Breakfast' },
  { name: 'Vada', kcal: 130, serving: '1', veg: true, cat: 'Breakfast' },

  // --- Dals & curries (veg) ---
  { name: 'Dal (Tadka)', kcal: 180, serving: '1 cup', veg: true, cat: 'Curry' },
  { name: 'Rajma', kcal: 230, serving: '1 cup', veg: true, cat: 'Curry' },
  { name: 'Chana Masala', kcal: 270, serving: '1 cup', veg: true, cat: 'Curry' },
  { name: 'Palak Paneer', kcal: 320, serving: '1 cup', veg: true, cat: 'Curry' },
  { name: 'Paneer Butter Masala', kcal: 380, serving: '1 cup', veg: true, cat: 'Curry' },
  { name: 'Aloo Gobi', kcal: 200, serving: '1 cup', veg: true, cat: 'Curry' },
  { name: 'Bhindi Masala', kcal: 180, serving: '1 cup', veg: true, cat: 'Curry' },
  { name: 'Mixed Veg Curry', kcal: 190, serving: '1 cup', veg: true, cat: 'Curry' },
  { name: 'Sambar', kcal: 140, serving: '1 cup', veg: true, cat: 'Curry' },
  { name: 'Curd / Yogurt', kcal: 100, serving: '1 cup', veg: true, cat: 'Dairy' },
  { name: 'Raita', kcal: 110, serving: '1 cup', veg: true, cat: 'Dairy' },

  // --- Non-veg ---
  { name: 'Chicken Curry', kcal: 300, serving: '1 cup', veg: false, cat: 'Curry' },
  { name: 'Butter Chicken', kcal: 420, serving: '1 cup', veg: false, cat: 'Curry' },
  { name: 'Grilled / Tandoori Chicken', kcal: 260, serving: '2 pieces', veg: false, cat: 'Curry' },
  { name: 'Egg Curry', kcal: 240, serving: '2 eggs', veg: false, cat: 'Curry' },
  { name: 'Boiled Egg', kcal: 78, serving: '1', veg: false, cat: 'Protein' },
  { name: 'Omelette', kcal: 160, serving: '2 eggs', veg: false, cat: 'Protein' },
  { name: 'Fish Curry', kcal: 280, serving: '1 cup', veg: false, cat: 'Curry' },
  { name: 'Fish Fry', kcal: 320, serving: '1 piece', veg: false, cat: 'Curry' },
  { name: 'Mutton Curry', kcal: 380, serving: '1 cup', veg: false, cat: 'Curry' },
  { name: 'Chicken Tikka', kcal: 220, serving: '4 pieces', veg: false, cat: 'Snack' },

  // --- Snacks & street food ---
  { name: 'Samosa', kcal: 260, serving: '1', veg: true, cat: 'Snack' },
  { name: 'Pakora / Bhaji', kcal: 180, serving: '4 pieces', veg: true, cat: 'Snack' },
  { name: 'Dhokla', kcal: 150, serving: '2 pieces', veg: true, cat: 'Snack' },
  { name: 'Pav Bhaji', kcal: 400, serving: '1 plate', veg: true, cat: 'Snack' },
  { name: 'Vada Pav', kcal: 290, serving: '1', veg: true, cat: 'Snack' },
  { name: 'Dahi Puri / Chaat', kcal: 230, serving: '1 plate', veg: true, cat: 'Snack' },
  { name: 'Roasted Chana', kcal: 120, serving: '1 handful', veg: true, cat: 'Snack' },
  { name: 'Peanuts', kcal: 170, serving: '1 handful', veg: true, cat: 'Snack' },

  // --- Sweets ---
  { name: 'Gulab Jamun', kcal: 150, serving: '1', veg: true, cat: 'Sweet' },
  { name: 'Jalebi', kcal: 150, serving: '1', veg: true, cat: 'Sweet' },
  { name: 'Kheer', kcal: 250, serving: '1 cup', veg: true, cat: 'Sweet' },
  { name: 'Laddu', kcal: 180, serving: '1', veg: true, cat: 'Sweet' },

  // --- Fruits & basics ---
  { name: 'Banana', kcal: 105, serving: '1', veg: true, cat: 'Fruit' },
  { name: 'Apple', kcal: 95, serving: '1', veg: true, cat: 'Fruit' },
  { name: 'Mango', kcal: 150, serving: '1', veg: true, cat: 'Fruit' },
  { name: 'Orange', kcal: 62, serving: '1', veg: true, cat: 'Fruit' },
  { name: 'Mixed Fruit Bowl', kcal: 120, serving: '1 cup', veg: true, cat: 'Fruit' },
  { name: 'Milk (whole)', kcal: 150, serving: '1 cup', veg: true, cat: 'Dairy' },
  { name: 'Masala Chai', kcal: 90, serving: '1 cup', veg: true, cat: 'Drink' },
  { name: 'Lassi (sweet)', kcal: 220, serving: '1 glass', veg: true, cat: 'Drink' },
  { name: 'Almonds', kcal: 160, serving: '1 handful', veg: true, cat: 'Snack' },

  // --- Common western ---
  { name: 'Oatmeal', kcal: 150, serving: '1 cup', veg: true, cat: 'Breakfast' },
  { name: 'Bread (2 slices)', kcal: 160, serving: '2 slices', veg: true, cat: 'Grains' },
  { name: 'Salad (green)', kcal: 60, serving: '1 bowl', veg: true, cat: 'Veg' },
]

export const FOOD_CATEGORIES = [...new Set(FOODS.map((f) => f.cat))]

export function searchFoods(query, vegOnly = false) {
  const q = query.trim().toLowerCase()
  return FOODS.filter((f) => {
    if (vegOnly && !f.veg) return false
    if (!q) return true
    return f.name.toLowerCase().includes(q) || f.cat.toLowerCase().includes(q)
  })
}
