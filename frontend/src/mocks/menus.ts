import type { MenuItem } from "../types";

export const MOCK_MENUS: MenuItem[] = [
  // Spice Route (r1)
  { id: "m101", restaurantId: "r1", name: "Butter Chicken", price: 12.99, category: "Main", description: "Creamy tomato curry with tender chicken" },
  { id: "m102", restaurantId: "r1", name: "Paneer Tikka", price: 9.99, category: "Starter", description: "Grilled cottage cheese with spices" },
  { id: "m103", restaurantId: "r1", name: "Garlic Naan", price: 3.49, category: "Bread", description: "Soft flatbread with garlic butter" },
  { id: "m104", restaurantId: "r1", name: "Mango Lassi", price: 3.99, category: "Beverage", description: "Sweet yogurt mango drink" },

  // Bella Napoli (r2)
  { id: "m201", restaurantId: "r2", name: "Margherita Pizza", price: 11.99, category: "Main", description: "Classic tomato, basil, mozzarella" },
  { id: "m202", restaurantId: "r2", name: "Fettuccine Alfredo", price: 13.49, category: "Main", description: "Creamy parmesan pasta" },
  { id: "m203", restaurantId: "r2", name: "Bruschetta", price: 6.99, category: "Starter", description: "Toasted bread with tomato and basil" },
  { id: "m204", restaurantId: "r2", name: "Tiramisu", price: 5.99, category: "Dessert", description: "Classic Italian coffee dessert" },

  // Golden Dragon (r3)
  { id: "m301", restaurantId: "r3", name: "Kung Pao Chicken", price: 11.49, category: "Main", description: "Spicy stir-fried chicken with peanuts" },
  { id: "m302", restaurantId: "r3", name: "Vegetable Spring Rolls", price: 5.49, category: "Starter", description: "Crispy rolls with fresh veggies" },
  { id: "m303", restaurantId: "r3", name: "Fried Rice", price: 7.99, category: "Main", description: "Wok-tossed rice with egg and vegetables" },
  { id: "m304", restaurantId: "r3", name: "Hot and Sour Soup", price: 4.99, category: "Soup", description: "Tangy spicy classic soup" },

  // Taco Fiesta (r4)
  { id: "m401", restaurantId: "r4", name: "Chicken Tacos", price: 8.99, category: "Main", description: "Three tacos with grilled chicken" },
  { id: "m402", restaurantId: "r4", name: "Beef Burrito", price: 9.49, category: "Main", description: "Large burrito with seasoned beef" },
  { id: "m403", restaurantId: "r4", name: "Guacamole and Chips", price: 5.99, category: "Starter", description: "Fresh avocado dip with tortilla chips" },
  { id: "m404", restaurantId: "r4", name: "Churros", price: 4.49, category: "Dessert", description: "Cinnamon sugar fried dough" },

  // Burger Barn (r5)
  { id: "m501", restaurantId: "r5", name: "Classic Cheeseburger", price: 7.99, category: "Main", description: "Beef patty with cheddar and pickles" },
  { id: "m502", restaurantId: "r5", name: "Bacon BBQ Burger", price: 9.49, category: "Main", description: "Beef patty with bacon and bbq sauce" },
  { id: "m503", restaurantId: "r5", name: "Crispy Fries", price: 3.49, category: "Side", description: "Golden salted fries" },
  { id: "m504", restaurantId: "r5", name: "Chocolate Milkshake", price: 4.99, category: "Beverage", description: "Thick creamy chocolate shake" },

  // Sushi Zen (r6)
  { id: "m601", restaurantId: "r6", name: "California Roll", price: 7.49, category: "Sushi", description: "Crab, avocado, and cucumber roll" },
  { id: "m602", restaurantId: "r6", name: "Salmon Nigiri", price: 8.99, category: "Sushi", description: "Fresh salmon over seasoned rice" },
  { id: "m603", restaurantId: "r6", name: "Miso Soup", price: 2.99, category: "Soup", description: "Traditional soybean paste soup" },
  { id: "m604", restaurantId: "r6", name: "Edamame", price: 3.99, category: "Starter", description: "Steamed salted soybeans" },
];
