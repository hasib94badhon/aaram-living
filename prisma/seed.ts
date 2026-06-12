/**
 * Aaram Living — Demo Seed
 * 15 categories · 150 products · realistic view-count distribution
 * Run: npx tsx prisma/seed.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["error"] });

// ── Utility ──────────────────────────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Weighted random viewCount: 10% viral, 30% trending, 60% low */
function randomViewCount(index: number, total: number): number {
  const position = index / total;
  if (position < 0.1) {
    // Viral: 100–1000
    return Math.floor(100 + Math.random() * 900);
  } else if (position < 0.4) {
    // Trending: 30–99
    return Math.floor(30 + Math.random() * 70);
  } else {
    // Low: 1–29
    return Math.floor(1 + Math.random() * 29);
  }
}

function rand(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function maybe(value: number, chance = 0.4): number | null {
  return Math.random() < chance ? value : null;
}

const NOW = new Date();

// ── Category definitions ───────────────────────────────────────────────────

const CATEGORY_DEFS = [
  { name: "Bedding & Pillows",       viewCount: rand(200, 900) },
  { name: "Kitchen & Cookware",      viewCount: rand(180, 750) },
  { name: "Home Decor",              viewCount: rand(300, 1100) },
  { name: "Living Room",             viewCount: rand(150, 600) },
  { name: "Curtains & Blinds",       viewCount: rand(100, 450) },
  { name: "Storage & Organization",  viewCount: rand(120, 500) },
  { name: "Bathroom Accessories",    viewCount: rand(90,  400) },
  { name: "Lighting",                viewCount: rand(200, 800) },
  { name: "Rugs & Carpets",          viewCount: rand(80,  350) },
  { name: "Garden & Plants",         viewCount: rand(70,  300) },
  { name: "Baby & Kids",             viewCount: rand(160, 650) },
  { name: "Electronics",             viewCount: rand(400, 1500) },
  { name: "Fashion & Clothing",      viewCount: rand(350, 1300) },
  { name: "Beauty & Skincare",       viewCount: rand(300, 1200) },
  { name: "Sports & Fitness",        viewCount: rand(200, 900) },
];

// ── Product definitions (10 per category, same order as CATEGORY_DEFS) ────

type ProductDef = {
  name: string;
  description: string;
  price: number;
  salePricePct?: number; // % discount, e.g. 20 → salePrice = price * 0.8
  stock: number;
};

const PRODUCTS_BY_CATEGORY: ProductDef[][] = [
  // 0 — Bedding & Pillows
  [
    { name: "Premium Cotton Pillow Cover Set (2 pcs)", description: "Soft 100% combed cotton pillow covers with envelope closure. Machine washable. Available in multiple colours.", price: 450, salePricePct: 20, stock: rand(20, 80) },
    { name: "King Size Microfiber Bedsheet Set", description: "4-piece king bedsheet set: flat sheet, fitted sheet, 2 pillow cases. 300 thread count microfiber.", price: 1200, stock: rand(15, 60) },
    { name: "Hollow Fibre Comforter – All Season", description: "Medium-weight duvet suitable for year-round comfort. Anti-allergenic hollow fibre fill. Machine washable.", price: 2200, salePricePct: 15, stock: rand(10, 40) },
    { name: "Orthopaedic Memory Foam Pillow", description: "Contour memory foam pillow for neck and shoulder support. Cool-gel layer on top. Comes with removable bamboo cover.", price: 1800, stock: rand(8, 30) },
    { name: "Waterproof Mattress Protector", description: "Breathable waterproof mattress cover with fitted skirt. Protects against dust mites, spills, and allergens.", price: 850, salePricePct: 10, stock: rand(20, 70) },
    { name: "Weighted Blanket 7 kg", description: "Deep-pressure therapy blanket filled with glass micro beads. Promotes relaxation and better sleep.", price: 3500, stock: rand(5, 20) },
    { name: "100% Cotton Fitted Sheet – Queen", description: "Snug-fit 200TC pure cotton fitted sheet with deep pocket for mattresses up to 30 cm thick.", price: 680, stock: rand(25, 90) },
    { name: "Velvet Embossed Throw Pillow Set (3 pcs)", description: "Decorative velvet cushion covers with geometric embossed pattern. Zip closure. Insert included.", price: 950, salePricePct: 25, stock: rand(15, 50) },
    { name: "U-Shape Travel Neck Pillow", description: "Ergonomic memory foam travel pillow with removable washable cover. Compact carry bag included.", price: 550, stock: rand(30, 100) },
    { name: "Bamboo Cooling Pillow", description: "Natural bamboo-derived pillow with cooling gel layer and shredded memory foam fill. Dust-mite resistant.", price: 1400, salePricePct: 12, stock: rand(10, 35) },
  ],

  // 1 — Kitchen & Cookware
  [
    { name: "Non-Stick Granite Frying Pan 26 cm", description: "Heavy-duty granite-coated non-stick pan with heat-resistant bakelite handle. Induction compatible.", price: 950, salePricePct: 20, stock: rand(20, 70) },
    { name: "Stainless Steel Pressure Cooker 5 L", description: "ISI-certified 5-litre pressure cooker with triple safety valve system. Extra-thick base.", price: 2200, stock: rand(10, 35) },
    { name: "Ceramic Cookware Set (5-piece)", description: "5-piece ceramic non-stick cooking set: 2 saucepans, 1 wok, 1 stockpot, 1 sauté pan. PFOA-free.", price: 4500, salePricePct: 18, stock: rand(5, 20) },
    { name: "Professional Chef Knife Set (6-piece)", description: "German stainless steel 6-piece knife set with ergonomic pakkawood handles. Includes knife block.", price: 3200, stock: rand(8, 25) },
    { name: "Bamboo Cutting Board with Juice Groove", description: "Extra-large organic bamboo cutting board with deep juice groove and non-slip rubber feet.", price: 680, salePricePct: 15, stock: rand(25, 80) },
    { name: "Rotating Spice Rack with 12 Jars", description: "Rotating countertop spice rack with 12 refillable glass jars and labels. Lazy-susan base.", price: 1100, stock: rand(15, 50) },
    { name: "Cast Iron Skillet 25 cm", description: "Pre-seasoned cast iron skillet suitable for stovetop, oven, and open-flame cooking.", price: 1800, salePricePct: 10, stock: rand(10, 30) },
    { name: "Glass Food Container Set (10-piece)", description: "Borosilicate glass meal-prep containers with snap-lock lids. Microwave, oven, and freezer safe.", price: 1650, stock: rand(15, 45) },
    { name: "Silicone Kitchen Utensil Set (8-piece)", description: "Heat-resistant silicone cooking tools: spatulas, ladle, tongs, whisk, and more. BPA-free.", price: 780, salePricePct: 20, stock: rand(20, 60) },
    { name: "Digital Electric Rice Cooker 1.8 L", description: "1.8-litre capacity rice cooker with steamer tray, keep-warm function, and non-stick inner pot.", price: 2800, stock: rand(12, 40) },
  ],

  // 2 — Home Decor
  [
    { name: "Handcrafted Pottery Vase Set (3 sizes)", description: "Artisan-made terracotta vases with matte glaze finish. Perfect for dried or fresh flowers.", price: 1200, salePricePct: 15, stock: rand(15, 50) },
    { name: "Soy Wax Scented Candle Set (4 pcs)", description: "Handpoured soy candles with wooden wicks in jasmine, sandalwood, rose, and vanilla scents.", price: 850, stock: rand(20, 70) },
    { name: "Minimalist Geometric Wall Clock", description: "Silent quartz wall clock with Nordic geometric design. Brushed gold hands, 30 cm diameter.", price: 1400, salePricePct: 20, stock: rand(10, 35) },
    { name: "Boho Macramé Wall Hanging", description: "Hand-knotted cotton macramé wall art with natural wood dowel. 60 cm wide × 80 cm long.", price: 1100, stock: rand(8, 25) },
    { name: "Wooden Photo Frame Set (6 sizes)", description: "Natural wood photo frames in 3R, 4R, 5R, 6R, A4, and A3 sizes. Hanging and standing options.", price: 950, salePricePct: 10, stock: rand(20, 60) },
    { name: "Realistic Artificial Succulent Arrangement", description: "Lifelike succulent assortment in a ceramic pot. Zero maintenance, perfect for desks and shelves.", price: 650, stock: rand(25, 80) },
    { name: "Handwoven Seagrass Storage Basket Set (3)", description: "Natural seagrass baskets with leather handle. Nesting design for compact storage.", price: 1600, salePricePct: 18, stock: rand(10, 30) },
    { name: "Abstract Canvas Wall Art (Triptych)", description: "3-panel canvas print in neutral tones. Ready to hang, gallery-wrapped edges. 120 × 40 cm total.", price: 2200, stock: rand(5, 18) },
    { name: "Speckled Terracotta Planter (Set of 3)", description: "Handmade terracotta planters with drainage holes and wooden saucers. Sizes: 8, 12, 16 cm.", price: 780, salePricePct: 12, stock: rand(15, 45) },
    { name: "Copper Fairy Light String (10 m)", description: "Warm white LED copper wire fairy lights with remote control and 8 lighting modes. USB powered.", price: 420, stock: rand(40, 120) },
  ],

  // 3 — Living Room
  [
    { name: "Chunky Knit Throw Blanket – Cream", description: "Oversized hand-knitted throw in 100% merino wool blend. 130 × 170 cm. Perfect for cosy evenings.", price: 2800, salePricePct: 22, stock: rand(10, 35) },
    { name: "Marble-Effect Coffee Table Tray Set", description: "Geometric tray set in white marble effect with gold rim. Includes 3 nested trays.", price: 1100, stock: rand(15, 45) },
    { name: "Velvet Cushion Cover Set (4 pcs) – Sage Green", description: "Luxury velvet cushion covers in sage green with gold zip. 45 × 45 cm. Inserts included.", price: 1600, salePricePct: 20, stock: rand(15, 50) },
    { name: "Sofa Armrest Organizer with Cup Holder", description: "Multi-pocket sofa arm caddy in canvas fabric. Holds remote, phone, books, and drinks.", price: 480, stock: rand(30, 90) },
    { name: "Mid-Century Modern Bookends (Pair)", description: "Cast iron bookends with matte black powder coating. Holds 30+ books. Non-scratch base.", price: 750, salePricePct: 10, stock: rand(20, 60) },
    { name: "Rattan Side Table with Open Shelf", description: "Handwoven rattan side table with lower storage shelf. Suitable for indoor/outdoor use.", price: 3200, stock: rand(6, 18) },
    { name: "Non-Slip Reading Chair Cushion Pad", description: "Extra-thick memory foam chair pad with non-slip base. Removable washable cover in linen blend.", price: 680, stock: rand(20, 65) },
    { name: "Floating TV Unit with Cable Management", description: "Wall-mounted TV stand for screens up to 60 inches. Hidden cable channels and 2 open shelves.", price: 8500, salePricePct: 15, stock: rand(3, 12) },
    { name: "Hanging Wicker Planter Basket", description: "Handwoven wicker planter with jute rope hanger and coir liner. 25 cm diameter.", price: 550, stock: rand(25, 75) },
    { name: "Velvet Footstool Ottoman with Storage", description: "Square storage ottoman with velvet top. Internal storage, removable tray lid. 40 × 40 cm.", price: 2400, salePricePct: 20, stock: rand(8, 22) },
  ],

  // 4 — Curtains & Blinds
  [
    { name: "Blackout Eyelet Curtains (Pair) – 140×250 cm", description: "Triple-weave blackout curtains blocking 99% of light. Thermal insulating. Ring-top heading.", price: 2200, salePricePct: 20, stock: rand(10, 40) },
    { name: "Sheer Voile Curtain Panel – White", description: "Lightweight semi-sheer voile panel for soft light diffusion. Rod pocket heading. 140 × 260 cm.", price: 750, stock: rand(20, 65) },
    { name: "Natural Bamboo Roman Blind – 60×160 cm", description: "Hand-crafted bamboo Roman blind with cord-free mechanism. Easy fit inside or outside recess.", price: 1800, salePricePct: 15, stock: rand(12, 35) },
    { name: "Luxury Velvet Curtain Set (Pair) – Dusty Rose", description: "Floor-length velvet pinch pleat curtains with blackout lining. Weighted hem for perfect drape.", price: 3800, stock: rand(6, 18) },
    { name: "Cotton Linen Blend Curtains (Pair) – Natural", description: "Breathable linen-cotton blend, semi-opaque. Grommet top for smooth gliding. 140 × 240 cm.", price: 1600, salePricePct: 12, stock: rand(15, 45) },
    { name: "Magnetic Fly Screen – 90×210 cm", description: "Easy-fit magnetic mesh fly screen with 26 embedded magnets. Self-closing. Cut-to-fit design.", price: 480, stock: rand(25, 80) },
    { name: "Day & Night Roller Blind – 90×180 cm", description: "Alternating sheer and opaque bands for adjustable privacy and light control. No tools needed.", price: 2200, salePricePct: 18, stock: rand(8, 25) },
    { name: "Café Tier Half-Window Curtain", description: "Charming café-style half-curtain for kitchen and bathroom windows. Rod pocket top, 60 cm drop.", price: 420, stock: rand(30, 90) },
    { name: "Thermal Insulated Curtains (Pair) – Grey", description: "3-layer foam-backed curtains reducing heat loss by up to 40%. Grommets for standard rods.", price: 2800, salePricePct: 20, stock: rand(8, 25) },
    { name: "Patterned Floral Sheer Curtain (Pair)", description: "Delicate embroidered floral pattern on sheer fabric. Rod pocket heading, 140 × 230 cm.", price: 1200, stock: rand(15, 45) },
  ],

  // 5 — Storage & Organization
  [
    { name: "Foldable Storage Box Set (5 pcs)", description: "Collapsible fabric storage boxes with lid, windows, and label holder. Stackable design.", price: 850, salePricePct: 15, stock: rand(20, 70) },
    { name: "Under-Bed Storage Bag Set (4 pcs)", description: "Large zipper-closure clear window bags for under-bed storage. Protects from dust and moisture.", price: 620, stock: rand(25, 80) },
    { name: "Adjustable Wardrobe Shelf Dividers (6-pack)", description: "Spring-tension shelf dividers for wooden closet shelves. Adjustable from 25 to 35 cm.", price: 480, salePricePct: 10, stock: rand(30, 100) },
    { name: "Over-Cabinet Door Organizer", description: "Hang-over cabinet door spice organizer with 4 adjustable tiers. No screws or tools needed.", price: 650, stock: rand(20, 60) },
    { name: "Bamboo Bathroom Countertop Organizer", description: "3-tier bamboo bathroom organizer for cotton pads, toothbrush, skincare. Moisture resistant.", price: 880, salePricePct: 20, stock: rand(15, 50) },
    { name: "Drawer Divider Set (12-piece)", description: "Adjustable bamboo drawer dividers for kitchen, bedroom, and office. Fits drawers 30–80 cm wide.", price: 720, stock: rand(25, 75) },
    { name: "Double-Rod Hanging Closet Organizer", description: "Portable wardrobe organizer with 2 hanging rods, 5 shelves, and 2 shoe pockets. 160 cm tall.", price: 1800, salePricePct: 18, stock: rand(8, 25) },
    { name: "Clear Stackable Storage Bins (6-pack)", description: "BPA-free clear plastic bins with smooth-glide drawers. Ideal for fridge, pantry, and desk.", price: 950, stock: rand(20, 60) },
    { name: "4-Drawer Wooden Filing Cabinet", description: "A4 filing cabinet in natural pine with label holders and smooth ball-bearing runners.", price: 5500, salePricePct: 12, stock: rand(3, 10) },
    { name: "Shoe Rack Bench with Cushion Top", description: "3-tier shoe rack with padded fabric cushion bench top. Holds 9 pairs. Assembly required.", price: 2200, stock: rand(6, 18) },
  ],

  // 6 — Bathroom Accessories
  [
    { name: "Egyptian Cotton Towel Set (6-piece)", description: "Premium 600 GSM Egyptian cotton towel set: 2 bath, 2 hand, 2 face towels. Fast-drying.", price: 2800, salePricePct: 22, stock: rand(10, 35) },
    { name: "Natural Bamboo Non-Slip Bath Mat", description: "Eco-friendly solid bamboo bath mat with non-slip rubber feet. Water-resistant. 45 × 75 cm.", price: 950, stock: rand(15, 50) },
    { name: "PEVA Shower Curtain with 12 Hooks", description: "Water-repellent PEVA shower curtain with geometric print. Rust-proof grommet rings. 180 × 200 cm.", price: 580, salePricePct: 15, stock: rand(20, 65) },
    { name: "4-Cup Wall-Mount Toothbrush Holder", description: "Stainless steel wall-mounted toothbrush and paste holder with drainage holes. SUS304 grade.", price: 480, stock: rand(25, 80) },
    { name: "Foaming Soap Dispenser Set (3-piece)", description: "Touch-free pump soap dispensers in matte white ceramic. Includes 3 labelled bottles.", price: 750, salePricePct: 10, stock: rand(15, 55) },
    { name: "Adjustable Over-Door Towel Rack", description: "Stainless steel over-door towel bar with 4 hooks. No drilling required. Holds 6 towels.", price: 620, stock: rand(20, 60) },
    { name: "Bamboo Corner Bathroom Shelf (3-tier)", description: "Freestanding bamboo corner shelf for bathroom. Adjustable tier heights. Moisture treated.", price: 1100, salePricePct: 18, stock: rand(10, 30) },
    { name: "Rattan Laundry Hamper with Lid", description: "Large handwoven rattan laundry basket with cloth liner and hinged wooden lid. 60 L capacity.", price: 1800, stock: rand(8, 22) },
    { name: "Expandable Bath Caddy Tray", description: "Rust-proof aluminium bath tray extending 65–90 cm. Adjustable soap dish and book/tablet rest.", price: 880, salePricePct: 15, stock: rand(12, 40) },
    { name: "Memory Foam Anti-Fatigue Bath Mat", description: "Non-slip memory foam bath mat with diatomite surface for rapid moisture absorption. 50 × 80 cm.", price: 780, stock: rand(20, 60) },
  ],

  // 7 — Lighting
  [
    { name: "LED Architect Desk Lamp with USB Port", description: "Eye-care LED desk lamp with 5 colour temperatures, 10 brightness levels, and USB-A charging port.", price: 2200, salePricePct: 20, stock: rand(12, 40) },
    { name: "Ultra-Slim LED Ceiling Panel 60×60 cm", description: "24W flat LED panel with warm white + cool white dual colour. Flicker-free driver included.", price: 3200, stock: rand(8, 25) },
    { name: "Tripod Floor Lamp – Walnut & Linen", description: "Nordic-style tripod floor lamp with linen drum shade and walnut-stained wood legs. E27 socket.", price: 4500, salePricePct: 15, stock: rand(5, 15) },
    { name: "Dimmable Bedside Touch Table Lamp", description: "3-level touch dimmer lamp with gold base and white linen shade. Memory function on/off.", price: 1600, stock: rand(15, 45) },
    { name: "Solar Garden Path Lights (8-pack)", description: "Stainless steel solar LED pathway lights. Auto on/off at dusk. IP65 waterproof. Warm white.", price: 1800, salePricePct: 18, stock: rand(10, 30) },
    { name: "USB Rechargeable LED Night Light", description: "Magnetic LED puck light with motion sensor. Rechargeable via USB-C. 3 brightness modes.", price: 480, stock: rand(35, 100) },
    { name: "Industrial Edison Bulb Pendant Light", description: "Vintage brass pendant with exposed spiral filament E27 bulb. 2-metre fabric cord with dimmer.", price: 2800, salePricePct: 12, stock: rand(8, 22) },
    { name: "Smart LED Colour-Changing Bulb E27", description: "16 million colours WiFi smart bulb compatible with Alexa and Google Home. 9W / 800 lumens.", price: 1200, stock: rand(20, 60) },
    { name: "Under-Cabinet LED Strip Light Kit 1 m", description: "Self-adhesive LED strip with touch dimmer and plug-in driver. Warm white, cut-to-size.", price: 650, salePricePct: 20, stock: rand(25, 75) },
    { name: "Large Himalayan Salt Lamp 4–5 kg", description: "Natural pink Himalayan salt lamp with dimmer switch. Warm amber glow, air-purifying properties.", price: 1800, stock: rand(10, 30) },
  ],

  // 8 — Rugs & Carpets
  [
    { name: "Bohemian Kilim Area Rug 160×230 cm", description: "Flatweave Turkish-inspired kilim rug with geometric pattern in terracotta and navy. Cotton backing.", price: 4500, salePricePct: 20, stock: rand(5, 15) },
    { name: "Non-Slip Entrance Door Mat 60×90 cm", description: "Coir-face door mat with PVC non-slip backing. 'Home' text. Scrapes mud from footwear.", price: 380, stock: rand(40, 120) },
    { name: "Shaggy Bedroom Rug 120×170 cm – Ivory", description: "Ultra-plush 5 cm pile shaggy rug in cream-ivory. Anti-shed, anti-static. Underlay recommended.", price: 2800, salePricePct: 18, stock: rand(8, 22) },
    { name: "Handwoven Natural Jute Area Rug 150×200 cm", description: "Chunky-weave jute rug with cotton border. Natural earth tones. Reversible for extended wear.", price: 3200, stock: rand(5, 15) },
    { name: "Modern Geometric Tufted Rug 120×180 cm", description: "Machine-tufted polypropylene rug with bold geometric print. Easy-clean, stain-resistant.", price: 2200, salePricePct: 15, stock: rand(8, 25) },
    { name: "Non-Slip Kitchen Anti-Fatigue Mat 45×120 cm", description: "Cushioned anti-fatigue kitchen mat with non-slip backing and waterproof surface. Washable.", price: 680, stock: rand(20, 65) },
    { name: "Stair Carpet Runner 66×450 cm – Grey", description: "Non-slip stair runner in herringbone pattern. Comes with 14 carpet rods. Cut to length.", price: 2800, salePricePct: 12, stock: rand(5, 15) },
    { name: "Outdoor All-Weather Patio Rug 180×270 cm", description: "UV-resistant polypropylene flat-weave rug for outdoor use. Hose-clean, mildew-resistant.", price: 3800, stock: rand(4, 12) },
    { name: "Memory Foam Bath Rug 50×80 cm – Navy", description: "Contoured memory foam bath mat with non-slip latex backing. Quick-dry microfibre top.", price: 580, salePricePct: 10, stock: rand(25, 75) },
    { name: "Velvet Prayer Mat with Foam Padding", description: "Thick foam-padded prayer rug with anti-slip base. Machine washable. 65 × 120 cm.", price: 780, stock: rand(30, 90) },
  ],

  // 9 — Garden & Plants
  [
    { name: "Ceramic Planter Pot Set – Speckled (3 pcs)", description: "Glazed speckled ceramic pots with drainage holes and matching saucers. Sizes 10, 14, 18 cm.", price: 980, salePricePct: 15, stock: rand(15, 45) },
    { name: "Hanging Coco Liner Plant Basket 35 cm", description: "Galvanised wire hanging basket with coir liner. Includes 2.5 m rust-proof hanging chain.", price: 450, stock: rand(25, 80) },
    { name: "Premium Succulent & Cactus Soil Mix 5 L", description: "Ready-to-use gritty soil mix with perlite, coarse sand, and peat. pH 6–7. 5 litre bag.", price: 350, salePricePct: 10, stock: rand(30, 90) },
    { name: "Copper Watering Can 2 L", description: "Classic copper-finish steel watering can with long narrow spout. Ideal for indoor plants.", price: 1200, stock: rand(12, 40) },
    { name: "Bamboo Plant Support Stakes Set (50 pcs)", description: "Natural bamboo garden stakes 90 cm tall. Pack of 50. For tomatoes, climbing plants, seedlings.", price: 280, stock: rand(40, 130) },
    { name: "Stackable Worm Composting Bin", description: "4-layer worm bin composter for kitchen scraps. Includes worm tea tap and ventilation system.", price: 2200, salePricePct: 18, stock: rand(5, 15) },
    { name: "Indoor Herb Growing Kit – 6 Seeds", description: "Complete kit with biodegradable pots, seed discs (basil, mint, coriander, chilli, parsley, thyme), and instructions.", price: 650, stock: rand(20, 65) },
    { name: "Decorative River Pebbles 1 kg – White", description: "Smooth polished white river stones for plant pot decoration, aquarium, or garden path edging.", price: 220, salePricePct: 12, stock: rand(50, 150) },
    { name: "Self-Watering Planter Box 60 cm", description: "Modern rectangular planter with built-in water reservoir and level indicator. 3-litre capacity.", price: 1600, stock: rand(8, 25) },
    { name: "Expandable Trellis Panel 180×90 cm", description: "Natural cedar wood expandable trellis for climbing plants. Extends 30–180 cm. UV-treated.", price: 880, salePricePct: 15, stock: rand(12, 35) },
  ],

  // 10 — Baby & Kids
  [
    { name: "Organic Muslin Baby Swaddle Set (3 pcs)", description: "100% GOTS organic cotton muslin swaddle blankets 120 × 120 cm. Hypoallergenic, pre-washed.", price: 1200, salePricePct: 18, stock: rand(15, 50) },
    { name: "Interlocking EVA Foam Play Mat (36 tiles)", description: "36-tile foam floor mat (2.3 m × 2.3 m coverage). BPA-free EVA foam, 1 cm thick. Easy clean.", price: 2200, stock: rand(8, 25) },
    { name: "Musical Crib Mobile with Night Light", description: "Rotating crib mobile with 5 plush animals, 12 lullabies, and warm LED night light. USB powered.", price: 1800, salePricePct: 20, stock: rand(10, 30) },
    { name: "Solid Rubber Wood Step Stool for Kids", description: "2-step toddler step stool with non-slip rubber treads. Supports up to 60 kg. Natural wood.", price: 850, stock: rand(15, 45) },
    { name: "Collapsible Toy Storage Bin (Large)", description: "Extra-large canvas toy chest with removable lid and sturdy rope handles. 60 L capacity.", price: 780, salePricePct: 12, stock: rand(20, 65) },
    { name: "BPA-Free Silicone Baby Bib Set (5 pcs)", description: "Soft waterproof silicone bibs with deep food catcher pocket. Adjustable snap neck closure.", price: 680, stock: rand(25, 75) },
    { name: "Baby Nail Care Grooming Kit (8-piece)", description: "Safe baby grooming set: nail clippers, file, tweezers, brush, comb, thermometer. Carry case.", price: 580, salePricePct: 15, stock: rand(20, 60) },
    { name: "Foldable Kids Canvas Teepee Tent", description: "Cotton canvas teepee with wooden poles, roll-up door, and window. Easy assembly. 120 cm tall.", price: 3200, stock: rand(5, 15) },
    { name: "Waterproof Fitted Crib Mattress Protector", description: "Organic cotton surface, waterproof TPU backing. Fits standard cot mattress 120 × 60 cm.", price: 680, salePricePct: 10, stock: rand(20, 55) },
    { name: "Wooden Alphabet & Number Puzzle Board", description: "36-piece hardwood letter and number puzzle with colourful illustrations. Suitable 2+ years.", price: 750, stock: rand(20, 65) },
  ],

  // 11 — Electronics
  [
    { name: "Portable Bluetooth 5.0 Speaker 20W", description: "20W true wireless stereo speaker, IPX7 waterproof, 18-hour battery. Party light mode.", price: 3800, salePricePct: 22, stock: rand(10, 35) },
    { name: "Smart Table Fan with Remote & Timer", description: "DC inverter table fan with 12 speed settings, sleep mode, and app control. Ultra-quiet.", price: 4200, stock: rand(8, 20) },
    { name: "Digital Kitchen Scale 10 kg / 1 g", description: "Precision stainless steel scale with tare function and large backlit display. USB chargeable.", price: 980, salePricePct: 15, stock: rand(20, 60) },
    { name: "7-in-1 USB-C Hub with 4K HDMI", description: "Compact USB-C hub: 4K HDMI, 3× USB-A 3.0, SD/TF card, PD 100W charging passthrough.", price: 2200, stock: rand(12, 40) },
    { name: "15W Wireless Charging Pad – Slim", description: "Qi-certified fast wireless charger compatible with all Qi devices. 3 mm ultra-slim design.", price: 1200, salePricePct: 20, stock: rand(20, 65) },
    { name: "WiFi Smart Plug with Energy Monitor", description: "16A smart socket with real-time power monitoring, scheduling, and voice control support.", price: 880, stock: rand(25, 80) },
    { name: "Smart RGB LED Strip 5 m with App Control", description: "Bluetooth app-controlled LED strip with music sync. 16 million colours, DIY modes.", price: 1400, salePricePct: 18, stock: rand(15, 50) },
    { name: "Ultrasonic Cool-Mist Air Humidifier 4 L", description: "Whisper-quiet humidifier with essential oil tray, sleep mode, and auto-shutoff. 4-litre tank.", price: 2800, stock: rand(8, 25) },
    { name: "Hybrid ANC Wireless Earbuds", description: "Active noise-cancelling earbuds with 32-hour total battery, IPX5 water resistance, and aptX.", price: 5500, salePricePct: 12, stock: rand(6, 20) },
    { name: "Portable Power Bank 20000 mAh – 65W PD", description: "22.5W + PD 65W dual output power bank. Charges laptops, phones, tablets. LCD display.", price: 4800, stock: rand(8, 25) },
  ],

  // 12 — Fashion & Clothing
  [
    { name: "Premium Cotton Panjabi – Men's", description: "Soft Supima cotton panjabi with intricate embroidery on collar and cuffs. Regular fit. S–3XL.", price: 1800, salePricePct: 20, stock: rand(20, 70) },
    { name: "Women's Cotton Loungewear Set", description: "Matching top and trouser set in soft cotton-spandex blend. 6 colours. S to XXL.", price: 1200, stock: rand(25, 80) },
    { name: "Embroidered Anarkali Kurti – Women's", description: "Flared Anarkali kurti with hand-embroidered yoke in rayon-cotton blend. Length 48 inches.", price: 2200, salePricePct: 18, stock: rand(15, 50) },
    { name: "Men's Classic Oxford Dress Shirt", description: "Easy-iron Oxford-weave dress shirt with button-down collar. Regular fit. 100% cotton.", price: 1600, stock: rand(20, 60) },
    { name: "Handloom Jamdani Saree", description: "Traditional Bangladeshi Jamdani saree in soft cotton with intricate woven motifs. Blouse included.", price: 5500, salePricePct: 10, stock: rand(8, 22) },
    { name: "Polar Fleece Hooded Jacket – Unisex", description: "Anti-pill polar fleece zip-up hoodie with 2 zip pockets. Lightweight warmth. S–2XL.", price: 2200, salePricePct: 25, stock: rand(15, 45) },
    { name: "100% Cotton Crew-Neck T-Shirt 3-Pack", description: "Pack of 3 premium cotton tees in white, grey, and black. Pre-shrunk, tagless. S to XXL.", price: 980, stock: rand(40, 120) },
    { name: "Men's Linen Blend Cargo Shorts", description: "Summer cargo shorts in linen-cotton blend with 6 pockets. Elastic waistband with drawcord.", price: 880, salePricePct: 15, stock: rand(20, 65) },
    { name: "Premium Cashmere-Touch Winter Scarf", description: "Acrylic-cashmere blend scarf, 30 × 180 cm. Generous fringe ends. 12 colours available.", price: 1100, stock: rand(20, 60) },
    { name: "Organic Cotton Ankle Socks 5-Pack", description: "GOTS-certified organic cotton socks with arch support and reinforced heel/toe. Mixed colours.", price: 580, salePricePct: 12, stock: rand(35, 100) },
  ],

  // 13 — Beauty & Skincare
  [
    { name: "20% Vitamin C + E Brightening Serum 30 ml", description: "Stable L-ascorbic acid serum with vitamin E and ferulic acid. Reduces pigmentation and brightens.", price: 1800, salePricePct: 20, stock: rand(15, 50) },
    { name: "Hyaluronic Acid Hydrating Moisturiser 50 ml", description: "Lightweight gel-cream with 3-weight hyaluronic acid. Plumps, hydrates, and smooths. All skin types.", price: 1600, stock: rand(20, 60) },
    { name: "10% Niacinamide + Zinc Balancing Toner 150 ml", description: "Alcohol-free toner targeting enlarged pores and excess oil. Suitable for oily/combination skin.", price: 1200, salePricePct: 15, stock: rand(20, 60) },
    { name: "Rose Quartz Facial Massage Roller & Gua Sha", description: "Genuine rose quartz roller and gua sha set. Reduces puffiness and promotes lymphatic drainage.", price: 950, stock: rand(25, 75) },
    { name: "Tinted SPF 50 Sunscreen + Moisturiser 50 ml", description: "Daily broad-spectrum SPF 50 PA++++ sunscreen with light tint. Non-greasy, reef-safe formula.", price: 1400, salePricePct: 18, stock: rand(15, 50) },
    { name: "Natural Lip Balm Gift Set (6 pcs)", description: "Beeswax and shea butter lip balms in strawberry, mint, rose, vanilla, honey, and coconut.", price: 680, stock: rand(30, 90) },
    { name: "Kaolin Clay & Activated Charcoal Face Mask 100 ml", description: "Deep-cleansing clay mask drawing out impurities and minimising pores. Suitable weekly use.", price: 980, salePricePct: 12, stock: rand(20, 65) },
    { name: "Keratin Protein Hair Repair Mask 200 ml", description: "Intensive keratin treatment mask for damaged, frizzy hair. Sulfate-free. Apply weekly.", price: 1100, stock: rand(15, 45) },
    { name: "Bulgarian Rose Water Facial Toner 250 ml", description: "Pure steam-distilled rose water with no additives. Balances pH and soothes after cleansing.", price: 750, salePricePct: 10, stock: rand(25, 75) },
    { name: "Cold-Pressed Organic Virgin Coconut Oil 200 ml", description: "100% organic cold-pressed coconut oil for hair, skin, and cooking. Hexane-free, unrefined.", price: 620, stock: rand(30, 90) },
  ],

  // 14 — Sports & Fitness
  [
    { name: "Extra-Thick Non-Slip Yoga Mat 6 mm", description: "6 mm TPE yoga mat with alignment lines, non-slip surface, and carry strap. 183 × 61 cm.", price: 1600, salePricePct: 20, stock: rand(15, 50) },
    { name: "Resistance Band Set – 5 Levels", description: "5-piece latex resistance loop bands (extra-light to extra-heavy). Carry bag and guide included.", price: 780, stock: rand(25, 80) },
    { name: "Adjustable Dumbbell Pair 2–10 kg", description: "Single-pin weight adjustment from 2 to 10 kg per dumbbell. Space-saving design. ABS cradle.", price: 6500, salePricePct: 15, stock: rand(5, 15) },
    { name: "Speed Jump Rope with Ball Bearings", description: "Tangle-free steel cable with sealed ball bearings and adjustable length. Foam grip handles.", price: 480, stock: rand(35, 100) },
    { name: "EVA Foam Roller for Muscle Recovery 45 cm", description: "High-density EVA foam roller for myofascial release. Grid pattern for targeted massage.", price: 950, salePricePct: 12, stock: rand(20, 60) },
    { name: "Double-Wall Insulated Sports Water Bottle 1 L", description: "Stainless steel vacuum-insulated bottle. Keeps cold 24 h / hot 12 h. BPA-free, leakproof.", price: 1200, stock: rand(20, 70) },
    { name: "Breathable Weight Training Gloves", description: "Neoprene palm padding with wrist wrap support. Adjustable velcro closure. S/M/L/XL.", price: 680, salePricePct: 18, stock: rand(20, 60) },
    { name: "Ankle Weight Set 2 × 1.5 kg", description: "Adjustable Velcro ankle weights for walking, yoga, and leg exercises. Machine washable.", price: 780, stock: rand(20, 60) },
    { name: "Ab Roller Wheel with Knee Pad", description: "Dual-wheel ab roller with extra-wide track for stability. Comes with foam knee pad.", price: 650, salePricePct: 15, stock: rand(20, 65) },
    { name: "Smart Fitness Tracker Band", description: "1.3-inch colour display, heart rate, SpO2, sleep tracking, 10-day battery. IP68 waterproof.", price: 2800, stock: rand(10, 35) },
  ],
];

// ── Main seed function ─────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting Aaram Living demo seed…\n");

  // Wipe existing data (safe for dev only)
  console.log("🗑  Clearing existing data…");
  await prisma.productImage.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log("   Done.\n");

  // ── Create categories ────────────────────────────────────────────────────
  console.log("📂 Creating categories…");
  const createdCategories: { id: number; name: string }[] = [];

  for (const def of CATEGORY_DEFS) {
    const slug = toSlug(def.name);
    const cat = await prisma.category.create({
      data: {
        name: def.name,
        slug,
        viewCount: def.viewCount,
        updatedAt: NOW,
      },
      select: { id: true, name: true },
    });
    createdCategories.push(cat);
    process.stdout.write(`   ✓ ${def.name}\n`);
  }

  // ── Build all products with shuffled view counts ─────────────────────────
  console.log("\n🛍  Generating 150 products…");

  // Flatten all products first so we can assign viewCounts by global rank
  type FlatProduct = ProductDef & { categoryId: number; categoryName: string };
  const flat: FlatProduct[] = [];

  for (let ci = 0; ci < PRODUCTS_BY_CATEGORY.length; ci++) {
    const category = createdCategories[ci];
    for (const p of PRODUCTS_BY_CATEGORY[ci]) {
      flat.push({ ...p, categoryId: category.id, categoryName: category.name });
    }
  }

  // Shuffle so view-count distribution is not category-biased
  for (let i = flat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flat[i], flat[j]] = [flat[j], flat[i]];
  }

  // Assign viewCounts by position (position 0 = highest = viral tier)
  const withViews = flat.map((p, i) => ({
    ...p,
    viewCount: randomViewCount(i, flat.length),
  }));

  // ── Insert products and images ───────────────────────────────────────────
  let created = 0;
  const slugCounts: Record<string, number> = {};

  for (const p of withViews) {
    // Build unique slug
    let baseSlug = toSlug(p.name);
    slugCounts[baseSlug] = (slugCounts[baseSlug] ?? 0) + 1;
    const slug =
      slugCounts[baseSlug] > 1
        ? `${baseSlug}-${slugCounts[baseSlug]}`
        : baseSlug;

    const salePrice =
      p.salePricePct != null
        ? Math.round(p.price * (1 - p.salePricePct / 100))
        : null;

    // Deterministic placeholder image via picsum.photos
    const imageUrl = `https://picsum.photos/seed/${slug}/480/480`;

    await prisma.product.create({
      data: {
        name: p.name,
        slug,
        description: p.description,
        price: p.price,
        salePrice,
        stock: p.stock,
        isActive: true,
        isFeatured: p.viewCount >= 80,
        viewCount: p.viewCount,
        categoryId: p.categoryId,
        updatedAt: NOW,
        images: {
          create: {
            url: imageUrl,
            altText: p.name,
            isPrimary: true,
          },
        },
      },
    });

    created++;
    if (created % 10 === 0) {
      process.stdout.write(`   ${created}/150 products created…\n`);
    }
  }

  console.log(`   ✓ All ${created} products created.\n`);

  // ── Verification report ──────────────────────────────────────────────────
  console.log("📊 Verification report:");

  const stats = await prisma.$queryRaw<
    { tier: string; count: bigint; avg_views: number }[]
  >`
    SELECT
      CASE
        WHEN viewCount >= 100 THEN 'viral   (≥100 views)'
        WHEN viewCount >= 30  THEN 'trending (30–99 views)'
        ELSE                       'low      (1–29 views)'
      END AS tier,
      COUNT(*) AS count,
      ROUND(AVG(viewCount), 1) AS avg_views
    FROM Product
    GROUP BY tier
    ORDER BY avg_views DESC;
  `;

  for (const row of stats) {
    console.log(
      `   ${row.tier}: ${row.count} products  (avg ${row.avg_views} views)`
    );
  }

  const topProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { viewCount: "desc" },
    select: { name: true, viewCount: true, category: { select: { name: true } } },
  });

  console.log("\n🔥 Top 5 trending products:");
  topProducts.forEach((p, i) =>
    console.log(`   ${i + 1}. ${p.name} — ${p.viewCount} views (${p.category.name})`)
  );

  const topCats = await prisma.category.findMany({
    take: 5,
    orderBy: { viewCount: "desc" },
    select: { name: true, viewCount: true },
  });

  console.log("\n📂 Top 5 categories by visits:");
  topCats.forEach((c, i) =>
    console.log(`   ${i + 1}. ${c.name} — ${c.viewCount} visits`)
  );

  // Integrity checks
  const orphans = await prisma.product.count({
    where: { category: { is: undefined } },
  });
  const noImage = await prisma.product.count({
    where: { images: { none: {} } },
  });

  console.log("\n✅ Integrity checks:");
  console.log(`   Orphan products (no category): ${orphans}`);
  console.log(`   Products with no image:        ${noImage}`);
  console.log(`   Total products: ${created}`);
  console.log(`   Total categories: ${createdCategories.length}`);
  console.log("\n🎉 Seed complete — ready for demo!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
