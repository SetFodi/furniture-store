// backend/_data/products.js

const products = [
  // --- Products with Updated Image URLs ---
  {
    _id: "60c72b3f9b1d8e3f4c8e4c1a",
    name: "Modern Velvet Sofa (Emerald Green)",
    description:
      "Luxurious and comfortable sofa with plush emerald green velvet upholstery and sleek gold-finish metal legs. Perfect for contemporary living rooms.",
    price: 949.99,
    category: "Living Room",
    material: "Velvet, Metal",
    dimensions: { width: 200, height: 85, depth: 90 },
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1170&q=80", // Green sofa
    images: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=870&q=80", // Sofa side view
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=687&q=80", // Detail/Texture
    ],
    stock: 12,
    rating: 4.7,
    numReviews: 25,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c1b",
    name: "Minimalist Oak Coffee Table",
    description:
      "Clean lines and natural oak finish define this minimalist coffee table. Features a lower shelf for storage and sturdy construction.",
    price: 259.99,
    category: "Living Room",
    material: "Oak Wood",
    dimensions: { width: 110, height: 45, depth: 60 },
    imageUrl:
      "https://images.unsplash.com/photo-1611117775350-ac3950990985?auto=format&fit=crop&w=1171&q=80", // Oak coffee table
    images: [
      "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?auto=format&fit=crop&w=1171&q=80",
      "https://images.unsplash.com/photo-1602872030219-ad2b9a54315c?auto=format&fit=crop&w=1170&q=80"
    ],
    stock: 28,
    rating: 4.5,
    numReviews: 18,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c1c",
    name: "Ergonomic Office Chair (Mesh Back)",
    description:
      "High-back ergonomic chair with adjustable lumbar support, armrests, headrest, and breathable mesh back for ultimate comfort during long work hours.",
    price: 349.0,
    category: "Office",
    material: "Mesh, Nylon, Metal",
    imageUrl:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=687&q=80", // Office chair
    images: [
      "https://images.unsplash.com/photo-1617103995419-e915789e3996?auto=format&fit=crop&w=687&q=80", // Chair side/detail
    ],
    stock: 20,
    rating: 4.8,
    numReviews: 52,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c1d",
    name: "Queen Size Upholstered Platform Bed (Gray)",
    description:
      "Stylish platform bed frame with a sophisticated gray upholstered, button-tufted headboard and wooden slats. No box spring required.",
    price: 575.5,
    category: "Bedroom",
    material: "Fabric, Wood, Foam",
    dimensions: { width: 165, height: 115, depth: 215 },
    imageUrl:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1170&q=80", // Gray bed
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?auto=format&fit=crop&w=1171&q=80"
    ],
    stock: 8,
    rating: 4.6,
    numReviews: 21,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c1e",
    name: "Round Marble Dining Table",
    description:
      "Elegant round dining table featuring a luxurious white marble top and a striking geometric metal base in black. Seats 4 comfortably.",
    price: 699.0,
    category: "Dining",
    material: "Marble, Metal",
    dimensions: { width: 120, height: 76, depth: 120 },
    imageUrl:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=764&q=80", // Marble dining table
    images: [
      "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=765&q=80",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=880&q=80"
    ],
    stock: 7,
    rating: 4.7,
    numReviews: 11,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c1f",
    name: "Industrial Wooden Bookshelf - 5 Tier",
    description:
      "Tall and sturdy bookshelf combining rustic wood-finish shelves with a robust black metal frame. 5 spacious tiers for books, decor, and more.",
    price: 199.95,
    category: "Living Room",
    material: "Engineered Wood, Metal Frame",
    dimensions: { width: 80, height: 180, depth: 30 },
    imageUrl:
      "https://images.unsplash.com/photo-1594620302200-6a762955a855?auto=format&fit=crop&w=698&q=80", // Bookshelf
    images: [
      "https://images.unsplash.com/photo-1588627541420-fce3f661b779?auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1543248939-4296e1fea89b?auto=format&fit=crop&w=1170&q=80"
    ],
    stock: 18,
    rating: 4.4,
    numReviews: 14,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c20",
    name: "Mid-Century Modern Armchair (Teal)",
    description:
      "Iconic mid-century modern armchair design with solid wood frame and comfortable teal fabric upholstery. A statement piece for any room.",
    price: 420.0,
    category: "Living Room",
    material: "Solid Wood, Fabric",
    dimensions: { width: 75, height: 80, depth: 85 },
    imageUrl:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=687&q=80", // Teal armchair
    images: [
      "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=687&q=80"
    ],
    stock: 10,
    rating: 4.9,
    numReviews: 31,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c21",
    name: "Acacia Wood Outdoor Bench",
    description:
      "Durable and stylish outdoor bench crafted from weather-resistant acacia wood. Perfect for patios, gardens, or entryways.",
    price: 280.0,
    category: "Outdoor",
    material: "Acacia Wood",
    dimensions: { width: 150, height: 90, depth: 60 },
    imageUrl:
      "https://images.unsplash.com/photo-1533377088493-e449f1a5dbb5?auto=format&fit=crop&w=1170&q=80", // Wooden bench
    images: [
      "https://images.unsplash.com/photo-1622372738946-62e02505feb3?auto=format&fit=crop&w=832&q=80",
      "https://images.unsplash.com/photo-1519323100972-6ff0677aaf9c?auto=format&fit=crop&w=1170&q=80"
    ],
    stock: 15,
    rating: 4.3,
    numReviews: 8,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c22",
    name: "Scandinavian Style Dining Chairs (Set of 2, White)",
    description:
      "Set of two minimalist dining chairs featuring a clean white molded seat and natural wood legs. Embodies Scandinavian simplicity.",
    price: 189.99,
    category: "Dining",
    material: "Polypropylene, Wood",
    dimensions: { width: 46, height: 82, depth: 53 },
    imageUrl:
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=687&q=80", // White dining chairs
    images: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1551298370-9d3d53740c72?auto=format&fit=crop&w=687&q=80"
    ],
    stock: 25,
    rating: 4.6,
    numReviews: 19,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c23",
    name: "Rustic Farmhouse TV Stand",
    description:
      "Charming TV stand with a rustic wood finish, sliding barn doors, and ample storage space for media consoles and accessories. Fits TVs up to 65 inches.",
    price: 399.0,
    category: "Living Room",
    material: "Engineered Wood, Metal Hardware",
    dimensions: { width: 150, height: 60, depth: 40 },
    imageUrl:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=687&q=80", // TV Stand / Console Table
    images: [
      "https://images.unsplash.com/photo-1616137148650-6c9931aa2d3e?auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=792&q=80"
    ],
    stock: 9,
    rating: 4.5,
    numReviews: 15,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c24",
    name: "Modern White Nightstand with Drawer",
    description:
      "Sleek and functional nightstand with a clean white finish, a spacious drawer, and an open shelf for bedside essentials.",
    price: 129.5,
    category: "Bedroom",
    material: "Engineered Wood",
    dimensions: { width: 45, height: 55, depth: 40 },
    imageUrl:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=687&q=80", // White nightstand - FIXED
    images: [
      "https://images.unsplash.com/photo-1617325710236-4a36c5a7f3f3?auto=format&fit=crop&w=1171&q=80",
      "https://images.unsplash.com/photo-1611967164521-abae8fba4668?auto=format&fit=crop&w=765&q=80"
    ],
    stock: 35,
    rating: 4.4,
    numReviews: 10,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c25",
    name: "Leather Club Chair (Brown)",
    description:
      "Classic brown leather club chair offering timeless style and comfort. Features plush cushioning and durable faux leather upholstery.",
    price: 550.0,
    category: "Living Room",
    material: "Faux Leather, Wood Frame",
    dimensions: { width: 90, height: 80, depth: 85 },
    imageUrl:
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=792&q=80", // Leather chair
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=765&q=80",
      "https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?auto=format&fit=crop&w=765&q=80"
    ],
    stock: 6,
    rating: 4.7,
    numReviews: 17,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c26",
    name: "Adjustable Standing Desk (White)",
    description:
      "Electric height-adjustable standing desk with a spacious white top. Easily switch between sitting and standing positions for a healthier workday.",
    price: 480.0,
    category: "Office",
    material: "Engineered Wood, Steel Frame",
    dimensions: { width: 140, height: 70, depth: 60 },
    imageUrl:
      "https://images.unsplash.com/photo-1595515759241-cad70eb9b338?auto=format&fit=crop&w=1170&q=80", // Standing desk - FIXED
    images: [
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1491336477519-13c3a2e8afdf?auto=format&fit=crop&w=882&q=80"
    ],
    stock: 14,
    rating: 4.8,
    numReviews: 41,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c27",
    name: "Full Length Arched Floor Mirror",
    description:
      "Elegant full-length floor mirror with a stylish arched top and a thin metal frame. Perfect for bedrooms or entryways, adds light and space.",
    price: 210.0,
    category: "Bedroom",
    material: "Glass, Metal",
    dimensions: { width: 60, height: 160, depth: 3 },
    imageUrl:
      "https://images.unsplash.com/photo-1618220252344-88b9a1893d9f?auto=format&fit=crop&w=687&q=80", // Floor mirror
    images: [
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1632&q=80",
      "https://images.unsplash.com/photo-1581283177423-435356d0d659?auto=format&fit=crop&w=677&q=80"
    ],
    stock: 11,
    rating: 4.9,
    numReviews: 22,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c28",
    name: "Rattan Papasan Chair with Cushion",
    description:
      "Comfortable and iconic Papasan chair featuring a natural rattan frame and a plush, tufted cushion. Ideal for relaxing.",
    price: 315.0,
    category: "Living Room",
    material: "Rattan, Fabric Cushion",
    dimensions: { width: 100, height: 90, depth: 100 },
    imageUrl:
      "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=1109&q=80", // Rattan chair - FIXED
    images: [
      "https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1574620029132-cb0b0e2e853f?auto=format&fit=crop&w=687&q=80"
    ],
    stock: 7,
    rating: 4.6,
    numReviews: 13,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c29",
    name: "Wooden Dining Bench",
    description:
      "Simple and sturdy wooden dining bench with a natural finish. Pairs perfectly with various dining tables or can be used as entryway seating.",
    price: 175.0,
    category: "Dining",
    material: "Solid Wood",
    dimensions: { width: 140, height: 45, depth: 35 },
    imageUrl:
      "https://images.unsplash.com/photo-1604074131665-474a11ff1dfc?auto=format&fit=crop&w=1170&q=80", // Dining bench
    images: [
      "https://images.unsplash.com/photo-1588447566533-9d58ceaf4c01?auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1550304881-ef4d6f211e56?auto=format&fit=crop&w=1170&q=80"
    ],
    stock: 16,
    rating: 4.3,
    numReviews: 9,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c2a",
    name: "Outdoor Bistro Set (Table & 2 Chairs)",
    description:
      "Charming 3-piece outdoor bistro set including a small round table and two matching chairs. Perfect for balconies or small patios. Weather-resistant metal.",
    price: 229.99,
    category: "Outdoor",
    material: "Metal",
    dimensions: { width: 60, height: 70, depth: 60 },
    imageUrl:
      "https://images.unsplash.com/photo-1568491710033-91a11c353b8e?auto=format&fit=crop&w=735&q=80", // Bistro set
    images: [
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1573504816327-02ad0c1e7b38?auto=format&fit=crop&w=687&q=80"
    ],
    stock: 13,
    rating: 4.5,
    numReviews: 11,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c2b",
    name: "6-Drawer Dresser (White)",
    description:
      "Spacious 6-drawer dresser with a clean white finish and modern metal handles. Provides ample storage for clothing and bedroom essentials.",
    price: 450.0,
    category: "Bedroom",
    material: "Engineered Wood, Metal",
    dimensions: { width: 140, height: 80, depth: 45 },
    imageUrl:
      "https://images.unsplash.com/photo-1616627988031-f912e384aebb?auto=format&fit=crop&w=870&q=80", // White dresser
    images: [
      "https://images.unsplash.com/photo-1619596662224-7d0c07b8b4b9?auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1651557430122-82dd9549cd56?auto=format&fit=crop&w=687&q=80"
    ],
    stock: 10,
    rating: 4.2,
    numReviews: 7,
  },
  // Added more products with quality images
  {
    _id: "60c72b3f9b1d8e3f4c8e4c2c",
    name: "Modern Glass Dining Table",
    description:
      "Contemporary dining table featuring a tempered glass top with a sleek stainless steel base. Elegant yet durable design that seats 6 people comfortably.",
    price: 499.99,
    category: "Dining",
    material: "Tempered Glass, Stainless Steel",
    dimensions: { width: 180, height: 75, depth: 90 },
    imageUrl:
      "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=687&q=80", // Glass dining table
    images: [
      "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&w=688&q=80",
      "https://images.unsplash.com/photo-1592402990516-8f65f164d9c7?auto=format&fit=crop&w=1170&q=80"
    ],
    stock: 8,
    rating: 4.5,
    numReviews: 14,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c2d",
    name: "Velvet Accent Chair (Royal Blue)",
    description:
      "Luxurious royal blue velvet accent chair with gold metal legs. The perfect statement piece to add a touch of elegance to any living room or bedroom.",
    price: 329.99,
    category: "Living Room",
    material: "Velvet, Gold-finished Metal",
    dimensions: { width: 70, height: 85, depth: 75 },
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=958&q=80", // Blue velvet chair
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=765&q=80",
      "https://images.unsplash.com/photo-1611967164521-abae8fba4668?auto=format&fit=crop&w=765&q=80"
    ],
    stock: 12,
    rating: 4.8,
    numReviews: 23,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c2e",
    name: "Executive Desk with Drawers (Walnut)",
    description:
      "Professional executive desk with a rich walnut finish, featuring three drawers for storage and a spacious work surface. Ideal for home offices.",
    price: 599.99,
    category: "Office",
    material: "Engineered Wood, Walnut Veneer",
    dimensions: { width: 160, height: 76, depth: 80 },
    imageUrl:
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1170&q=80", // Executive desk
    images: [
      "https://images.unsplash.com/photo-1611074753737-bcc68a7e2149?auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1669193971300-5c4c9010fce0?auto=format&fit=crop&w=1035&q=80"
    ],
    stock: 10,
    rating: 4.7,
    numReviews: 19,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c2f",
    name: "Outdoor Wicker Lounge Chair",
    description:
      "Weather-resistant wicker lounge chair with plush cushions. Perfect for relaxing by the pool or on the patio. Durable aluminum frame for years of use.",
    price: 389.99,
    category: "Outdoor",
    material: "Synthetic Wicker, Aluminum, Water-resistant Fabric",
    dimensions: { width: 85, height: 90, depth: 160 },
    imageUrl:
      "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=687&q=80", // Outdoor lounge chair
    images: [
      "https://images.unsplash.com/photo-1533654793500-110ae91d6df9?auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1170&q=80"
    ],
    stock: 15,
    rating: 4.6,
    numReviews: 12,
  },
  {
    _id: "60c72b3f9b1d8e3f4c8e4c30",
    name: "King Size Upholstered Bed (Beige)",
    description:
      "Elegant king size bed with a tall, button-tufted headboard in neutral beige linen. The perfect centerpiece for a master bedroom.",
    price: 749.99,
    category: "Bedroom",
    material: "Solid Wood Frame, Linen Upholstery",
    dimensions: { width: 193, height: 120, depth: 214 },
    imageUrl:
      "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?auto=format&fit=crop&w=1171&q=80", // Beige bed
    images: [
      "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1074&q=80"
    ],
    stock: 5,
    rating: 4.9,
    numReviews: 28,
  }
];

module.exports = products;