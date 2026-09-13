export const INITIAL_CATEGORIES = [
  // Primary Featured Cards (shown as the 2 large cards)
  {
    id: 'cat_ethnic',
    slug: 'ethnic-wear',
    name: 'ETHNIC WEAR',
    subtitle: 'Timeless Tradition',
    displayType: 'featured_card',
    color: '#8A5D3B',
    bgColor: '#EDE3D8',
    description: 'Heritage silhouettes, rich textures and intricate hand embroidery for festive and cultural grace.',
    order: 1,
    placeholderKey: 'ethnic_featured'
  },
  {
    id: 'cat_western',
    slug: 'western-wear',
    name: 'WESTERN WEAR',
    subtitle: 'Everyday Essentials',
    displayType: 'featured_card',
    color: '#3B4A54',
    bgColor: '#E5E7EB',
    description: 'Bespoke tailoring, breathable natural linens, relaxed fits and effortless contemporary styles.',
    order: 2,
    placeholderKey: 'western_featured'
  },

  // Circular subcategories (shown in the circular row)
  {
    id: 'cat_kurtas',
    slug: 'kurtas-sets',
    name: 'Kurtas & Sets',
    subtitle: 'Pure Comfort',
    displayType: 'circular_pill',
    color: '#8B4836',
    bgColor: '#F5E6E1',
    description: 'Handcrafted kurtas, palazzos, and dupatta ensembles.',
    order: 3,
    placeholderKey: 'kurta'
  },
  {
    id: 'cat_tops',
    slug: 'tops-shirts',
    name: 'Tops & Shirts',
    subtitle: 'Smart Casuals',
    displayType: 'circular_pill',
    color: '#434B54',
    bgColor: '#E6ECF0',
    description: 'Crisp button-downs, effortless tunics and relaxed tops.',
    order: 4,
    placeholderKey: 'top'
  },
  {
    id: 'cat_sarees',
    slug: 'sarees',
    name: 'Sarees',
    subtitle: 'Six Yards of Grace',
    displayType: 'circular_pill',
    color: '#9E476A',
    bgColor: '#FCEEF3',
    description: 'Chanderi, organza, georgette and festive silks.',
    order: 5,
    placeholderKey: 'saree'
  },
  {
    id: 'cat_bottoms',
    slug: 'bottoms',
    name: 'Bottoms',
    subtitle: 'Flawless Fit',
    displayType: 'circular_pill',
    color: '#7D6A53',
    bgColor: '#EFEBE4',
    description: 'Pleated trousers, cotton culottes, and palazzo pants.',
    order: 6,
    placeholderKey: 'bottom'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    slug: 'dusty-rose-embroidered-anarkali-ensemble',
    title: 'Dusty Rose Embroidered Anarkali Ensemble',
    subtitle: 'Hand-detailed mirror & thread work',
    categorySlug: 'ethnic-wear',
    subCategorySlug: 'kurtas-sets',
    price: 3499,
    originalPrice: 4699,
    tag: 'Bestseller',
    badgeColor: 'bg-[#926749]',
    sku: 'KW-ANAR-01',
    inStock: true,
    description: 'A tribute to artisanal craftsmanship, this dusty rose silhouette is hand-embroidered with delicate zari, mirror work, and tonal resham thread work on the yoke. Cut in an ethereal kalidar flare with breathable mulmul cotton lining, it includes a matching churidar and a soft, scalloped organza dupatta with hand-beaded borders.',
    fabric: 'Cotton Silk Blend with 100% Butter Cotton Lining',
    care: 'Dry clean only to maintain delicate zari hand-work. Store in a muslin cloth bag.',
    fit: 'Relaxed kalidar silhouette with fitted bodice. Model is 5\'8" wearing size S.',
    placeholderKey: 'hero_anarkali',
    gallery: ['hero_anarkali', 'ethnic_featured', 'kurta'],
    featured: true
  },
  {
    id: 'prod_2',
    slug: 'mustard-ochre-chanderi-zari-kurti',
    title: 'Mustard Ochre Chanderi Zari Kurti',
    subtitle: 'Regal festive elegance',
    categorySlug: 'ethnic-wear',
    subCategorySlug: 'kurtas-sets',
    price: 2699,
    originalPrice: 3499,
    tag: 'Trending',
    badgeColor: 'bg-[#A7734D]',
    sku: 'KW-CHAN-02',
    inStock: true,
    description: 'Crafted in authentic handloom Chanderi silk, this vibrant mustard ochre kurti features delicate golden zari bootis woven into the fabric. The split V-neckline is highlighted with antique gota lace and fine pearl detailing, making it ideal for haldi ceremonies and festive lunches.',
    fabric: 'Pure Handloom Chanderi Silk',
    care: 'Gentle dry clean recommended. Cool iron on reverse.',
    fit: 'Straight cut kurti with side slits. Model is 5\'7" wearing size S.',
    placeholderKey: 'ethnic_featured',
    gallery: ['ethnic_featured', 'kurta', 'hero_anarkali'],
    featured: true
  },
  {
    id: 'prod_3',
    slug: 'crisp-alabaster-linen-boyfriend-shirt',
    title: 'Crisp Alabaster Linen Boyfriend Shirt',
    subtitle: 'Relaxed minimalist daily staple',
    categorySlug: 'western-wear',
    subCategorySlug: 'tops-shirts',
    price: 1899,
    originalPrice: 2499,
    tag: 'Essential',
    badgeColor: 'bg-[#4B5563]',
    sku: 'KW-LINN-03',
    inStock: true,
    description: 'The foundation of an effortless wardrobe. Made from premium washed French organic linen that grows softer with every wear. Tailored with dropped shoulders, elongated cuffs, natural mother-of-pearl buttons, and a curved hemline that tucks seamlessly into trousers or denims.',
    fabric: '100% Certified Organic French Linen',
    care: 'Machine wash delicate cycle in cold water. Line dry in shade. Warm steam iron.',
    fit: 'Oversized boyfriend cut. Size down for a more structured fit.',
    placeholderKey: 'western_featured',
    gallery: ['western_featured', 'top', 'bottom'],
    featured: true
  },
  {
    id: 'prod_4',
    slug: 'rose-quartz-organza-tissue-saree',
    title: 'Rose Quartz Organza Tissue Saree',
    subtitle: 'Soft drapes with antique border',
    categorySlug: 'ethnic-wear',
    subCategorySlug: 'sarees',
    price: 4599,
    originalPrice: 5999,
    tag: 'Heritage',
    badgeColor: 'bg-[#9E476A]',
    sku: 'KW-SREE-04',
    inStock: true,
    description: 'An enchanting six yards woven in tissue organza, shimmering softly in ambient light. Adorned with delicate floral jaal needlework along the pallu and finished with scalloped antique gold thread borders. Comes with an unstitched pure silk blouse piece with coordinating sleeve borders.',
    fabric: 'Pure Silk Tissue Organza with Zari Weave',
    care: 'Strictly dry clean only. Do not bleach or machine wash.',
    fit: 'Standard 5.5m drape with 0.8m running unstitched blouse piece.',
    placeholderKey: 'saree',
    gallery: ['saree', 'hero_anarkali', 'ethnic_featured'],
    featured: true
  },
  {
    id: 'prod_5',
    slug: 'tailored-camel-pleated-wide-leg-trousers',
    title: 'Tailored Camel Pleated Wide-Leg Trousers',
    subtitle: 'High-waisted architectural cut',
    categorySlug: 'western-wear',
    subCategorySlug: 'bottoms',
    price: 2299,
    originalPrice: 2899,
    tag: 'Stylist Pick',
    badgeColor: 'bg-[#7D6A53]',
    sku: 'KW-PANT-05',
    inStock: true,
    description: 'A masterclass in modern tailoring. High-rise trousers featuring crisp front pleats, slant pockets, a clean blind-hemmed finish, and a wide-leg fluid silhouette that elongates the frame. Style with tucked blouses or tailored blazers for timeless elegance.',
    fabric: 'Poly-Viscose Comfort Stretch Twill',
    care: 'Machine wash cold inside out or dry clean for sharpest crease.',
    fit: 'High rise, wide leg silhouette with tailored waistband.',
    placeholderKey: 'bottom',
    gallery: ['bottom', 'western_featured', 'top'],
    featured: false
  },
  {
    id: 'prod_6',
    slug: 'rust-terracotta-pintuck-tunic-kurta',
    title: 'Rust Terracotta Pintuck Tunic Kurta',
    subtitle: 'Everyday artisanal comfort',
    categorySlug: 'ethnic-wear',
    subCategorySlug: 'kurtas-sets',
    price: 1799,
    originalPrice: 2299,
    tag: 'New Arrival',
    badgeColor: 'bg-[#8B4836]',
    sku: 'KW-KURT-06',
    inStock: true,
    description: 'Effortless short tunic kurta in rustic terracotta, handspun from slub khadi cotton. Features micro pintucks across the front placket, mandarin collar, side slits, and handcrafted wooden buttons. Pair with tapered linen pants or favorite denims.',
    fabric: '100% Handloom Slub Khadi Cotton',
    care: 'Hand wash with mild detergent in cold water. Dry in shade.',
    fit: 'Regular fit short tunic. Hip length.',
    placeholderKey: 'kurta',
    gallery: ['kurta', 'hero_anarkali', 'bottom'],
    featured: false
  }
];

