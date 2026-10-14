require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");
const Reservation = require("../models/Reservation");

const menuItems = [
  {
    name: "Saffron Butter Chicken",
    description: "Charred chicken, tomato makhani, kasuri methi.",
    price: 420,
    category: "Indian",
    ingredients: ["chicken", "tomato", "butter", "kasuri methi"],
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
    rating: 4.9,
    isVegetarian: false,
    available: true,
  },
  {
    name: "Truffle Mushroom Bao",
    description: "Steamed bao, wild mushrooms, sesame, crisp shallots.",
    price: 360,
    category: "Chinese",
    ingredients: ["bao bun", "mushroom", "sesame", "shallots"],
    image: "https://images.unsplash.com/photo-1563379091339-03246963d51a?auto=format&fit=crop&w=900&q=85",
    rating: 4.7,
    isVegetarian: true,
    available: true,
  },
  {
    name: "Tandoori Prawns",
    description: "Smoky prawns, green chutney, pickled onion.",
    price: 520,
    category: "Starters",
    ingredients: ["prawns", "green chutney", "onion"],
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
    rating: 4.8,
    isVegetarian: false,
    available: true,
  },
  {
    name: "Burnt Garlic Noodles",
    description: "Wok-tossed noodles, vegetables, chilli oil.",
    price: 290,
    category: "Chinese",
    ingredients: ["noodles", "garlic", "vegetables", "chilli oil"],
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85",
    rating: 4.6,
    isVegetarian: true,
    available: true,
  },
  {
    name: "Charred Paneer Steak",
    description: "Coal-grilled paneer, pepper jus, seasonal greens.",
    price: 390,
    category: "Continental",
    ingredients: ["paneer", "pepper jus", "greens"],
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=85",
    rating: 4.7,
    isVegetarian: true,
    available: true,
  },
  {
    name: "Rose Cardamom Tres Leches",
    description: "Silky milk cake, rose cream, pistachio.",
    price: 240,
    category: "Desserts",
    ingredients: ["milk", "rose", "pistachio", "cardamom"],
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85",
    rating: 4.9,
    isVegetarian: true,
    available: true,
  },
  {
    name: "Kashmiri Lamb Chops",
    description: "Young lamb, saffron glaze, smoked aubergine.",
    price: 690,
    category: "Main Course",
    ingredients: ["lamb", "saffron", "aubergine"],
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
    rating: 4.8,
    isVegetarian: false,
    available: true,
  },
  {
    name: "Mango Chilli Spritz",
    description: "Fresh mango, kaffir lime, soda, chilli salt.",
    price: 180,
    category: "Beverages",
    ingredients: ["mango", "kaffir lime", "soda", "chilli salt"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
    rating: 4.6,
    isVegetarian: true,
    available: true,
  },
  {
    name: "Black Pepper Paneer",
    description: "Silken paneer, cracked pepper, blistered grapes and curry leaf.",
    price: 340,
    category: "Indian",
    ingredients: ["paneer", "pepper", "grapes", "curry leaf"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rating: 4.7,
    isVegetarian: true,
    available: true,
  },
  {
    name: "Ember Noodles",
    description: "Hand-pulled noodles, ember garlic, sesame and wok greens.",
    price: 310,
    category: "Chinese",
    ingredients: ["noodles", "garlic", "sesame", "greens"],
    image: "https://images.pexels.com/photos/5410401/pexels-photo-5410401.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rating: 4.8,
    isVegetarian: true,
    available: true,
  },
  {
    name: "Coastal Fish & Chips",
    description: "Crisp coastal fish, masala batter, smoked lime aioli.",
    price: 450,
    category: "Continental",
    ingredients: ["fish", "potato", "lime aioli"],
    image: "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rating: 4.6,
    isVegetarian: false,
    available: true,
  },
  {
    name: "Kokum Spritz",
    description: "Kokum, basil seed, tonic and a touch of smoked salt.",
    price: 190,
    category: "Beverages",
    ingredients: ["kokum", "basil seed", "tonic"],
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rating: 4.8,
    isVegetarian: true,
    available: true,
  },
  {
    name: "Chilli Garlic Dumplings",
    description: "Pan-seared dumplings, chilli garlic oil, scallion.",
    price: 320,
    category: "Starters",
    ingredients: ["dumpling wrapper", "garlic", "chilli oil", "scallion"],
    image: "https://images.unsplash.com/photo-1563379091339-03246963d51a?auto=format&fit=crop&w=900&q=85",
    rating: 4.5,
    isVegetarian: true,
    available: true,
  },
  {
    name: "Smoked Chicken Tikka",
    description: "Yogurt-marinated chicken, char-grilled, mint chutney.",
    price: 410,
    category: "Starters",
    ingredients: ["chicken", "yogurt", "mint chutney"],
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
    rating: 4.7,
    isVegetarian: false,
    available: true,
  },
  {
    name: "Pistachio Kulfi",
    description: "Slow-churned kulfi, pistachio praline, rose petal.",
    price: 210,
    category: "Desserts",
    ingredients: ["milk", "pistachio", "rose petal"],
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85",
    rating: 4.9,
    isVegetarian: true,
    available: true,
  },
  {
    name: "Masala Chai Creme Brulee",
    description: "Spiced tea custard, caramel crack, cardamom tuile.",
    price: 260,
    category: "Desserts",
    ingredients: ["milk", "tea", "cardamom", "sugar"],
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85",
    rating: 4.6,
    isVegetarian: true,
    available: true,
  },
  {
    name: "Sichuan Chilli Paneer",
    description: "Crisp paneer, Sichuan chilli glaze, spring onion.",
    price: 350,
    category: "Chinese",
    ingredients: ["paneer", "sichuan chilli", "spring onion"],
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85",
    rating: 4.5,
    isVegetarian: true,
    available: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      MenuItem.deleteMany({}),
      Order.deleteMany({}),
      Reservation.deleteMany({}),
    ]);
    console.log("Cleared existing data.");

    // Create admin user
    const admin = await User.create({
      name: "Urban Spice Admin",
      email: "admin@urbanspice.test",
      password: process.env.ADMIN_PASSWORD || "Admin@12345",
      phone: "+91 22 4890 1717",
      address: "17 Market Street, Fort, Mumbai",
      role: "admin",
    });

    // Create sample users
    const sampleUsers = await User.create([
      {
        name: "Aarav Mehta",
        email: "aarav@example.com",
        password: "Password@123",
        phone: "+91 98765 43210",
        address: "Pune, Maharashtra",
        role: "user",
      },
      {
        name: "Priya Sharma",
        email: "priya@example.com",
        password: "Password@123",
        phone: "+91 91234 56789",
        address: "Bengaluru, Karnataka",
        role: "user",
      },
      {
        name: "Rohan Khanna",
        email: "rohan@example.com",
        password: "Password@123",
        phone: "+91 99887 76655",
        address: "Delhi",
        role: "user",
      },
    ]);

    console.log(`Created admin (${admin.email}) and ${sampleUsers.length} sample users.`);

    // Create menu items
    const createdMenu = await MenuItem.insertMany(menuItems);
    console.log(`Created ${createdMenu.length} menu items.`);

    // Create sample orders
    const sampleOrders = [
      {
        user: sampleUsers[0]._id,
        items: [
          { menuItemId: createdMenu[0]._id, name: createdMenu[0].name, price: createdMenu[0].price, quantity: 2, image: createdMenu[0].image },
          { menuItemId: createdMenu[5]._id, name: createdMenu[5].name, price: createdMenu[5].price, quantity: 1, image: createdMenu[5].image },
        ],
        deliveryAddress: "Pune, Maharashtra",
        paymentMethod: "online",
        paymentStatus: "paid",
        orderStatus: "Delivered",
      },
      {
        user: sampleUsers[1]._id,
        items: [
          { menuItemId: createdMenu[1]._id, name: createdMenu[1].name, price: createdMenu[1].price, quantity: 3, image: createdMenu[1].image },
        ],
        deliveryAddress: "Bengaluru, Karnataka",
        paymentMethod: "cod",
        paymentStatus: "pending",
        orderStatus: "Preparing",
      },
      {
        user: sampleUsers[2]._id,
        items: [
          { menuItemId: createdMenu[6]._id, name: createdMenu[6].name, price: createdMenu[6].price, quantity: 1, image: createdMenu[6].image },
          { menuItemId: createdMenu[7]._id, name: createdMenu[7].name, price: createdMenu[7].price, quantity: 2, image: createdMenu[7].image },
        ],
        deliveryAddress: "Delhi",
        paymentMethod: "online",
        paymentStatus: "paid",
        orderStatus: "Out for Delivery",
      },
    ];
    for (const orderData of sampleOrders) {
      orderData.totalAmount = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`Created ${createdOrders.length} sample orders.`);

    // Create sample reservations
    const sampleReservations = [
      {
        user: sampleUsers[0]._id,
        name: sampleUsers[0].name,
        email: sampleUsers[0].email,
        phone: sampleUsers[0].phone,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        time: "20:00",
        guests: 4,
        specialRequest: "Window table, please",
        status: "Confirmed",
      },
      {
        user: sampleUsers[1]._id,
        name: sampleUsers[1].name,
        email: sampleUsers[1].email,
        phone: sampleUsers[1].phone,
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        time: "18:30",
        guests: 2,
        specialRequest: "",
        status: "Pending",
      },
      {
        user: sampleUsers[2]._id,
        name: sampleUsers[2].name,
        email: sampleUsers[2].email,
        phone: sampleUsers[2].phone,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        time: "21:30",
        guests: 6,
        specialRequest: "Birthday celebration",
        status: "Confirmed",
      },
    ];
    const createdReservations = await Reservation.insertMany(sampleReservations);
    console.log(`Created ${createdReservations.length} sample reservations.`);

    console.log("\nSeed complete!");
    console.log("--------------------------------------------------");
    console.log(`Admin login  -> email: ${admin.email}  password: ${process.env.ADMIN_PASSWORD || "Admin@12345"}`);
    console.log("Sample user  -> email: aarav@example.com  password: Password@123");
    console.log("--------------------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
