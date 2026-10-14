export const money = (value) => `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

export const fallbackMenu = [
  {
    id: "spiced-lamb",
    name: "Kashmiri Lamb Chops",
    description: "Charred over coal with saffron yogurt, pickled plum and mint.",
    price: 690,
    category: "Indian",
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ingredients: ["Lamb", "Saffron", "Mint"],
    rating: 4.9,
    isVegetarian: false,
    available: true,
  },
  {
    id: "black-pepper",
    name: "Black Pepper Paneer",
    description: "Silken paneer, cracked pepper, blistered grapes and curry leaf.",
    price: 340,
    category: "Indian",
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ingredients: ["Paneer", "Grapes", "Curry leaf"],
    rating: 4.7,
    isVegetarian: true,
    available: true,
  },
  {
    id: "ember-noodles",
    name: "Ember Noodles",
    description: "Hand-pulled noodles, ember garlic, sesame and wok greens.",
    price: 310,
    category: "Chinese",
    image: "https://images.pexels.com/photos/5410401/pexels-photo-5410401.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ingredients: ["Wheat noodles", "Sesame", "Greens"],
    rating: 4.8,
    isVegetarian: true,
    available: true,
  },
];