export const INITIAL_CONFIG = {
  storeName: 'KUNDAN WORKS',
  tagline: 'WEAR YOUR STORY',
  subHeading: 'Tradition Meets Everyday Style',
  heroSubtitle: 'Elegant outfits for every you.',
  promoBanner: 'FLAT ₹500 OFF on your first order',
  whatsappNumber: '+91 98765 43210',
  supportEmail: 'contact@kundanworks.com',
  shonkuWebDetails: {
    agencyName: 'ShonkuWEB Technologies',
    role: 'Official Digital Partner & Payment Gateway Integrator',
    status: 'Sandbox Catalog Mode',
    applicationContact: '+91 98300 00000',
    email: 'team@shonkuweb.com',
    leadTime: 'Instant 24-48h Activation',
    featuresOffered: [
      'Seamless Razorpay, Cashfree & PhonePe UPI Integration',
      'Automated WhatsApp and SMS Order Confirmation',
      'Instant GST Compliant Tax Invoices',
      'Realtime Inventory and Logistics Tracking API'
    ]
  }
};

export const INITIAL_ORDERS = [
  {
    id: 'KW-1001',
    date: '12 Sep 2026',
    customerName: 'Ananya Sharma',
    phone: '9876543210',
    shippingAddress: '42 Heritage Enclave, Civil Lines, Jaipur, Rajasthan 302006',
    currentStep: 4, // 1: Placed, 2: Crafting, 3: Shipped, 4: Out for Delivery, 5: Delivered
    status: 'out_for_delivery',
    statusTitle: 'Out for Delivery',
    statusDescription: 'Your artisanal ensemble is out for delivery with courier associate.',
    courierName: 'Bluedart Express Air',
    awbNumber: 'BD-849201982',
    estimatedDelivery: 'Today by 6:00 PM',
    items: [
      {
        productId: 'prod_1',
        title: 'Dusty Rose Embroidered Anarkali Ensemble',
        size: 'M',
        quantity: 1,
        price: 3499,
        placeholderKey: 'hero_anarkali'
      }
    ],
    subtotal: 3499,
    discount: 500,
    total: 2999,
    paymentMethod: 'Prepaid (ShonkuWEB Gateway Demo)'
  },
  {
    id: 'KW-1002',
    date: '13 Sep 2026',
    customerName: 'Priya Verma',
    phone: '9811122334',
    shippingAddress: 'Flat 304, Palm Grove Towers, Bandra West, Mumbai 400050',
    currentStep: 2,
    status: 'crafting',
    statusTitle: 'Artisanal Crafting & Inspection',
    statusDescription: 'Master embroiderers are hand-finishing the zari motifs and inspecting stitches.',
    courierName: 'Express Courier Assigned',
    awbNumber: 'KW-EXP-2026',
    estimatedDelivery: 'Thursday, 18th Sep',
    items: [
      {
        productId: 'prod_2',
        title: 'Mustard Ochre Chanderi Zari Kurti',
        size: 'S',
        quantity: 1,
        price: 2699,
        placeholderKey: 'ethnic_featured'
      }
    ],
    subtotal: 2699,
    discount: 500,
    total: 2199,
    paymentMethod: 'Stylist WhatsApp Booking'
  },
  {
    id: 'KW-1003',
    date: '08 Sep 2026',
    customerName: 'Rohan Mehra',
    phone: '9988776655',
    shippingAddress: 'B-12, Green Park Main, New Delhi 110016',
    currentStep: 5,
    status: 'delivered',
    statusTitle: 'Delivered',
    statusDescription: 'Package handed over to recipient. Signature verified.',
    courierName: 'Delhivery Surface Plus',
    awbNumber: 'DL-908123145',
    estimatedDelivery: 'Delivered on 11 Sep',
    items: [
      {
        productId: 'prod_3',
        title: 'Crisp Alabaster Linen Boyfriend Shirt',
        size: 'L',
        quantity: 1,
        price: 1899,
        placeholderKey: 'western_featured'
      }
    ],
    subtotal: 1899,
    discount: 500,
    total: 1399,
    paymentMethod: 'Prepaid'
  }
];
