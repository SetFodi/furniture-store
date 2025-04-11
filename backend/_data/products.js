// backend/_data/products.js

const products = [
    {
      name: "Modern Velvet Sofa",
      description:
        "Luxurious and comfortable sofa with plush velvet upholstery and sleek metal legs. Perfect for contemporary living rooms.",
      price: 899.99,
      category: "Living Room",
      material: "Velvet, Metal",
      dimensions: { width: 200, height: 85, depth: 90 },
      imageUrl: "https://placehold.co/600x400/EAD9C8/5C4033?text=Sofa",
      images: [
        "https://placehold.co/600x400/EAD9C8/5C4033?text=Sofa+View+1",
        "https://placehold.co/600x400/EAD9C8/5C4033?text=Sofa+View+2",
        "https://placehold.co/600x400/EAD9C8/5C4033?text=Sofa+Detail",
      ],
      stock: 15,
      rating: 4.7,
      numReviews: 22,
    },
    {
      name: "Minimalist Oak Coffee Table",
      description:
        "Clean lines and natural oak finish define this minimalist coffee table. Features a lower shelf for storage.",
      price: 249.5,
      category: "Living Room",
      material: "Oak Wood",
      dimensions: { width: 110, height: 45, depth: 60 },
      imageUrl:
        "https://placehold.co/600x400/D2B48C/8B4513?text=Coffee+Table",
      images: [],
      stock: 30,
      rating: 4.5,
      numReviews: 15,
    },
    {
      name: "Ergonomic Office Chair",
      description:
        "High-back ergonomic chair with adjustable lumbar support, armrests, and breathable mesh back.",
      price: 320.0,
      category: "Office",
      material: "Mesh, Plastic, Metal",
      imageUrl: "https://placehold.co/600x400/A9A9A9/000000?text=Office+Chair",
      images: [
        "https://placehold.co/600x400/A9A9A9/000000?text=Chair+Side",
        "https://placehold.co/600x400/A9A9A9/000000?text=Chair+Back",
      ],
      stock: 25,
      rating: 4.8,
      numReviews: 45,
    },
    {
      name: "Queen Size Platform Bed",
      description:
        "Stylish platform bed frame with a tufted headboard and wooden slats. No box spring required.",
      price: 550.0,
      category: "Bedroom",
      material: "Fabric, Wood",
      dimensions: { width: 160, height: 110, depth: 210 }, // Approx Queen size in cm
      imageUrl: "https://placehold.co/600x400/F5F5DC/8B4513?text=Bed",
      images: [],
      stock: 10,
      rating: 4.6,
      numReviews: 18,
    },
    {
      name: "Round Glass Dining Table",
      description:
        "Elegant round dining table with a tempered glass top and a sculptural metal base. Seats 4 comfortably.",
      price: 410.0,
      category: "Dining",
      material: "Glass, Metal",
      dimensions: { width: 120, height: 75, depth: 120 }, // Diameter 120cm
      imageUrl: "https://placehold.co/600x400/E0E0E0/333333?text=Dining+Table",
      images: [],
      stock: 8,
      rating: 4.4,
      numReviews: 9,
    },
    {
      name: "Wooden Bookshelf - 5 Tier",
      description:
        "Tall and sturdy bookshelf with 5 spacious tiers, perfect for books, decor, and more. Rustic wood finish.",
      price: 180.75,
      category: "Living Room",
      material: "Wood, Metal Frame",
      dimensions: { width: 80, height: 180, depth: 30 },
      imageUrl: "https://placehold.co/600x400/8B4513/FFFFFF?text=Bookshelf",
      images: [],
      stock: 22,
      rating: 4.3,
      numReviews: 12,
    },
  ];
  
  module.exports = products;
  