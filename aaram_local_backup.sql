-- MySQL dump 10.13  Distrib 9.6.0, for macos26.4 (arm64)
--
-- Host: localhost    Database: aaram_local
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '2b9dea0a-666b-11f1-a619-bb299a88dcb7:1-296';

--
-- Table structure for table `Address`
--

DROP TABLE IF EXISTS `Address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `fullName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `line1` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postalCode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Address_userId_fkey` (`userId`),
  CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Address`
--

LOCK TABLES `Address` WRITE;
/*!40000 ALTER TABLE `Address` DISABLE KEYS */;
INSERT INTO `Address` VALUES (1,1,'Hasibur rahman','01679374433','aparajita','dhaka','Dhaka',NULL,0,'2026-06-12 16:14:56.033');
/*!40000 ALTER TABLE `Address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Cart`
--

DROP TABLE IF EXISTS `Cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Cart_userId_key` (`userId`),
  CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cart`
--

LOCK TABLES `Cart` WRITE;
/*!40000 ALTER TABLE `Cart` DISABLE KEYS */;
INSERT INTO `Cart` VALUES (1,1,'2026-06-12 16:08:48.680','2026-06-12 16:08:48.680');
/*!40000 ALTER TABLE `Cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CartItem`
--

DROP TABLE IF EXISTS `CartItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CartItem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cartId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `CartItem_cartId_productId_key` (`cartId`,`productId`),
  KEY `CartItem_productId_fkey` (`productId`),
  CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CartItem`
--

LOCK TABLES `CartItem` WRITE;
/*!40000 ALTER TABLE `CartItem` DISABLE KEYS */;
INSERT INTO `CartItem` VALUES (2,1,10,1);
/*!40000 ALTER TABLE `CartItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `viewCount` int NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_slug_key` (`slug`),
  KEY `Category_parentId_fkey` (`parentId`),
  KEY `Category_viewCount_idx` (`viewCount` DESC),
  CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (1,'Bedding & Pillows','bedding-pillows',NULL,NULL,NULL,'2026-06-12 15:24:37.809','2026-06-12 16:09:30.254',815,0),(2,'Kitchen & Cookware','kitchen-cookware',NULL,NULL,NULL,'2026-06-12 15:24:37.811','2026-06-12 16:09:34.922',507,0),(3,'Home Decor','home-decor',NULL,NULL,NULL,'2026-06-12 15:24:37.812','2026-06-12 16:09:33.719',570,0),(4,'Living Room','living-room',NULL,NULL,NULL,'2026-06-12 15:24:37.813','2026-06-12 16:09:36.157',248,0),(5,'Curtains & Blinds','curtains-blinds',NULL,NULL,NULL,'2026-06-12 15:24:37.814','2026-06-12 16:09:30.811',269,0),(6,'Storage & Organization','storage-organization',NULL,NULL,NULL,'2026-06-12 15:24:37.815','2026-06-12 16:09:38.435',434,0),(7,'Bathroom Accessories','bathroom-accessories',NULL,NULL,NULL,'2026-06-12 15:24:37.815','2026-06-12 16:09:28.948',382,0),(8,'Lighting','lighting',NULL,NULL,NULL,'2026-06-12 15:24:37.816','2026-06-12 16:09:35.545',469,0),(9,'Rugs & Carpets','rugs-carpets',NULL,NULL,NULL,'2026-06-12 15:24:37.817','2026-06-12 16:09:36.703',240,0),(10,'Garden & Plants','garden-plants',NULL,NULL,NULL,'2026-06-12 15:24:37.817','2026-06-12 16:09:33.154',187,0),(11,'Baby & Kids','baby-kids',NULL,NULL,NULL,'2026-06-12 15:24:37.818','2026-06-12 16:09:28.373',237,0),(12,'Electronics','electronics',NULL,NULL,NULL,'2026-06-12 15:24:37.818','2026-06-12 16:09:31.482',573,0),(13,'Fashion & Clothing','fashion-clothing',NULL,NULL,NULL,'2026-06-12 15:24:37.819','2026-06-12 16:09:32.393',478,0),(14,'Beauty & Skincare','beauty-skincare',NULL,NULL,NULL,'2026-06-12 15:24:37.820','2026-06-12 16:09:29.713',457,0),(15,'Sports & Fitness','sports-fitness',NULL,NULL,NULL,'2026-06-12 15:24:37.820','2026-06-12 16:09:37.309',673,0),(16,'Survival kit','survival-kit',NULL,NULL,NULL,'2026-06-12 16:01:37.086','2026-06-12 16:29:56.626',10,1);
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Order`
--

DROP TABLE IF EXISTS `Order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int NOT NULL,
  `addressId` int DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `subtotal` decimal(10,2) NOT NULL,
  `shippingCost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Order_orderNumber_key` (`orderNumber`),
  KEY `Order_userId_fkey` (`userId`),
  KEY `Order_addressId_fkey` (`addressId`),
  CONSTRAINT `Order_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Order`
--

LOCK TABLES `Order` WRITE;
/*!40000 ALTER TABLE `Order` DISABLE KEYS */;
INSERT INTO `Order` VALUES (1,'AL-20260612-5947',1,1,'CONFIRMED',8940.00,80.00,9020.00,'adfkjnvadfnvakdjf','2026-06-12 16:14:56.038','2026-06-12 16:15:49.882');
/*!40000 ALTER TABLE `Order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderItem`
--

DROP TABLE IF EXISTS `OrderItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderItem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `productId` int NOT NULL,
  `productName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `OrderItem_orderId_fkey` (`orderId`),
  KEY `OrderItem_productId_fkey` (`productId`),
  CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderItem`
--

LOCK TABLES `OrderItem` WRITE;
/*!40000 ALTER TABLE `OrderItem` DISABLE KEYS */;
INSERT INTO `OrderItem` VALUES (1,1,151,'Emergency Survival kit',2235.00,4,8940.00);
/*!40000 ALTER TABLE `OrderItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payment`
--

DROP TABLE IF EXISTS `Payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `method` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'bkash',
  `status` enum('PENDING','COMPLETED','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `amount` decimal(10,2) NOT NULL,
  `bkashNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transactionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verifiedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Payment_orderId_key` (`orderId`),
  UNIQUE KEY `Payment_transactionId_key` (`transactionId`),
  CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payment`
--

LOCK TABLES `Payment` WRITE;
/*!40000 ALTER TABLE `Payment` DISABLE KEYS */;
INSERT INTO `Payment` VALUES (1,1,'bkash','PENDING',9020.00,'01679374433','354140341357',NULL,'2026-06-12 16:14:56.040','2026-06-12 16:14:56.040');
/*!40000 ALTER TABLE `Payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `salePrice` decimal(10,2) DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `sku` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `categoryId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `viewCount` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Product_slug_key` (`slug`),
  UNIQUE KEY `Product_sku_key` (`sku`),
  KEY `Product_categoryId_fkey` (`categoryId`),
  KEY `Product_viewCount_idx` (`viewCount` DESC),
  KEY `Product_isActive_viewCount_idx` (`isActive`,`viewCount` DESC),
  CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product`
--

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
INSERT INTO `Product` VALUES (1,'Professional Chef Knife Set (6-piece)','professional-chef-knife-set-6-piece','German stainless steel 6-piece knife set with ergonomic pakkawood handles. Includes knife block.',3200.00,NULL,25,NULL,1,1,2,'2026-06-12 15:24:37.821','2026-06-12 15:24:37.409',128),(2,'100% Cotton Crew-Neck T-Shirt 3-Pack','100-cotton-crew-neck-t-shirt-3-pack','Pack of 3 premium cotton tees in white, grey, and black. Pre-shrunk, tagless. S to XXL.',980.00,NULL,56,NULL,1,1,13,'2026-06-12 15:24:37.823','2026-06-12 15:24:37.409',622),(3,'Over-Cabinet Door Organizer','over-cabinet-door-organizer','Hang-over cabinet door spice organizer with 4 adjustable tiers. No screws or tools needed.',650.00,NULL,42,NULL,1,1,6,'2026-06-12 15:24:37.824','2026-06-12 15:24:37.409',865),(4,'Realistic Artificial Succulent Arrangement','realistic-artificial-succulent-arrangement','Lifelike succulent assortment in a ceramic pot. Zero maintenance, perfect for desks and shelves.',650.00,NULL,39,NULL,1,1,3,'2026-06-12 15:24:37.825','2026-06-12 15:24:37.409',100),(5,'Handwoven Seagrass Storage Basket Set (3)','handwoven-seagrass-storage-basket-set-3','Natural seagrass baskets with leather handle. Nesting design for compact storage.',1600.00,1312.00,22,NULL,1,1,3,'2026-06-12 15:24:37.826','2026-06-12 15:24:37.409',830),(6,'Expandable Bath Caddy Tray','expandable-bath-caddy-tray','Rust-proof aluminium bath tray extending 65–90 cm. Adjustable soap dish and book/tablet rest.',880.00,748.00,36,NULL,1,1,7,'2026-06-12 15:24:37.827','2026-06-12 15:24:37.409',659),(7,'Indoor Herb Growing Kit – 6 Seeds','indoor-herb-growing-kit-6-seeds','Complete kit with biodegradable pots, seed discs (basil, mint, coriander, chilli, parsley, thyme), and instructions.',650.00,NULL,25,NULL,1,1,10,'2026-06-12 15:24:37.828','2026-06-12 15:24:37.409',154),(8,'Industrial Edison Bulb Pendant Light','industrial-edison-bulb-pendant-light','Vintage brass pendant with exposed spiral filament E27 bulb. 2-metre fabric cord with dimmer.',2800.00,2464.00,9,NULL,1,1,8,'2026-06-12 15:24:37.829','2026-06-12 15:24:37.409',444),(9,'Speed Jump Rope with Ball Bearings','speed-jump-rope-with-ball-bearings','Tangle-free steel cable with sealed ball bearings and adjustable length. Foam grip handles.',480.00,NULL,90,NULL,1,1,15,'2026-06-12 15:24:37.830','2026-06-12 15:24:37.409',953),(10,'Ceramic Cookware Set (5-piece)','ceramic-cookware-set-5-piece','5-piece ceramic non-stick cooking set: 2 saucepans, 1 wok, 1 stockpot, 1 sauté pan. PFOA-free.',4500.00,3690.00,5,NULL,1,1,2,'2026-06-12 15:24:37.831','2026-06-12 16:21:42.466',925),(11,'Ultra-Slim LED Ceiling Panel 60×60 cm','ultra-slim-led-ceiling-panel-60-60-cm','24W flat LED panel with warm white + cool white dual colour. Flicker-free driver included.',3200.00,NULL,11,NULL,1,1,8,'2026-06-12 15:24:37.831','2026-06-12 15:24:37.409',912),(12,'Tripod Floor Lamp – Walnut & Linen','tripod-floor-lamp-walnut-linen','Nordic-style tripod floor lamp with linen drum shade and walnut-stained wood legs. E27 socket.',4500.00,3825.00,8,NULL,1,1,8,'2026-06-12 15:24:37.832','2026-06-12 15:24:37.409',660),(13,'Stackable Worm Composting Bin','stackable-worm-composting-bin','4-layer worm bin composter for kitchen scraps. Includes worm tea tap and ventilation system.',2200.00,1804.00,7,NULL,1,1,10,'2026-06-12 15:24:37.834','2026-06-12 15:24:37.409',146),(14,'Stainless Steel Pressure Cooker 5 L','stainless-steel-pressure-cooker-5-l','ISI-certified 5-litre pressure cooker with triple safety valve system. Extra-thick base.',2200.00,NULL,34,NULL,1,1,2,'2026-06-12 15:24:37.835','2026-06-12 15:24:37.409',603),(15,'Portable Power Bank 20000 mAh – 65W PD','portable-power-bank-20000-mah-65w-pd','22.5W + PD 65W dual output power bank. Charges laptops, phones, tablets. LCD display.',4800.00,NULL,8,NULL,1,1,12,'2026-06-12 15:24:37.836','2026-06-12 15:24:37.409',820),(16,'Cast Iron Skillet 25 cm','cast-iron-skillet-25-cm','Pre-seasoned cast iron skillet suitable for stovetop, oven, and open-flame cooking.',1800.00,1620.00,13,NULL,1,1,2,'2026-06-12 15:24:37.837','2026-06-12 15:24:37.409',97),(17,'Collapsible Toy Storage Bin (Large)','collapsible-toy-storage-bin-large','Extra-large canvas toy chest with removable lid and sturdy rope handles. 60 L capacity.',780.00,686.00,64,NULL,1,0,11,'2026-06-12 15:24:37.838','2026-06-12 15:24:37.409',40),(18,'Hybrid ANC Wireless Earbuds','hybrid-anc-wireless-earbuds','Active noise-cancelling earbuds with 32-hour total battery, IPX5 water resistance, and aptX.',5500.00,4840.00,7,NULL,1,0,12,'2026-06-12 15:24:37.838','2026-06-12 15:24:37.409',43),(19,'Digital Kitchen Scale 10 kg / 1 g','digital-kitchen-scale-10-kg-1-g','Precision stainless steel scale with tare function and large backlit display. USB chargeable.',980.00,833.00,51,NULL,1,0,12,'2026-06-12 15:24:37.839','2026-06-12 15:24:37.409',59),(20,'Smart RGB LED Strip 5 m with App Control','smart-rgb-led-strip-5-m-with-app-control','Bluetooth app-controlled LED strip with music sync. 16 million colours, DIY modes.',1400.00,1148.00,49,NULL,1,1,12,'2026-06-12 15:24:37.840','2026-06-12 15:24:37.409',93),(21,'Interlocking EVA Foam Play Mat (36 tiles)','interlocking-eva-foam-play-mat-36-tiles','36-tile foam floor mat (2.3 m × 2.3 m coverage). BPA-free EVA foam, 1 cm thick. Easy clean.',2200.00,NULL,14,NULL,1,1,11,'2026-06-12 15:24:37.841','2026-06-12 15:24:37.409',83),(22,'Bohemian Kilim Area Rug 160×230 cm','bohemian-kilim-area-rug-160-230-cm','Flatweave Turkish-inspired kilim rug with geometric pattern in terracotta and navy. Cotton backing.',4500.00,3600.00,12,NULL,1,1,9,'2026-06-12 15:24:37.841','2026-06-12 15:24:37.409',81),(23,'Ankle Weight Set 2 × 1.5 kg','ankle-weight-set-2-1-5-kg','Adjustable Velcro ankle weights for walking, yoga, and leg exercises. Machine washable.',780.00,NULL,32,NULL,1,0,15,'2026-06-12 15:24:37.842','2026-06-12 15:24:37.409',48),(24,'Café Tier Half-Window Curtain','caf-tier-half-window-curtain','Charming café-style half-curtain for kitchen and bathroom windows. Rod pocket top, 60 cm drop.',420.00,NULL,41,NULL,1,0,5,'2026-06-12 15:24:37.843','2026-06-12 15:24:37.409',73),(25,'Ceramic Planter Pot Set – Speckled (3 pcs)','ceramic-planter-pot-set-speckled-3-pcs','Glazed speckled ceramic pots with drainage holes and matching saucers. Sizes 10, 14, 18 cm.',980.00,833.00,34,NULL,1,0,10,'2026-06-12 15:24:37.843','2026-06-12 15:24:37.409',51),(26,'Magnetic Fly Screen – 90×210 cm','magnetic-fly-screen-90-210-cm','Easy-fit magnetic mesh fly screen with 26 embedded magnets. Self-closing. Cut-to-fit design.',480.00,NULL,47,NULL,1,0,5,'2026-06-12 15:24:37.844','2026-06-12 15:24:37.409',55),(27,'Luxury Velvet Curtain Set (Pair) – Dusty Rose','luxury-velvet-curtain-set-pair-dusty-rose','Floor-length velvet pinch pleat curtains with blackout lining. Weighted hem for perfect drape.',3800.00,NULL,15,NULL,1,1,5,'2026-06-12 15:24:37.846','2026-06-12 15:24:37.409',93),(28,'Foldable Kids Canvas Teepee Tent','foldable-kids-canvas-teepee-tent','Cotton canvas teepee with wooden poles, roll-up door, and window. Easy assembly. 120 cm tall.',3200.00,NULL,5,NULL,1,0,11,'2026-06-12 15:24:37.847','2026-06-12 15:24:37.409',70),(29,'Shoe Rack Bench with Cushion Top','shoe-rack-bench-with-cushion-top','3-tier shoe rack with padded fabric cushion bench top. Holds 9 pairs. Assembly required.',2200.00,NULL,17,NULL,1,0,6,'2026-06-12 15:24:37.847','2026-06-12 15:27:56.993',74),(30,'Non-Stick Granite Frying Pan 26 cm','non-stick-granite-frying-pan-26-cm','Heavy-duty granite-coated non-stick pan with heat-resistant bakelite handle. Induction compatible.',950.00,760.00,43,NULL,1,0,2,'2026-06-12 15:24:37.848','2026-06-12 15:24:37.409',33),(31,'Memory Foam Anti-Fatigue Bath Mat','memory-foam-anti-fatigue-bath-mat','Non-slip memory foam bath mat with diatomite surface for rapid moisture absorption. 50 × 80 cm.',780.00,NULL,28,NULL,1,0,7,'2026-06-12 15:24:37.849','2026-06-12 15:24:37.409',31),(32,'Floating TV Unit with Cable Management','floating-tv-unit-with-cable-management','Wall-mounted TV stand for screens up to 60 inches. Hidden cable channels and 2 open shelves.',8500.00,7225.00,7,NULL,1,0,4,'2026-06-12 15:24:37.850','2026-06-12 15:24:37.409',74),(33,'Non-Slip Reading Chair Cushion Pad','non-slip-reading-chair-cushion-pad','Extra-thick memory foam chair pad with non-slip base. Removable washable cover in linen blend.',680.00,NULL,57,NULL,1,0,4,'2026-06-12 15:24:37.851','2026-06-12 15:24:37.409',48),(34,'Men\'s Linen Blend Cargo Shorts','men-s-linen-blend-cargo-shorts','Summer cargo shorts in linen-cotton blend with 6 pockets. Elastic waistband with drawcord.',880.00,748.00,34,NULL,1,0,13,'2026-06-12 15:24:37.852','2026-06-12 15:24:37.409',36),(35,'Weighted Blanket 7 kg','weighted-blanket-7-kg','Deep-pressure therapy blanket filled with glass micro beads. Promotes relaxation and better sleep.',3500.00,NULL,11,NULL,1,0,1,'2026-06-12 15:24:37.853','2026-06-12 15:24:37.409',68),(36,'Baby Nail Care Grooming Kit (8-piece)','baby-nail-care-grooming-kit-8-piece','Safe baby grooming set: nail clippers, file, tweezers, brush, comb, thermometer. Carry case.',580.00,493.00,33,NULL,1,1,11,'2026-06-12 15:24:37.854','2026-06-12 15:24:37.409',94),(37,'Wooden Photo Frame Set (6 sizes)','wooden-photo-frame-set-6-sizes','Natural wood photo frames in 3R, 4R, 5R, 6R, A4, and A3 sizes. Hanging and standing options.',950.00,855.00,32,NULL,1,0,3,'2026-06-12 15:24:37.854','2026-06-12 15:24:37.409',68),(38,'Ultrasonic Cool-Mist Air Humidifier 4 L','ultrasonic-cool-mist-air-humidifier-4-l','Whisper-quiet humidifier with essential oil tray, sleep mode, and auto-shutoff. 4-litre tank.',2800.00,NULL,20,NULL,1,0,12,'2026-06-12 15:24:37.855','2026-06-12 15:24:37.409',48),(39,'Copper Fairy Light String (10 m)','copper-fairy-light-string-10-m','Warm white LED copper wire fairy lights with remote control and 8 lighting modes. USB powered.',420.00,NULL,91,NULL,1,0,3,'2026-06-12 15:24:37.856','2026-06-12 15:24:37.409',32),(40,'WiFi Smart Plug with Energy Monitor','wifi-smart-plug-with-energy-monitor','16A smart socket with real-time power monitoring, scheduling, and voice control support.',880.00,NULL,58,NULL,1,1,12,'2026-06-12 15:24:37.858','2026-06-12 15:24:37.409',88),(41,'Resistance Band Set – 5 Levels','resistance-band-set-5-levels','5-piece latex resistance loop bands (extra-light to extra-heavy). Carry bag and guide included.',780.00,NULL,76,NULL,1,0,15,'2026-06-12 15:24:37.859','2026-06-12 15:24:37.409',66),(42,'Sofa Armrest Organizer with Cup Holder','sofa-armrest-organizer-with-cup-holder','Multi-pocket sofa arm caddy in canvas fabric. Holds remote, phone, books, and drinks.',480.00,NULL,34,NULL,1,1,4,'2026-06-12 15:24:37.860','2026-06-12 15:24:37.409',95),(43,'Expandable Trellis Panel 180×90 cm','expandable-trellis-panel-180-90-cm','Natural cedar wood expandable trellis for climbing plants. Extends 30–180 cm. UV-treated.',880.00,748.00,29,NULL,1,0,10,'2026-06-12 15:24:37.861','2026-06-12 15:24:37.409',36),(44,'USB Rechargeable LED Night Light','usb-rechargeable-led-night-light','Magnetic LED puck light with motion sensor. Rechargeable via USB-C. 3 brightness modes.',480.00,NULL,96,NULL,1,0,8,'2026-06-12 15:24:37.862','2026-06-12 15:24:37.409',61),(45,'Outdoor All-Weather Patio Rug 180×270 cm','outdoor-all-weather-patio-rug-180-270-cm','UV-resistant polypropylene flat-weave rug for outdoor use. Hose-clean, mildew-resistant.',3800.00,NULL,11,NULL,1,0,9,'2026-06-12 15:24:37.862','2026-06-12 15:24:37.409',73),(46,'Handcrafted Pottery Vase Set (3 sizes)','handcrafted-pottery-vase-set-3-sizes','Artisan-made terracotta vases with matte glaze finish. Perfect for dried or fresh flowers.',1200.00,1020.00,27,NULL,1,1,3,'2026-06-12 15:24:37.863','2026-06-12 15:24:37.409',94),(47,'Keratin Protein Hair Repair Mask 200 ml','keratin-protein-hair-repair-mask-200-ml','Intensive keratin treatment mask for damaged, frizzy hair. Sulfate-free. Apply weekly.',1100.00,NULL,29,NULL,1,0,14,'2026-06-12 15:24:37.863','2026-06-12 15:24:37.409',40),(48,'Bamboo Plant Support Stakes Set (50 pcs)','bamboo-plant-support-stakes-set-50-pcs','Natural bamboo garden stakes 90 cm tall. Pack of 50. For tomatoes, climbing plants, seedlings.',280.00,NULL,111,NULL,1,1,10,'2026-06-12 15:24:37.864','2026-06-12 15:24:37.409',94),(49,'EVA Foam Roller for Muscle Recovery 45 cm','eva-foam-roller-for-muscle-recovery-45-cm','High-density EVA foam roller for myofascial release. Grid pattern for targeted massage.',950.00,836.00,49,NULL,1,0,15,'2026-06-12 15:24:37.865','2026-06-12 15:24:37.409',78),(50,'Natural Lip Balm Gift Set (6 pcs)','natural-lip-balm-gift-set-6-pcs','Beeswax and shea butter lip balms in strawberry, mint, rose, vanilla, honey, and coconut.',680.00,NULL,80,NULL,1,0,14,'2026-06-12 15:24:37.865','2026-06-12 15:24:37.409',64),(51,'Portable Bluetooth 5.0 Speaker 20W','portable-bluetooth-5-0-speaker-20w','20W true wireless stereo speaker, IPX7 waterproof, 18-hour battery. Party light mode.',3800.00,2964.00,28,NULL,1,0,12,'2026-06-12 15:24:37.866','2026-06-12 15:24:37.409',30),(52,'Non-Slip Entrance Door Mat 60×90 cm','non-slip-entrance-door-mat-60-90-cm','Coir-face door mat with PVC non-slip backing. \'Home\' text. Scrapes mud from footwear.',380.00,NULL,60,NULL,1,0,9,'2026-06-12 15:24:37.867','2026-06-12 15:24:37.409',65),(53,'PEVA Shower Curtain with 12 Hooks','peva-shower-curtain-with-12-hooks','Water-repellent PEVA shower curtain with geometric print. Rust-proof grommet rings. 180 × 200 cm.',580.00,493.00,50,NULL,1,0,7,'2026-06-12 15:24:37.868','2026-06-12 15:24:37.409',31),(54,'15W Wireless Charging Pad – Slim','15w-wireless-charging-pad-slim','Qi-certified fast wireless charger compatible with all Qi devices. 3 mm ultra-slim design.',1200.00,960.00,43,NULL,1,0,12,'2026-06-12 15:24:37.869','2026-06-12 15:24:37.409',75),(55,'Drawer Divider Set (12-piece)','drawer-divider-set-12-piece','Adjustable bamboo drawer dividers for kitchen, bedroom, and office. Fits drawers 30–80 cm wide.',720.00,NULL,35,NULL,1,0,6,'2026-06-12 15:24:37.870','2026-06-12 15:24:37.409',56),(56,'Marble-Effect Coffee Table Tray Set','marble-effect-coffee-table-tray-set','Geometric tray set in white marble effect with gold rim. Includes 3 nested trays.',1100.00,NULL,22,NULL,1,0,4,'2026-06-12 15:24:37.870','2026-06-12 15:24:37.409',30),(57,'Rotating Spice Rack with 12 Jars','rotating-spice-rack-with-12-jars','Rotating countertop spice rack with 12 refillable glass jars and labels. Lazy-susan base.',1100.00,NULL,31,NULL,1,1,2,'2026-06-12 15:24:37.871','2026-06-12 15:24:37.409',84),(58,'Natural Bamboo Non-Slip Bath Mat','natural-bamboo-non-slip-bath-mat','Eco-friendly solid bamboo bath mat with non-slip rubber feet. Water-resistant. 45 × 75 cm.',950.00,NULL,50,NULL,1,0,7,'2026-06-12 15:24:37.872','2026-06-12 15:24:37.409',36),(59,'4-Cup Wall-Mount Toothbrush Holder','4-cup-wall-mount-toothbrush-holder','Stainless steel wall-mounted toothbrush and paste holder with drainage holes. SUS304 grade.',480.00,NULL,65,NULL,1,1,7,'2026-06-12 15:24:37.873','2026-06-12 15:24:37.409',80),(60,'Copper Watering Can 2 L','copper-watering-can-2-l','Classic copper-finish steel watering can with long narrow spout. Ideal for indoor plants.',1200.00,NULL,23,NULL,1,1,10,'2026-06-12 15:24:37.874','2026-06-12 15:24:37.409',92),(61,'Double-Wall Insulated Sports Water Bottle 1 L','double-wall-insulated-sports-water-bottle-1-l','Stainless steel vacuum-insulated bottle. Keeps cold 24 h / hot 12 h. BPA-free, leakproof.',1200.00,NULL,35,NULL,1,0,15,'2026-06-12 15:24:37.875','2026-06-12 15:24:37.409',9),(62,'Digital Electric Rice Cooker 1.8 L','digital-electric-rice-cooker-1-8-l','1.8-litre capacity rice cooker with steamer tray, keep-warm function, and non-stick inner pot.',2800.00,NULL,37,NULL,1,0,2,'2026-06-12 15:24:37.876','2026-06-12 15:24:37.409',7),(63,'Speckled Terracotta Planter (Set of 3)','speckled-terracotta-planter-set-of-3','Handmade terracotta planters with drainage holes and wooden saucers. Sizes: 8, 12, 16 cm.',780.00,686.00,37,NULL,1,0,3,'2026-06-12 15:24:37.876','2026-06-12 15:24:37.409',9),(64,'Orthopaedic Memory Foam Pillow','orthopaedic-memory-foam-pillow','Contour memory foam pillow for neck and shoulder support. Cool-gel layer on top. Comes with removable bamboo cover.',1800.00,NULL,14,NULL,1,0,1,'2026-06-12 15:24:37.877','2026-06-12 15:24:37.409',27),(65,'Large Himalayan Salt Lamp 4–5 kg','large-himalayan-salt-lamp-4-5-kg','Natural pink Himalayan salt lamp with dimmer switch. Warm amber glow, air-purifying properties.',1800.00,NULL,15,NULL,1,0,8,'2026-06-12 15:24:37.878','2026-06-12 15:24:37.409',16),(66,'Soy Wax Scented Candle Set (4 pcs)','soy-wax-scented-candle-set-4-pcs','Handpoured soy candles with wooden wicks in jasmine, sandalwood, rose, and vanilla scents.',850.00,NULL,69,NULL,1,0,3,'2026-06-12 15:24:37.879','2026-06-12 15:24:37.409',29),(67,'Thermal Insulated Curtains (Pair) – Grey','thermal-insulated-curtains-pair-grey','3-layer foam-backed curtains reducing heat loss by up to 40%. Grommets for standard rods.',2800.00,2240.00,11,NULL,1,0,5,'2026-06-12 15:24:37.879','2026-06-12 15:24:37.409',11),(68,'Handloom Jamdani Saree','handloom-jamdani-saree','Traditional Bangladeshi Jamdani saree in soft cotton with intricate woven motifs. Blouse included.',5500.00,4950.00,22,NULL,1,0,13,'2026-06-12 15:24:37.880','2026-06-12 15:24:37.409',26),(69,'Hanging Coco Liner Plant Basket 35 cm','hanging-coco-liner-plant-basket-35-cm','Galvanised wire hanging basket with coir liner. Includes 2.5 m rust-proof hanging chain.',450.00,NULL,47,NULL,1,0,10,'2026-06-12 15:24:37.881','2026-06-12 15:24:37.409',16),(70,'Under-Bed Storage Bag Set (4 pcs)','under-bed-storage-bag-set-4-pcs','Large zipper-closure clear window bags for under-bed storage. Protects from dust and moisture.',620.00,NULL,65,NULL,1,0,6,'2026-06-12 15:24:37.881','2026-06-12 15:24:37.409',28),(71,'Shaggy Bedroom Rug 120×170 cm – Ivory','shaggy-bedroom-rug-120-170-cm-ivory','Ultra-plush 5 cm pile shaggy rug in cream-ivory. Anti-shed, anti-static. Underlay recommended.',2800.00,2296.00,12,NULL,1,0,9,'2026-06-12 15:24:37.883','2026-06-12 15:24:37.409',25),(72,'Rattan Side Table with Open Shelf','rattan-side-table-with-open-shelf','Handwoven rattan side table with lower storage shelf. Suitable for indoor/outdoor use.',3200.00,NULL,16,NULL,1,0,4,'2026-06-12 15:24:37.883','2026-06-12 15:24:37.409',27),(73,'Self-Watering Planter Box 60 cm','self-watering-planter-box-60-cm','Modern rectangular planter with built-in water reservoir and level indicator. 3-litre capacity.',1600.00,NULL,8,NULL,1,0,10,'2026-06-12 15:24:37.884','2026-06-12 15:24:37.409',22),(74,'Double-Rod Hanging Closet Organizer','double-rod-hanging-closet-organizer','Portable wardrobe organizer with 2 hanging rods, 5 shelves, and 2 shoe pockets. 160 cm tall.',1800.00,1476.00,21,NULL,1,0,6,'2026-06-12 15:24:37.884','2026-06-12 15:24:37.409',14),(75,'Women\'s Cotton Loungewear Set','women-s-cotton-loungewear-set','Matching top and trouser set in soft cotton-spandex blend. 6 colours. S to XXL.',1200.00,NULL,76,NULL,1,0,13,'2026-06-12 15:24:37.885','2026-06-12 15:24:37.409',5),(76,'Bulgarian Rose Water Facial Toner 250 ml','bulgarian-rose-water-facial-toner-250-ml','Pure steam-distilled rose water with no additives. Balances pH and soothes after cleansing.',750.00,675.00,71,NULL,1,0,14,'2026-06-12 15:24:37.886','2026-06-12 15:24:37.409',23),(77,'Clear Stackable Storage Bins (6-pack)','clear-stackable-storage-bins-6-pack','BPA-free clear plastic bins with smooth-glide drawers. Ideal for fridge, pantry, and desk.',950.00,NULL,36,NULL,1,0,6,'2026-06-12 15:24:37.886','2026-06-12 15:24:37.409',18),(78,'Wooden Alphabet & Number Puzzle Board','wooden-alphabet-number-puzzle-board','36-piece hardwood letter and number puzzle with colourful illustrations. Suitable 2+ years.',750.00,NULL,26,NULL,1,0,11,'2026-06-12 15:24:37.887','2026-06-12 15:24:37.409',28),(79,'7-in-1 USB-C Hub with 4K HDMI','7-in-1-usb-c-hub-with-4k-hdmi','Compact USB-C hub: 4K HDMI, 3× USB-A 3.0, SD/TF card, PD 100W charging passthrough.',2200.00,NULL,15,NULL,1,0,12,'2026-06-12 15:24:37.888','2026-06-12 15:24:37.409',13),(80,'4-Drawer Wooden Filing Cabinet','4-drawer-wooden-filing-cabinet','A4 filing cabinet in natural pine with label holders and smooth ball-bearing runners.',5500.00,4840.00,4,NULL,1,0,6,'2026-06-12 15:24:37.888','2026-06-12 15:24:37.409',2),(81,'Premium Succulent & Cactus Soil Mix 5 L','premium-succulent-cactus-soil-mix-5-l','Ready-to-use gritty soil mix with perlite, coarse sand, and peat. pH 6–7. 5 litre bag.',350.00,315.00,67,NULL,1,0,10,'2026-06-12 15:24:37.889','2026-06-12 15:24:37.409',20),(82,'Glass Food Container Set (10-piece)','glass-food-container-set-10-piece','Borosilicate glass meal-prep containers with snap-lock lids. Microwave, oven, and freezer safe.',1650.00,NULL,32,NULL,1,0,2,'2026-06-12 15:24:37.889','2026-06-12 15:24:37.409',17),(83,'King Size Microfiber Bedsheet Set','king-size-microfiber-bedsheet-set','4-piece king bedsheet set: flat sheet, fitted sheet, 2 pillow cases. 300 thread count microfiber.',1200.00,NULL,51,NULL,1,0,1,'2026-06-12 15:24:37.890','2026-06-12 15:24:37.409',8),(84,'Bamboo Cutting Board with Juice Groove','bamboo-cutting-board-with-juice-groove','Extra-large organic bamboo cutting board with deep juice groove and non-slip rubber feet.',680.00,578.00,25,NULL,1,0,2,'2026-06-12 15:24:37.890','2026-06-12 15:24:37.409',9),(85,'Smart Fitness Tracker Band','smart-fitness-tracker-band','1.3-inch colour display, heart rate, SpO2, sleep tracking, 10-day battery. IP68 waterproof.',2800.00,NULL,26,NULL,1,0,15,'2026-06-12 15:24:37.891','2026-06-12 15:24:37.409',18),(86,'BPA-Free Silicone Baby Bib Set (5 pcs)','bpa-free-silicone-baby-bib-set-5-pcs','Soft waterproof silicone bibs with deep food catcher pocket. Adjustable snap neck closure.',680.00,NULL,58,NULL,1,0,11,'2026-06-12 15:24:37.891','2026-06-12 15:24:37.409',5),(87,'Rattan Laundry Hamper with Lid','rattan-laundry-hamper-with-lid','Large handwoven rattan laundry basket with cloth liner and hinged wooden lid. 60 L capacity.',1800.00,NULL,22,NULL,1,0,7,'2026-06-12 15:24:37.892','2026-06-12 15:24:37.409',13),(88,'Kaolin Clay & Activated Charcoal Face Mask 100 ml','kaolin-clay-activated-charcoal-face-mask-100-ml','Deep-cleansing clay mask drawing out impurities and minimising pores. Suitable weekly use.',980.00,862.00,52,NULL,1,0,14,'2026-06-12 15:24:37.893','2026-06-12 15:24:37.409',26),(89,'Velvet Cushion Cover Set (4 pcs) – Sage Green','velvet-cushion-cover-set-4-pcs-sage-green','Luxury velvet cushion covers in sage green with gold zip. 45 × 45 cm. Inserts included.',1600.00,1280.00,23,NULL,1,0,4,'2026-06-12 15:24:37.893','2026-06-12 15:24:37.409',12),(90,'10% Niacinamide + Zinc Balancing Toner 150 ml','10-niacinamide-zinc-balancing-toner-150-ml','Alcohol-free toner targeting enlarged pores and excess oil. Suitable for oily/combination skin.',1200.00,1020.00,58,NULL,1,0,14,'2026-06-12 15:24:37.894','2026-06-12 15:24:37.409',20),(91,'Premium Cotton Pillow Cover Set (2 pcs)','premium-cotton-pillow-cover-set-2-pcs','Soft 100% combed cotton pillow covers with envelope closure. Machine washable. Available in multiple colours.',450.00,360.00,79,NULL,1,0,1,'2026-06-12 15:24:37.894','2026-06-12 15:24:37.409',8),(92,'Under-Cabinet LED Strip Light Kit 1 m','under-cabinet-led-strip-light-kit-1-m','Self-adhesive LED strip with touch dimmer and plug-in driver. Warm white, cut-to-size.',650.00,520.00,34,NULL,1,0,8,'2026-06-12 15:24:37.895','2026-06-12 15:24:37.409',12),(93,'Blackout Eyelet Curtains (Pair) – 140×250 cm','blackout-eyelet-curtains-pair-140-250-cm','Triple-weave blackout curtains blocking 99% of light. Thermal insulating. Ring-top heading.',2200.00,1760.00,36,NULL,1,0,5,'2026-06-12 15:24:37.895','2026-06-12 15:24:37.409',17),(94,'LED Architect Desk Lamp with USB Port','led-architect-desk-lamp-with-usb-port','Eye-care LED desk lamp with 5 colour temperatures, 10 brightness levels, and USB-A charging port.',2200.00,1760.00,18,NULL,1,0,8,'2026-06-12 15:24:37.896','2026-06-12 15:24:37.409',7),(95,'Mid-Century Modern Bookends (Pair)','mid-century-modern-bookends-pair','Cast iron bookends with matte black powder coating. Holds 30+ books. Non-scratch base.',750.00,675.00,46,NULL,1,0,4,'2026-06-12 15:24:37.896','2026-06-12 15:24:37.409',11),(96,'Smart LED Colour-Changing Bulb E27','smart-led-colour-changing-bulb-e27','16 million colours WiFi smart bulb compatible with Alexa and Google Home. 9W / 800 lumens.',1200.00,NULL,33,NULL,1,0,8,'2026-06-12 15:24:37.897','2026-06-12 15:24:37.409',8),(97,'Egyptian Cotton Towel Set (6-piece)','egyptian-cotton-towel-set-6-piece','Premium 600 GSM Egyptian cotton towel set: 2 bath, 2 hand, 2 face towels. Fast-drying.',2800.00,2184.00,31,NULL,1,0,7,'2026-06-12 15:24:37.897','2026-06-12 15:24:37.409',20),(98,'Day & Night Roller Blind – 90×180 cm','day-night-roller-blind-90-180-cm','Alternating sheer and opaque bands for adjustable privacy and light control. No tools needed.',2200.00,1804.00,19,NULL,1,0,5,'2026-06-12 15:24:37.898','2026-06-12 15:24:37.409',5),(99,'Handwoven Natural Jute Area Rug 150×200 cm','handwoven-natural-jute-area-rug-150-200-cm','Chunky-weave jute rug with cotton border. Natural earth tones. Reversible for extended wear.',3200.00,NULL,12,NULL,1,0,9,'2026-06-12 15:24:37.898','2026-06-12 15:24:37.409',18),(100,'Natural Bamboo Roman Blind – 60×160 cm','natural-bamboo-roman-blind-60-160-cm','Hand-crafted bamboo Roman blind with cord-free mechanism. Easy fit inside or outside recess.',1800.00,1530.00,32,NULL,1,0,5,'2026-06-12 15:24:37.898','2026-06-12 15:24:37.409',15),(101,'Foldable Storage Box Set (5 pcs)','foldable-storage-box-set-5-pcs','Collapsible fabric storage boxes with lid, windows, and label holder. Stackable design.',850.00,723.00,65,NULL,1,0,6,'2026-06-12 15:24:37.899','2026-06-12 15:24:37.409',21),(102,'Decorative River Pebbles 1 kg – White','decorative-river-pebbles-1-kg-white','Smooth polished white river stones for plant pot decoration, aquarium, or garden path edging.',220.00,194.00,75,NULL,1,0,10,'2026-06-12 15:24:37.899','2026-06-12 15:24:37.409',12),(103,'20% Vitamin C + E Brightening Serum 30 ml','20-vitamin-c-e-brightening-serum-30-ml','Stable L-ascorbic acid serum with vitamin E and ferulic acid. Reduces pigmentation and brightens.',1800.00,1440.00,29,NULL,1,0,14,'2026-06-12 15:24:37.900','2026-06-12 15:24:37.409',29),(104,'Velvet Prayer Mat with Foam Padding','velvet-prayer-mat-with-foam-padding','Thick foam-padded prayer rug with anti-slip base. Machine washable. 65 × 120 cm.',780.00,NULL,48,NULL,1,0,9,'2026-06-12 15:24:37.900','2026-06-12 15:24:37.409',18),(105,'Rose Quartz Facial Massage Roller & Gua Sha','rose-quartz-facial-massage-roller-gua-sha','Genuine rose quartz roller and gua sha set. Reduces puffiness and promotes lymphatic drainage.',950.00,NULL,30,NULL,1,0,14,'2026-06-12 15:24:37.900','2026-06-12 15:24:37.409',7),(106,'Premium Cashmere-Touch Winter Scarf','premium-cashmere-touch-winter-scarf','Acrylic-cashmere blend scarf, 30 × 180 cm. Generous fringe ends. 12 colours available.',1100.00,NULL,34,NULL,1,0,13,'2026-06-12 15:24:37.901','2026-06-12 15:24:37.409',2),(107,'Non-Slip Kitchen Anti-Fatigue Mat 45×120 cm','non-slip-kitchen-anti-fatigue-mat-45-120-cm','Cushioned anti-fatigue kitchen mat with non-slip backing and waterproof surface. Washable.',680.00,NULL,45,NULL,1,0,9,'2026-06-12 15:24:37.901','2026-06-12 15:24:37.409',24),(108,'Smart Table Fan with Remote & Timer','smart-table-fan-with-remote-timer','DC inverter table fan with 12 speed settings, sleep mode, and app control. Ultra-quiet.',4200.00,NULL,12,NULL,1,0,12,'2026-06-12 15:24:37.901','2026-06-12 15:24:37.409',27),(109,'100% Cotton Fitted Sheet – Queen','100-cotton-fitted-sheet-queen','Snug-fit 200TC pure cotton fitted sheet with deep pocket for mattresses up to 30 cm thick.',680.00,NULL,46,NULL,1,0,1,'2026-06-12 15:24:37.902','2026-06-12 15:24:37.409',2),(110,'Hollow Fibre Comforter – All Season','hollow-fibre-comforter-all-season','Medium-weight duvet suitable for year-round comfort. Anti-allergenic hollow fibre fill. Machine washable.',2200.00,1870.00,30,NULL,1,0,1,'2026-06-12 15:24:37.902','2026-06-12 15:24:37.409',20),(111,'Polar Fleece Hooded Jacket – Unisex','polar-fleece-hooded-jacket-unisex','Anti-pill polar fleece zip-up hoodie with 2 zip pockets. Lightweight warmth. S–2XL.',2200.00,1650.00,44,NULL,1,0,13,'2026-06-12 15:24:37.903','2026-06-12 15:24:37.409',24),(112,'Dimmable Bedside Touch Table Lamp','dimmable-bedside-touch-table-lamp','3-level touch dimmer lamp with gold base and white linen shade. Memory function on/off.',1600.00,NULL,43,NULL,1,0,8,'2026-06-12 15:24:37.903','2026-06-12 15:24:37.409',14),(113,'Chunky Knit Throw Blanket – Cream','chunky-knit-throw-blanket-cream','Oversized hand-knitted throw in 100% merino wool blend. 130 × 170 cm. Perfect for cosy evenings.',2800.00,2184.00,13,NULL,1,0,4,'2026-06-12 15:24:37.904','2026-06-12 15:24:37.409',16),(114,'Bamboo Bathroom Countertop Organizer','bamboo-bathroom-countertop-organizer','3-tier bamboo bathroom organizer for cotton pads, toothbrush, skincare. Moisture resistant.',880.00,704.00,48,NULL,1,0,6,'2026-06-12 15:24:37.904','2026-06-12 15:24:37.409',24),(115,'Cotton Linen Blend Curtains (Pair) – Natural','cotton-linen-blend-curtains-pair-natural','Breathable linen-cotton blend, semi-opaque. Grommet top for smooth gliding. 140 × 240 cm.',1600.00,1408.00,26,NULL,1,0,5,'2026-06-12 15:24:37.905','2026-06-12 15:24:37.409',28),(116,'Velvet Footstool Ottoman with Storage','velvet-footstool-ottoman-with-storage','Square storage ottoman with velvet top. Internal storage, removable tray lid. 40 × 40 cm.',2400.00,1920.00,12,NULL,1,0,4,'2026-06-12 15:24:37.905','2026-06-12 15:24:37.409',17),(117,'Waterproof Mattress Protector','waterproof-mattress-protector','Breathable waterproof mattress cover with fitted skirt. Protects against dust mites, spills, and allergens.',850.00,765.00,65,NULL,1,0,1,'2026-06-12 15:24:37.905','2026-06-12 15:24:37.409',26),(118,'Bamboo Corner Bathroom Shelf (3-tier)','bamboo-corner-bathroom-shelf-3-tier','Freestanding bamboo corner shelf for bathroom. Adjustable tier heights. Moisture treated.',1100.00,902.00,18,NULL,1,0,7,'2026-06-12 15:24:37.906','2026-06-12 15:24:37.409',6),(119,'Premium Cotton Panjabi – Men\'s','premium-cotton-panjabi-men-s','Soft Supima cotton panjabi with intricate embroidery on collar and cuffs. Regular fit. S–3XL.',1800.00,1440.00,41,NULL,1,0,13,'2026-06-12 15:24:37.906','2026-06-12 15:24:37.409',22),(120,'Cold-Pressed Organic Virgin Coconut Oil 200 ml','cold-pressed-organic-virgin-coconut-oil-200-ml','100% organic cold-pressed coconut oil for hair, skin, and cooking. Hexane-free, unrefined.',620.00,NULL,81,NULL,1,0,14,'2026-06-12 15:24:37.907','2026-06-12 15:24:37.409',25),(121,'Extra-Thick Non-Slip Yoga Mat 6 mm','extra-thick-non-slip-yoga-mat-6-mm','6 mm TPE yoga mat with alignment lines, non-slip surface, and carry strap. 183 × 61 cm.',1600.00,1280.00,44,NULL,1,0,15,'2026-06-12 15:24:37.907','2026-06-12 15:24:37.409',25),(122,'Patterned Floral Sheer Curtain (Pair)','patterned-floral-sheer-curtain-pair','Delicate embroidered floral pattern on sheer fabric. Rod pocket heading, 140 × 230 cm.',1200.00,NULL,45,NULL,1,0,5,'2026-06-12 15:24:37.907','2026-06-12 15:24:37.409',19),(123,'Bamboo Cooling Pillow','bamboo-cooling-pillow','Natural bamboo-derived pillow with cooling gel layer and shredded memory foam fill. Dust-mite resistant.',1400.00,1232.00,22,NULL,1,0,1,'2026-06-12 15:24:37.908','2026-06-12 15:24:37.409',17),(124,'Velvet Embossed Throw Pillow Set (3 pcs)','velvet-embossed-throw-pillow-set-3-pcs','Decorative velvet cushion covers with geometric embossed pattern. Zip closure. Insert included.',950.00,713.00,23,NULL,1,0,1,'2026-06-12 15:24:37.908','2026-06-12 15:24:37.409',17),(125,'Modern Geometric Tufted Rug 120×180 cm','modern-geometric-tufted-rug-120-180-cm','Machine-tufted polypropylene rug with bold geometric print. Easy-clean, stain-resistant.',2200.00,1870.00,18,NULL,1,0,9,'2026-06-12 15:24:37.908','2026-06-12 15:24:37.409',23),(126,'Hanging Wicker Planter Basket','hanging-wicker-planter-basket','Handwoven wicker planter with jute rope hanger and coir liner. 25 cm diameter.',550.00,NULL,58,NULL,1,0,4,'2026-06-12 15:24:37.909','2026-06-12 15:24:37.409',15),(127,'Minimalist Geometric Wall Clock','minimalist-geometric-wall-clock','Silent quartz wall clock with Nordic geometric design. Brushed gold hands, 30 cm diameter.',1400.00,1120.00,20,NULL,1,0,3,'2026-06-12 15:24:37.909','2026-06-12 15:24:37.409',24),(128,'Breathable Weight Training Gloves','breathable-weight-training-gloves','Neoprene palm padding with wrist wrap support. Adjustable velcro closure. S/M/L/XL.',680.00,558.00,38,NULL,1,0,15,'2026-06-12 15:24:37.910','2026-06-12 15:24:37.409',7),(129,'Organic Muslin Baby Swaddle Set (3 pcs)','organic-muslin-baby-swaddle-set-3-pcs','100% GOTS organic cotton muslin swaddle blankets 120 × 120 cm. Hypoallergenic, pre-washed.',1200.00,984.00,39,NULL,1,0,11,'2026-06-12 15:24:37.910','2026-06-12 15:24:37.409',7),(130,'Boho Macramé Wall Hanging','boho-macram-wall-hanging','Hand-knotted cotton macramé wall art with natural wood dowel. 60 cm wide × 80 cm long.',1100.00,NULL,13,NULL,1,0,3,'2026-06-12 15:24:37.910','2026-06-12 15:24:37.409',7),(131,'Waterproof Fitted Crib Mattress Protector','waterproof-fitted-crib-mattress-protector','Organic cotton surface, waterproof TPU backing. Fits standard cot mattress 120 × 60 cm.',680.00,612.00,52,NULL,1,0,11,'2026-06-12 15:24:37.911','2026-06-12 15:24:37.409',21),(132,'Hyaluronic Acid Hydrating Moisturiser 50 ml','hyaluronic-acid-hydrating-moisturiser-50-ml','Lightweight gel-cream with 3-weight hyaluronic acid. Plumps, hydrates, and smooths. All skin types.',1600.00,NULL,28,NULL,1,0,14,'2026-06-12 15:24:37.911','2026-06-12 15:24:37.409',13),(133,'Adjustable Over-Door Towel Rack','adjustable-over-door-towel-rack','Stainless steel over-door towel bar with 4 hooks. No drilling required. Holds 6 towels.',620.00,NULL,25,NULL,1,0,7,'2026-06-12 15:24:37.912','2026-06-12 15:24:37.409',1),(134,'Organic Cotton Ankle Socks 5-Pack','organic-cotton-ankle-socks-5-pack','GOTS-certified organic cotton socks with arch support and reinforced heel/toe. Mixed colours.',580.00,510.00,86,NULL,1,0,13,'2026-06-12 15:24:37.912','2026-06-12 15:24:37.409',21),(135,'Stair Carpet Runner 66×450 cm – Grey','stair-carpet-runner-66-450-cm-grey','Non-slip stair runner in herringbone pattern. Comes with 14 carpet rods. Cut to length.',2800.00,2464.00,15,NULL,1,0,9,'2026-06-12 15:24:37.912','2026-06-12 15:24:37.409',14),(136,'Adjustable Wardrobe Shelf Dividers (6-pack)','adjustable-wardrobe-shelf-dividers-6-pack','Spring-tension shelf dividers for wooden closet shelves. Adjustable from 25 to 35 cm.',480.00,432.00,35,NULL,1,0,6,'2026-06-12 15:24:37.913','2026-06-12 15:24:37.409',18),(137,'Silicone Kitchen Utensil Set (8-piece)','silicone-kitchen-utensil-set-8-piece','Heat-resistant silicone cooking tools: spatulas, ladle, tongs, whisk, and more. BPA-free.',780.00,624.00,24,NULL,1,0,2,'2026-06-12 15:24:37.913','2026-06-12 15:24:37.409',11),(138,'Men\'s Classic Oxford Dress Shirt','men-s-classic-oxford-dress-shirt','Easy-iron Oxford-weave dress shirt with button-down collar. Regular fit. 100% cotton.',1600.00,NULL,53,NULL,1,0,13,'2026-06-12 15:24:37.913','2026-06-12 15:24:37.409',14),(139,'Embroidered Anarkali Kurti – Women\'s','embroidered-anarkali-kurti-women-s','Flared Anarkali kurti with hand-embroidered yoke in rayon-cotton blend. Length 48 inches.',2200.00,1804.00,16,NULL,1,0,13,'2026-06-12 15:24:37.914','2026-06-12 15:24:37.409',27),(140,'Adjustable Dumbbell Pair 2–10 kg','adjustable-dumbbell-pair-2-10-kg','Single-pin weight adjustment from 2 to 10 kg per dumbbell. Space-saving design. ABS cradle.',6500.00,5525.00,6,NULL,1,0,15,'2026-06-12 15:24:37.914','2026-06-12 15:24:37.409',11),(141,'Sheer Voile Curtain Panel – White','sheer-voile-curtain-panel-white','Lightweight semi-sheer voile panel for soft light diffusion. Rod pocket heading. 140 × 260 cm.',750.00,NULL,47,NULL,1,0,5,'2026-06-12 15:24:37.915','2026-06-12 15:24:37.409',27),(142,'Tinted SPF 50 Sunscreen + Moisturiser 50 ml','tinted-spf-50-sunscreen-moisturiser-50-ml','Daily broad-spectrum SPF 50 PA++++ sunscreen with light tint. Non-greasy, reef-safe formula.',1400.00,1148.00,23,NULL,1,0,14,'2026-06-12 15:24:37.915','2026-06-12 15:24:37.409',20),(143,'Abstract Canvas Wall Art (Triptych)','abstract-canvas-wall-art-triptych','3-panel canvas print in neutral tones. Ready to hang, gallery-wrapped edges. 120 × 40 cm total.',2200.00,NULL,8,NULL,1,0,3,'2026-06-12 15:24:37.915','2026-06-12 15:24:37.409',4),(144,'Musical Crib Mobile with Night Light','musical-crib-mobile-with-night-light','Rotating crib mobile with 5 plush animals, 12 lullabies, and warm LED night light. USB powered.',1800.00,1440.00,21,NULL,1,0,11,'2026-06-12 15:24:37.916','2026-06-12 15:24:37.409',8),(145,'U-Shape Travel Neck Pillow','u-shape-travel-neck-pillow','Ergonomic memory foam travel pillow with removable washable cover. Compact carry bag included.',550.00,NULL,44,NULL,1,0,1,'2026-06-12 15:24:37.916','2026-06-12 15:24:37.409',3),(146,'Ab Roller Wheel with Knee Pad','ab-roller-wheel-with-knee-pad','Dual-wheel ab roller with extra-wide track for stability. Comes with foam knee pad.',650.00,553.00,55,NULL,1,0,15,'2026-06-12 15:24:37.916','2026-06-12 15:24:37.409',3),(147,'Memory Foam Bath Rug 50×80 cm – Navy','memory-foam-bath-rug-50-80-cm-navy','Contoured memory foam bath mat with non-slip latex backing. Quick-dry microfibre top.',580.00,522.00,59,NULL,1,0,9,'2026-06-12 15:24:37.917','2026-06-12 15:24:37.409',16),(148,'Foaming Soap Dispenser Set (3-piece)','foaming-soap-dispenser-set-3-piece','Touch-free pump soap dispensers in matte white ceramic. Includes 3 labelled bottles.',750.00,675.00,20,NULL,1,0,7,'2026-06-12 15:24:37.917','2026-06-12 15:24:37.409',16),(149,'Solid Rubber Wood Step Stool for Kids','solid-rubber-wood-step-stool-for-kids','2-step toddler step stool with non-slip rubber treads. Supports up to 60 kg. Natural wood.',850.00,NULL,28,NULL,1,0,11,'2026-06-12 15:24:37.917','2026-06-12 15:24:37.409',28),(150,'Solar Garden Path Lights (8-pack)','solar-garden-path-lights-8-pack','Stainless steel solar LED pathway lights. Auto on/off at dusk. IP65 waterproof. Warm white.',1800.00,1476.00,16,NULL,1,0,8,'2026-06-12 15:24:37.918','2026-06-12 15:24:37.409',6),(151,'Emergency Survival kit','emergency-survival-kit',NULL,2235.00,NULL,16,NULL,1,0,16,'2026-06-12 16:07:03.141','2026-06-12 16:14:56.041',12);
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProductImage`
--

DROP TABLE IF EXISTS `ProductImage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProductImage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `altText` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isPrimary` tinyint(1) NOT NULL DEFAULT '0',
  `productId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ProductImage_productId_fkey` (`productId`),
  CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProductImage`
--

LOCK TABLES `ProductImage` WRITE;
/*!40000 ALTER TABLE `ProductImage` DISABLE KEYS */;
INSERT INTO `ProductImage` VALUES (1,'https://picsum.photos/seed/professional-chef-knife-set-6-piece/480/480','Professional Chef Knife Set (6-piece)',1,1),(2,'https://picsum.photos/seed/100-cotton-crew-neck-t-shirt-3-pack/480/480','100% Cotton Crew-Neck T-Shirt 3-Pack',1,2),(3,'https://picsum.photos/seed/over-cabinet-door-organizer/480/480','Over-Cabinet Door Organizer',1,3),(4,'https://picsum.photos/seed/realistic-artificial-succulent-arrangement/480/480','Realistic Artificial Succulent Arrangement',1,4),(5,'https://picsum.photos/seed/handwoven-seagrass-storage-basket-set-3/480/480','Handwoven Seagrass Storage Basket Set (3)',1,5),(6,'https://picsum.photos/seed/expandable-bath-caddy-tray/480/480','Expandable Bath Caddy Tray',1,6),(7,'https://picsum.photos/seed/indoor-herb-growing-kit-6-seeds/480/480','Indoor Herb Growing Kit – 6 Seeds',1,7),(8,'https://picsum.photos/seed/industrial-edison-bulb-pendant-light/480/480','Industrial Edison Bulb Pendant Light',1,8),(9,'https://picsum.photos/seed/speed-jump-rope-with-ball-bearings/480/480','Speed Jump Rope with Ball Bearings',1,9),(10,'https://picsum.photos/seed/ceramic-cookware-set-5-piece/480/480','Ceramic Cookware Set (5-piece)',1,10),(11,'https://picsum.photos/seed/ultra-slim-led-ceiling-panel-60-60-cm/480/480','Ultra-Slim LED Ceiling Panel 60×60 cm',1,11),(12,'https://picsum.photos/seed/tripod-floor-lamp-walnut-linen/480/480','Tripod Floor Lamp – Walnut & Linen',1,12),(13,'https://picsum.photos/seed/stackable-worm-composting-bin/480/480','Stackable Worm Composting Bin',1,13),(14,'https://picsum.photos/seed/stainless-steel-pressure-cooker-5-l/480/480','Stainless Steel Pressure Cooker 5 L',1,14),(15,'https://picsum.photos/seed/portable-power-bank-20000-mah-65w-pd/480/480','Portable Power Bank 20000 mAh – 65W PD',1,15),(16,'https://picsum.photos/seed/cast-iron-skillet-25-cm/480/480','Cast Iron Skillet 25 cm',1,16),(17,'https://picsum.photos/seed/collapsible-toy-storage-bin-large/480/480','Collapsible Toy Storage Bin (Large)',1,17),(18,'https://picsum.photos/seed/hybrid-anc-wireless-earbuds/480/480','Hybrid ANC Wireless Earbuds',1,18),(19,'https://picsum.photos/seed/digital-kitchen-scale-10-kg-1-g/480/480','Digital Kitchen Scale 10 kg / 1 g',1,19),(20,'https://picsum.photos/seed/smart-rgb-led-strip-5-m-with-app-control/480/480','Smart RGB LED Strip 5 m with App Control',1,20),(21,'https://picsum.photos/seed/interlocking-eva-foam-play-mat-36-tiles/480/480','Interlocking EVA Foam Play Mat (36 tiles)',1,21),(22,'https://picsum.photos/seed/bohemian-kilim-area-rug-160-230-cm/480/480','Bohemian Kilim Area Rug 160×230 cm',1,22),(23,'https://picsum.photos/seed/ankle-weight-set-2-1-5-kg/480/480','Ankle Weight Set 2 × 1.5 kg',1,23),(24,'https://picsum.photos/seed/caf-tier-half-window-curtain/480/480','Café Tier Half-Window Curtain',1,24),(25,'https://picsum.photos/seed/ceramic-planter-pot-set-speckled-3-pcs/480/480','Ceramic Planter Pot Set – Speckled (3 pcs)',1,25),(26,'https://picsum.photos/seed/magnetic-fly-screen-90-210-cm/480/480','Magnetic Fly Screen – 90×210 cm',1,26),(27,'https://picsum.photos/seed/luxury-velvet-curtain-set-pair-dusty-rose/480/480','Luxury Velvet Curtain Set (Pair) – Dusty Rose',1,27),(28,'https://picsum.photos/seed/foldable-kids-canvas-teepee-tent/480/480','Foldable Kids Canvas Teepee Tent',1,28),(29,'https://picsum.photos/seed/shoe-rack-bench-with-cushion-top/480/480','Shoe Rack Bench with Cushion Top',1,29),(30,'https://picsum.photos/seed/non-stick-granite-frying-pan-26-cm/480/480','Non-Stick Granite Frying Pan 26 cm',1,30),(31,'https://picsum.photos/seed/memory-foam-anti-fatigue-bath-mat/480/480','Memory Foam Anti-Fatigue Bath Mat',1,31),(32,'https://picsum.photos/seed/floating-tv-unit-with-cable-management/480/480','Floating TV Unit with Cable Management',1,32),(33,'https://picsum.photos/seed/non-slip-reading-chair-cushion-pad/480/480','Non-Slip Reading Chair Cushion Pad',1,33),(34,'https://picsum.photos/seed/men-s-linen-blend-cargo-shorts/480/480','Men\'s Linen Blend Cargo Shorts',1,34),(35,'https://picsum.photos/seed/weighted-blanket-7-kg/480/480','Weighted Blanket 7 kg',1,35),(36,'https://picsum.photos/seed/baby-nail-care-grooming-kit-8-piece/480/480','Baby Nail Care Grooming Kit (8-piece)',1,36),(37,'https://picsum.photos/seed/wooden-photo-frame-set-6-sizes/480/480','Wooden Photo Frame Set (6 sizes)',1,37),(38,'https://picsum.photos/seed/ultrasonic-cool-mist-air-humidifier-4-l/480/480','Ultrasonic Cool-Mist Air Humidifier 4 L',1,38),(39,'https://picsum.photos/seed/copper-fairy-light-string-10-m/480/480','Copper Fairy Light String (10 m)',1,39),(40,'https://picsum.photos/seed/wifi-smart-plug-with-energy-monitor/480/480','WiFi Smart Plug with Energy Monitor',1,40),(41,'https://picsum.photos/seed/resistance-band-set-5-levels/480/480','Resistance Band Set – 5 Levels',1,41),(42,'https://picsum.photos/seed/sofa-armrest-organizer-with-cup-holder/480/480','Sofa Armrest Organizer with Cup Holder',1,42),(43,'https://picsum.photos/seed/expandable-trellis-panel-180-90-cm/480/480','Expandable Trellis Panel 180×90 cm',1,43),(44,'https://picsum.photos/seed/usb-rechargeable-led-night-light/480/480','USB Rechargeable LED Night Light',1,44),(45,'https://picsum.photos/seed/outdoor-all-weather-patio-rug-180-270-cm/480/480','Outdoor All-Weather Patio Rug 180×270 cm',1,45),(46,'https://picsum.photos/seed/handcrafted-pottery-vase-set-3-sizes/480/480','Handcrafted Pottery Vase Set (3 sizes)',1,46),(47,'https://picsum.photos/seed/keratin-protein-hair-repair-mask-200-ml/480/480','Keratin Protein Hair Repair Mask 200 ml',1,47),(48,'https://picsum.photos/seed/bamboo-plant-support-stakes-set-50-pcs/480/480','Bamboo Plant Support Stakes Set (50 pcs)',1,48),(49,'https://picsum.photos/seed/eva-foam-roller-for-muscle-recovery-45-cm/480/480','EVA Foam Roller for Muscle Recovery 45 cm',1,49),(50,'https://picsum.photos/seed/natural-lip-balm-gift-set-6-pcs/480/480','Natural Lip Balm Gift Set (6 pcs)',1,50),(51,'https://picsum.photos/seed/portable-bluetooth-5-0-speaker-20w/480/480','Portable Bluetooth 5.0 Speaker 20W',1,51),(52,'https://picsum.photos/seed/non-slip-entrance-door-mat-60-90-cm/480/480','Non-Slip Entrance Door Mat 60×90 cm',1,52),(53,'https://picsum.photos/seed/peva-shower-curtain-with-12-hooks/480/480','PEVA Shower Curtain with 12 Hooks',1,53),(54,'https://picsum.photos/seed/15w-wireless-charging-pad-slim/480/480','15W Wireless Charging Pad – Slim',1,54),(55,'https://picsum.photos/seed/drawer-divider-set-12-piece/480/480','Drawer Divider Set (12-piece)',1,55),(56,'https://picsum.photos/seed/marble-effect-coffee-table-tray-set/480/480','Marble-Effect Coffee Table Tray Set',1,56),(57,'https://picsum.photos/seed/rotating-spice-rack-with-12-jars/480/480','Rotating Spice Rack with 12 Jars',1,57),(58,'https://picsum.photos/seed/natural-bamboo-non-slip-bath-mat/480/480','Natural Bamboo Non-Slip Bath Mat',1,58),(59,'https://picsum.photos/seed/4-cup-wall-mount-toothbrush-holder/480/480','4-Cup Wall-Mount Toothbrush Holder',1,59),(60,'https://picsum.photos/seed/copper-watering-can-2-l/480/480','Copper Watering Can 2 L',1,60),(61,'https://picsum.photos/seed/double-wall-insulated-sports-water-bottle-1-l/480/480','Double-Wall Insulated Sports Water Bottle 1 L',1,61),(62,'https://picsum.photos/seed/digital-electric-rice-cooker-1-8-l/480/480','Digital Electric Rice Cooker 1.8 L',1,62),(63,'https://picsum.photos/seed/speckled-terracotta-planter-set-of-3/480/480','Speckled Terracotta Planter (Set of 3)',1,63),(64,'https://picsum.photos/seed/orthopaedic-memory-foam-pillow/480/480','Orthopaedic Memory Foam Pillow',1,64),(65,'https://picsum.photos/seed/large-himalayan-salt-lamp-4-5-kg/480/480','Large Himalayan Salt Lamp 4–5 kg',1,65),(66,'https://picsum.photos/seed/soy-wax-scented-candle-set-4-pcs/480/480','Soy Wax Scented Candle Set (4 pcs)',1,66),(67,'https://picsum.photos/seed/thermal-insulated-curtains-pair-grey/480/480','Thermal Insulated Curtains (Pair) – Grey',1,67),(68,'https://picsum.photos/seed/handloom-jamdani-saree/480/480','Handloom Jamdani Saree',1,68),(69,'https://picsum.photos/seed/hanging-coco-liner-plant-basket-35-cm/480/480','Hanging Coco Liner Plant Basket 35 cm',1,69),(70,'https://picsum.photos/seed/under-bed-storage-bag-set-4-pcs/480/480','Under-Bed Storage Bag Set (4 pcs)',1,70),(71,'https://picsum.photos/seed/shaggy-bedroom-rug-120-170-cm-ivory/480/480','Shaggy Bedroom Rug 120×170 cm – Ivory',1,71),(72,'https://picsum.photos/seed/rattan-side-table-with-open-shelf/480/480','Rattan Side Table with Open Shelf',1,72),(73,'https://picsum.photos/seed/self-watering-planter-box-60-cm/480/480','Self-Watering Planter Box 60 cm',1,73),(74,'https://picsum.photos/seed/double-rod-hanging-closet-organizer/480/480','Double-Rod Hanging Closet Organizer',1,74),(75,'https://picsum.photos/seed/women-s-cotton-loungewear-set/480/480','Women\'s Cotton Loungewear Set',1,75),(76,'https://picsum.photos/seed/bulgarian-rose-water-facial-toner-250-ml/480/480','Bulgarian Rose Water Facial Toner 250 ml',1,76),(77,'https://picsum.photos/seed/clear-stackable-storage-bins-6-pack/480/480','Clear Stackable Storage Bins (6-pack)',1,77),(78,'https://picsum.photos/seed/wooden-alphabet-number-puzzle-board/480/480','Wooden Alphabet & Number Puzzle Board',1,78),(79,'https://picsum.photos/seed/7-in-1-usb-c-hub-with-4k-hdmi/480/480','7-in-1 USB-C Hub with 4K HDMI',1,79),(80,'https://picsum.photos/seed/4-drawer-wooden-filing-cabinet/480/480','4-Drawer Wooden Filing Cabinet',1,80),(81,'https://picsum.photos/seed/premium-succulent-cactus-soil-mix-5-l/480/480','Premium Succulent & Cactus Soil Mix 5 L',1,81),(82,'https://picsum.photos/seed/glass-food-container-set-10-piece/480/480','Glass Food Container Set (10-piece)',1,82),(83,'https://picsum.photos/seed/king-size-microfiber-bedsheet-set/480/480','King Size Microfiber Bedsheet Set',1,83),(84,'https://picsum.photos/seed/bamboo-cutting-board-with-juice-groove/480/480','Bamboo Cutting Board with Juice Groove',1,84),(85,'https://picsum.photos/seed/smart-fitness-tracker-band/480/480','Smart Fitness Tracker Band',1,85),(86,'https://picsum.photos/seed/bpa-free-silicone-baby-bib-set-5-pcs/480/480','BPA-Free Silicone Baby Bib Set (5 pcs)',1,86),(87,'https://picsum.photos/seed/rattan-laundry-hamper-with-lid/480/480','Rattan Laundry Hamper with Lid',1,87),(88,'https://picsum.photos/seed/kaolin-clay-activated-charcoal-face-mask-100-ml/480/480','Kaolin Clay & Activated Charcoal Face Mask 100 ml',1,88),(89,'https://picsum.photos/seed/velvet-cushion-cover-set-4-pcs-sage-green/480/480','Velvet Cushion Cover Set (4 pcs) – Sage Green',1,89),(90,'https://picsum.photos/seed/10-niacinamide-zinc-balancing-toner-150-ml/480/480','10% Niacinamide + Zinc Balancing Toner 150 ml',1,90),(91,'https://picsum.photos/seed/premium-cotton-pillow-cover-set-2-pcs/480/480','Premium Cotton Pillow Cover Set (2 pcs)',1,91),(92,'https://picsum.photos/seed/under-cabinet-led-strip-light-kit-1-m/480/480','Under-Cabinet LED Strip Light Kit 1 m',1,92),(93,'https://picsum.photos/seed/blackout-eyelet-curtains-pair-140-250-cm/480/480','Blackout Eyelet Curtains (Pair) – 140×250 cm',1,93),(94,'https://picsum.photos/seed/led-architect-desk-lamp-with-usb-port/480/480','LED Architect Desk Lamp with USB Port',1,94),(95,'https://picsum.photos/seed/mid-century-modern-bookends-pair/480/480','Mid-Century Modern Bookends (Pair)',1,95),(96,'https://picsum.photos/seed/smart-led-colour-changing-bulb-e27/480/480','Smart LED Colour-Changing Bulb E27',1,96),(97,'https://picsum.photos/seed/egyptian-cotton-towel-set-6-piece/480/480','Egyptian Cotton Towel Set (6-piece)',1,97),(98,'https://picsum.photos/seed/day-night-roller-blind-90-180-cm/480/480','Day & Night Roller Blind – 90×180 cm',1,98),(99,'https://picsum.photos/seed/handwoven-natural-jute-area-rug-150-200-cm/480/480','Handwoven Natural Jute Area Rug 150×200 cm',1,99),(100,'https://picsum.photos/seed/natural-bamboo-roman-blind-60-160-cm/480/480','Natural Bamboo Roman Blind – 60×160 cm',1,100),(101,'https://picsum.photos/seed/foldable-storage-box-set-5-pcs/480/480','Foldable Storage Box Set (5 pcs)',1,101),(102,'https://picsum.photos/seed/decorative-river-pebbles-1-kg-white/480/480','Decorative River Pebbles 1 kg – White',1,102),(103,'https://picsum.photos/seed/20-vitamin-c-e-brightening-serum-30-ml/480/480','20% Vitamin C + E Brightening Serum 30 ml',1,103),(104,'https://picsum.photos/seed/velvet-prayer-mat-with-foam-padding/480/480','Velvet Prayer Mat with Foam Padding',1,104),(105,'https://picsum.photos/seed/rose-quartz-facial-massage-roller-gua-sha/480/480','Rose Quartz Facial Massage Roller & Gua Sha',1,105),(106,'https://picsum.photos/seed/premium-cashmere-touch-winter-scarf/480/480','Premium Cashmere-Touch Winter Scarf',1,106),(107,'https://picsum.photos/seed/non-slip-kitchen-anti-fatigue-mat-45-120-cm/480/480','Non-Slip Kitchen Anti-Fatigue Mat 45×120 cm',1,107),(108,'https://picsum.photos/seed/smart-table-fan-with-remote-timer/480/480','Smart Table Fan with Remote & Timer',1,108),(109,'https://picsum.photos/seed/100-cotton-fitted-sheet-queen/480/480','100% Cotton Fitted Sheet – Queen',1,109),(110,'https://picsum.photos/seed/hollow-fibre-comforter-all-season/480/480','Hollow Fibre Comforter – All Season',1,110),(111,'https://picsum.photos/seed/polar-fleece-hooded-jacket-unisex/480/480','Polar Fleece Hooded Jacket – Unisex',1,111),(112,'https://picsum.photos/seed/dimmable-bedside-touch-table-lamp/480/480','Dimmable Bedside Touch Table Lamp',1,112),(113,'https://picsum.photos/seed/chunky-knit-throw-blanket-cream/480/480','Chunky Knit Throw Blanket – Cream',1,113),(114,'https://picsum.photos/seed/bamboo-bathroom-countertop-organizer/480/480','Bamboo Bathroom Countertop Organizer',1,114),(115,'https://picsum.photos/seed/cotton-linen-blend-curtains-pair-natural/480/480','Cotton Linen Blend Curtains (Pair) – Natural',1,115),(116,'https://picsum.photos/seed/velvet-footstool-ottoman-with-storage/480/480','Velvet Footstool Ottoman with Storage',1,116),(117,'https://picsum.photos/seed/waterproof-mattress-protector/480/480','Waterproof Mattress Protector',1,117),(118,'https://picsum.photos/seed/bamboo-corner-bathroom-shelf-3-tier/480/480','Bamboo Corner Bathroom Shelf (3-tier)',1,118),(119,'https://picsum.photos/seed/premium-cotton-panjabi-men-s/480/480','Premium Cotton Panjabi – Men\'s',1,119),(120,'https://picsum.photos/seed/cold-pressed-organic-virgin-coconut-oil-200-ml/480/480','Cold-Pressed Organic Virgin Coconut Oil 200 ml',1,120),(121,'https://picsum.photos/seed/extra-thick-non-slip-yoga-mat-6-mm/480/480','Extra-Thick Non-Slip Yoga Mat 6 mm',1,121),(122,'https://picsum.photos/seed/patterned-floral-sheer-curtain-pair/480/480','Patterned Floral Sheer Curtain (Pair)',1,122),(123,'https://picsum.photos/seed/bamboo-cooling-pillow/480/480','Bamboo Cooling Pillow',1,123),(124,'https://picsum.photos/seed/velvet-embossed-throw-pillow-set-3-pcs/480/480','Velvet Embossed Throw Pillow Set (3 pcs)',1,124),(125,'https://picsum.photos/seed/modern-geometric-tufted-rug-120-180-cm/480/480','Modern Geometric Tufted Rug 120×180 cm',1,125),(126,'https://picsum.photos/seed/hanging-wicker-planter-basket/480/480','Hanging Wicker Planter Basket',1,126),(127,'https://picsum.photos/seed/minimalist-geometric-wall-clock/480/480','Minimalist Geometric Wall Clock',1,127),(128,'https://picsum.photos/seed/breathable-weight-training-gloves/480/480','Breathable Weight Training Gloves',1,128),(129,'https://picsum.photos/seed/organic-muslin-baby-swaddle-set-3-pcs/480/480','Organic Muslin Baby Swaddle Set (3 pcs)',1,129),(130,'https://picsum.photos/seed/boho-macram-wall-hanging/480/480','Boho Macramé Wall Hanging',1,130),(131,'https://picsum.photos/seed/waterproof-fitted-crib-mattress-protector/480/480','Waterproof Fitted Crib Mattress Protector',1,131),(132,'https://picsum.photos/seed/hyaluronic-acid-hydrating-moisturiser-50-ml/480/480','Hyaluronic Acid Hydrating Moisturiser 50 ml',1,132),(133,'https://picsum.photos/seed/adjustable-over-door-towel-rack/480/480','Adjustable Over-Door Towel Rack',1,133),(134,'https://picsum.photos/seed/organic-cotton-ankle-socks-5-pack/480/480','Organic Cotton Ankle Socks 5-Pack',1,134),(135,'https://picsum.photos/seed/stair-carpet-runner-66-450-cm-grey/480/480','Stair Carpet Runner 66×450 cm – Grey',1,135),(136,'https://picsum.photos/seed/adjustable-wardrobe-shelf-dividers-6-pack/480/480','Adjustable Wardrobe Shelf Dividers (6-pack)',1,136),(137,'https://picsum.photos/seed/silicone-kitchen-utensil-set-8-piece/480/480','Silicone Kitchen Utensil Set (8-piece)',1,137),(138,'https://picsum.photos/seed/men-s-classic-oxford-dress-shirt/480/480','Men\'s Classic Oxford Dress Shirt',1,138),(139,'https://picsum.photos/seed/embroidered-anarkali-kurti-women-s/480/480','Embroidered Anarkali Kurti – Women\'s',1,139),(140,'https://picsum.photos/seed/adjustable-dumbbell-pair-2-10-kg/480/480','Adjustable Dumbbell Pair 2–10 kg',1,140),(141,'https://picsum.photos/seed/sheer-voile-curtain-panel-white/480/480','Sheer Voile Curtain Panel – White',1,141),(142,'https://picsum.photos/seed/tinted-spf-50-sunscreen-moisturiser-50-ml/480/480','Tinted SPF 50 Sunscreen + Moisturiser 50 ml',1,142),(143,'https://picsum.photos/seed/abstract-canvas-wall-art-triptych/480/480','Abstract Canvas Wall Art (Triptych)',1,143),(144,'https://picsum.photos/seed/musical-crib-mobile-with-night-light/480/480','Musical Crib Mobile with Night Light',1,144),(145,'https://picsum.photos/seed/u-shape-travel-neck-pillow/480/480','U-Shape Travel Neck Pillow',1,145),(146,'https://picsum.photos/seed/ab-roller-wheel-with-knee-pad/480/480','Ab Roller Wheel with Knee Pad',1,146),(147,'https://picsum.photos/seed/memory-foam-bath-rug-50-80-cm-navy/480/480','Memory Foam Bath Rug 50×80 cm – Navy',1,147),(148,'https://picsum.photos/seed/foaming-soap-dispenser-set-3-piece/480/480','Foaming Soap Dispenser Set (3-piece)',1,148),(149,'https://picsum.photos/seed/solid-rubber-wood-step-stool-for-kids/480/480','Solid Rubber Wood Step Stool for Kids',1,149),(150,'https://picsum.photos/seed/solar-garden-path-lights-8-pack/480/480','Solar Garden Path Lights (8-pack)',1,150),(151,'https://srv981-files.hstgr.io/cbe64e662ed34cb2/files/public_html/hotlinelogo/',NULL,1,151);
/*!40000 ALTER TABLE `ProductImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','CUSTOMER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_phone_key` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'Admin','admin@aarambd.com',NULL,'$2b$10$Aff0Zqps3eO1Kyg7Q4W9tOCaoFCFUPBDp7nXaI848yaIaoTttJUSu','ADMIN','2026-06-12 20:36:27.000','2026-06-12 20:36:27.000');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-12 22:47:40
