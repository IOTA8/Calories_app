/**
 * Built-in Food & Macro Database for manual food logging & quick search
 */

export const FOOD_DATABASE = [
  { id: 'f1', name: 'Boiled Egg (Large)', serving: '1 large (50g)', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, fiber: 0, category: 'Eggs & Dairy' },
  { id: 'f2', name: 'Scrambled Eggs (2 eggs + butter)', serving: '1 serving (120g)', calories: 190, protein: 13, carbs: 1.5, fat: 15, fiber: 0, category: 'Eggs & Dairy' },
  { id: 'f3', name: 'Egg Whites (Liquid/Cooked)', serving: '100g', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, category: 'Eggs & Dairy' },
  { id: 'f4', name: 'Greek Yogurt 0% Fat', serving: '1 cup (170g)', calories: 100, protein: 18, carbs: 6, fat: 0.7, fiber: 0, category: 'Eggs & Dairy' },
  { id: 'f5', name: 'Cottage Cheese (Low Fat 2%)', serving: '1/2 cup (113g)', calories: 90, protein: 13, carbs: 5, fat: 2.5, fiber: 0, category: 'Eggs & Dairy' },
  { id: 'f6', name: 'Whey Protein Powder (1 scoop)', serving: '1 scoop (30g)', calories: 120, protein: 24, carbs: 2, fat: 1.5, fiber: 0, category: 'Supplements' },
  { id: 'f7', name: 'Chicken Breast (Cooked, skinless)', serving: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, category: 'Meat & Poultry' },
  { id: 'f8', name: 'Chicken Thigh (Cooked, skinless)', serving: '100g', calories: 209, protein: 26, carbs: 0, fat: 10.9, fiber: 0, category: 'Meat & Poultry' },
  { id: 'f9', name: 'Ground Turkey (93/7 Lean)', serving: '100g', calories: 150, protein: 20, carbs: 0, fat: 8, fiber: 0, category: 'Meat & Poultry' },
  { id: 'f10', name: 'Lean Ground Beef (90/10)', serving: '100g', calories: 200, protein: 26, carbs: 0, fat: 10, fiber: 0, category: 'Meat & Poultry' },
  { id: 'f11', name: 'Atlantic Salmon (Cooked)', serving: '100g', calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, category: 'Seafood' },
  { id: 'f12', name: 'Canned Tuna in Water', serving: '1 can (130g)', calories: 130, protein: 28, carbs: 0, fat: 1, fiber: 0, category: 'Seafood' },
  { id: 'f13', name: 'White Rice (Cooked)', serving: '1 cup (158g)', calories: 205, protein: 4.2, carbs: 45, fat: 0.4, fiber: 0.6, category: 'Grains & Carbs' },
  { id: 'f14', name: 'Brown Rice (Cooked)', serving: '1 cup (195g)', calories: 218, protein: 4.5, carbs: 46, fat: 1.6, fiber: 3.5, category: 'Grains & Carbs' },
  { id: 'f15', name: 'Oatmeal / Rolled Oats (Dry)', serving: '1/2 cup (40g)', calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4, category: 'Grains & Carbs' },
  { id: 'f16', name: 'Whole Wheat Bread', serving: '1 slice (38g)', calories: 80, protein: 4, carbs: 13, fat: 1, fiber: 2, category: 'Grains & Carbs' },
  { id: 'f17', name: 'Sourdough Bread', serving: '1 slice (50g)', calories: 120, protein: 4, carbs: 23, fat: 0.5, fiber: 1.2, category: 'Grains & Carbs' },
  { id: 'f18', name: 'Sweet Potato (Baked with skin)', serving: '1 medium (150g)', calories: 130, protein: 2.3, carbs: 33, fat: 0.2, fiber: 4, category: 'Grains & Carbs' },
  { id: 'f19', name: 'Avocado', serving: '1/2 medium (75g)', calories: 120, protein: 1.5, carbs: 6, fat: 11, fiber: 5, category: 'Fruits & Veggies' },
  { id: 'f20', name: 'Banana', serving: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1, category: 'Fruits & Veggies' },
  { id: 'f21', name: 'Apple with skin', serving: '1 medium (182g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, category: 'Fruits & Veggies' },
  { id: 'f22', name: 'Blueberries (Fresh)', serving: '1 cup (148g)', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, category: 'Fruits & Veggies' },
  { id: 'f23', name: 'Broccoli (Steamed)', serving: '1 cup (156g)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, category: 'Fruits & Veggies' },
  { id: 'f24', name: 'Peanut Butter', serving: '2 tbsp (32g)', calories: 190, protein: 8, carbs: 7, fat: 16, fiber: 2, category: 'Fats & Nuts' },
  { id: 'f25', name: 'Almonds', serving: '1 oz / 23 nuts (28g)', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, category: 'Fats & Nuts' },
  { id: 'f26', name: 'Olive Oil (Extra Virgin)', serving: '1 tbsp (14ml)', calories: 120, protein: 0, carbs: 0, fat: 14, fiber: 0, category: 'Fats & Nuts' },
  { id: 'f27', name: 'Black Coffee / Espresso', serving: '1 cup', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, category: 'Beverages' },
  { id: 'f28', name: 'Almond Milk (Unsweetened)', serving: '1 cup (240ml)', calories: 30, protein: 1, carbs: 1, fat: 2.5, fiber: 1, category: 'Beverages' }
];

export function searchFoods(query) {
  if (!query || !query.trim()) return FOOD_DATABASE;
  const q = query.toLowerCase().trim();
  return FOOD_DATABASE.filter(f => 
    f.name.toLowerCase().includes(q) || 
    f.category.toLowerCase().includes(q)
  );
}
