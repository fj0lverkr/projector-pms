-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: projector_dev
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `app_roles`
--

DROP TABLE IF EXISTS `app_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_roles` (
  `idapp_roles` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `level` int DEFAULT '0',
  `superUser` tinyint DEFAULT '0',
  PRIMARY KEY (`idapp_roles`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_roles`
--

LOCK TABLES `app_roles` WRITE;
/*!40000 ALTER TABLE `app_roles` DISABLE KEYS */;
INSERT INTO `app_roles` VALUES (1,'Global Admin',100,1),(2,'User',0,0);
/*!40000 ALTER TABLE `app_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meta_continents`
--

DROP TABLE IF EXISTS `meta_continents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meta_continents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `continent_code` varchar(2) NOT NULL,
  `continent_name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_meta_continents_continent_code` (`continent_code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meta_continents`
--

LOCK TABLES `meta_continents` WRITE;
/*!40000 ALTER TABLE `meta_continents` DISABLE KEYS */;
INSERT INTO `meta_continents` VALUES (1,'AF','Africa'),(2,'AN','Antarctica'),(3,'AS','Asia'),(4,'EU','Europe'),(5,'OC','Australia'),(6,'NA','North America'),(7,'SA','South America');
/*!40000 ALTER TABLE `meta_continents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meta_countries`
--

DROP TABLE IF EXISTS `meta_countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meta_countries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `continent_code` varchar(2) DEFAULT NULL,
  `country_code` char(2) NOT NULL,
  `country_name` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_meta_countries_country_code` (`country_code`),
  KEY `FK_continent_idx` (`continent_code`),
  CONSTRAINT `FK_continent` FOREIGN KEY (`continent_code`) REFERENCES `meta_continents` (`continent_code`)
) ENGINE=InnoDB AUTO_INCREMENT=253 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meta_countries`
--

LOCK TABLES `meta_countries` WRITE;
/*!40000 ALTER TABLE `meta_countries` DISABLE KEYS */;
INSERT INTO `meta_countries` VALUES (1,'AS','AF','Afghanistan'),(2,'EU','AX','Aland Islands'),(3,'EU','AL','Albania'),(4,'AF','DZ','Algeria'),(5,'OC','AS','American Samoa'),(6,'EU','AD','Andorra'),(7,'AF','AO','Angola'),(8,'NA','AI','Anguilla'),(9,'AN','AQ','Antarctica'),(10,'NA','AG','Antigua and Barbuda'),(11,'SA','AR','Argentina'),(12,'AS','AM','Armenia'),(13,'NA','AW','Aruba'),(14,'OC','AU','Australia'),(15,'EU','AT','Austria'),(16,'AS','AZ','Azerbaijan'),(17,'NA','BS','Bahamas'),(18,'AS','BH','Bahrain'),(19,'AS','BD','Bangladesh'),(20,'NA','BB','Barbados'),(21,'EU','BY','Belarus'),(22,'EU','BE','Belgium'),(23,'NA','BZ','Belize'),(24,'AF','BJ','Benin'),(25,'NA','BM','Bermuda'),(26,'AS','BT','Bhutan'),(27,'SA','BO','Bolivia'),(28,'NA','BQ','Bonaire, Sint Eustatius and Saba'),(29,'EU','BA','Bosnia and Herzegovina'),(30,'AF','BW','Botswana'),(31,'AN','BV','Bouvet Island'),(32,'SA','BR','Brazil'),(33,'AS','IO','British Indian Ocean Territory'),(34,'AS','BN','Brunei Darussalam'),(35,'EU','BG','Bulgaria'),(36,'AF','BF','Burkina Faso'),(37,'AF','BI','Burundi'),(38,'AS','KH','Cambodia'),(39,'AF','CM','Cameroon'),(40,'NA','CA','Canada'),(41,'AF','CV','Cape Verde'),(42,'NA','KY','Cayman Islands'),(43,'AF','CF','Central African Republic'),(44,'AF','TD','Chad'),(45,'SA','CL','Chile'),(46,'AS','CN','China'),(47,'AS','CX','Christmas Island'),(48,'AS','CC','Cocos (Keeling) Islands'),(49,'SA','CO','Colombia'),(50,'AF','KM','Comoros'),(51,'AF','CG','Congo'),(52,'AF','CD','Congo, Democratic Republic of the Congo'),(53,'OC','CK','Cook Islands'),(54,'NA','CR','Costa Rica'),(55,'AF','CI','Cote D\'Ivoire'),(56,'EU','HR','Croatia'),(57,'NA','CU','Cuba'),(58,'NA','CW','Curacao'),(59,'AS','CY','Cyprus'),(60,'EU','CZ','Czech Republic'),(61,'EU','DK','Denmark'),(62,'AF','DJ','Djibouti'),(63,'NA','DM','Dominica'),(64,'NA','DO','Dominican Republic'),(65,'SA','EC','Ecuador'),(66,'AF','EG','Egypt'),(67,'NA','SV','El Salvador'),(68,'AF','GQ','Equatorial Guinea'),(69,'AF','ER','Eritrea'),(70,'EU','EE','Estonia'),(71,'AF','ET','Ethiopia'),(72,'SA','FK','Falkland Islands (Malvinas)'),(73,'EU','FO','Faroe Islands'),(74,'OC','FJ','Fiji'),(75,'EU','FI','Finland'),(76,'EU','FR','France'),(77,'SA','GF','French Guiana'),(78,'OC','PF','French Polynesia'),(79,'AN','TF','French Southern Territories'),(80,'AF','GA','Gabon'),(81,'AF','GM','Gambia'),(82,'AS','GE','Georgia'),(83,'EU','DE','Germany'),(84,'AF','GH','Ghana'),(85,'EU','GI','Gibraltar'),(86,'EU','GR','Greece'),(87,'NA','GL','Greenland'),(88,'NA','GD','Grenada'),(89,'NA','GP','Guadeloupe'),(90,'OC','GU','Guam'),(91,'NA','GT','Guatemala'),(92,'EU','GG','Guernsey'),(93,'AF','GN','Guinea'),(94,'AF','GW','Guinea-Bissau'),(95,'SA','GY','Guyana'),(96,'NA','HT','Haiti'),(97,'AN','HM','Heard Island and Mcdonald Islands'),(98,'EU','VA','Holy See (Vatican City State)'),(99,'NA','HN','Honduras'),(100,'AS','HK','Hong Kong'),(101,'EU','HU','Hungary'),(102,'EU','IS','Iceland'),(103,'AS','IN','India'),(104,'AS','ID','Indonesia'),(105,'AS','IR','Iran, Islamic Republic of'),(106,'AS','IQ','Iraq'),(107,'EU','IE','Ireland'),(108,'EU','IM','Isle of Man'),(109,'AS','IL','Israel'),(110,'EU','IT','Italy'),(111,'NA','JM','Jamaica'),(112,'AS','JP','Japan'),(113,'EU','JE','Jersey'),(114,'AS','JO','Jordan'),(115,'AS','KZ','Kazakhstan'),(116,'AF','KE','Kenya'),(117,'OC','KI','Kiribati'),(118,'AS','KP','Korea, Democratic People\'s Republic of'),(119,'AS','KR','Korea, Republic of'),(120,'EU','XK','Kosovo'),(121,'AS','KW','Kuwait'),(122,'AS','KG','Kyrgyzstan'),(123,'AS','LA','Lao People\'s Democratic Republic'),(124,'EU','LV','Latvia'),(125,'AS','LB','Lebanon'),(126,'AF','LS','Lesotho'),(127,'AF','LR','Liberia'),(128,'AF','LY','Libyan Arab Jamahiriya'),(129,'EU','LI','Liechtenstein'),(130,'EU','LT','Lithuania'),(131,'EU','LU','Luxembourg'),(132,'AS','MO','Macao'),(133,'EU','MK','Macedonia, the Former Yugoslav Republic of'),(134,'AF','MG','Madagascar'),(135,'AF','MW','Malawi'),(136,'AS','MY','Malaysia'),(137,'AS','MV','Maldives'),(138,'AF','ML','Mali'),(139,'EU','MT','Malta'),(140,'OC','MH','Marshall Islands'),(141,'NA','MQ','Martinique'),(142,'AF','MR','Mauritania'),(143,'AF','MU','Mauritius'),(144,'AF','YT','Mayotte'),(145,'NA','MX','Mexico'),(146,'OC','FM','Micronesia, Federated States of'),(147,'EU','MD','Moldova, Republic of'),(148,'EU','MC','Monaco'),(149,'AS','MN','Mongolia'),(150,'EU','ME','Montenegro'),(151,'NA','MS','Montserrat'),(152,'AF','MA','Morocco'),(153,'AF','MZ','Mozambique'),(154,'AS','MM','Myanmar'),(155,'AF','NA','Namibia'),(156,'OC','NR','Nauru'),(157,'AS','NP','Nepal'),(158,'EU','NL','Netherlands'),(159,'NA','AN','Netherlands Antilles'),(160,'OC','NC','New Caledonia'),(161,'OC','NZ','New Zealand'),(162,'NA','NI','Nicaragua'),(163,'AF','NE','Niger'),(164,'AF','NG','Nigeria'),(165,'OC','NU','Niue'),(166,'OC','NF','Norfolk Island'),(167,'OC','MP','Northern Mariana Islands'),(168,'EU','NO','Norway'),(169,'AS','OM','Oman'),(170,'AS','PK','Pakistan'),(171,'OC','PW','Palau'),(172,'AS','PS','Palestinian Territory, Occupied'),(173,'NA','PA','Panama'),(174,'OC','PG','Papua New Guinea'),(175,'SA','PY','Paraguay'),(176,'SA','PE','Peru'),(177,'AS','PH','Philippines'),(178,'OC','PN','Pitcairn'),(179,'EU','PL','Poland'),(180,'EU','PT','Portugal'),(181,'NA','PR','Puerto Rico'),(182,'AS','QA','Qatar'),(183,'AF','RE','Reunion'),(184,'EU','RO','Romania'),(185,'AS','RU','Russian Federation'),(186,'AF','RW','Rwanda'),(187,'NA','BL','Saint Barthelemy'),(188,'AF','SH','Saint Helena'),(189,'NA','KN','Saint Kitts and Nevis'),(190,'NA','LC','Saint Lucia'),(191,'NA','MF','Saint Martin'),(192,'NA','PM','Saint Pierre and Miquelon'),(193,'NA','VC','Saint Vincent and the Grenadines'),(194,'OC','WS','Samoa'),(195,'EU','SM','San Marino'),(196,'AF','ST','Sao Tome and Principe'),(197,'AS','SA','Saudi Arabia'),(198,'AF','SN','Senegal'),(199,'EU','RS','Serbia'),(200,'EU','CS','Serbia and Montenegro'),(201,'AF','SC','Seychelles'),(202,'AF','SL','Sierra Leone'),(203,'AS','SG','Singapore'),(204,'NA','SX','Sint Maarten'),(205,'EU','SK','Slovakia'),(206,'EU','SI','Slovenia'),(207,'OC','SB','Solomon Islands'),(208,'AF','SO','Somalia'),(209,'AF','ZA','South Africa'),(210,'AN','GS','South Georgia and the South Sandwich Islands'),(211,'AF','SS','South Sudan'),(212,'EU','ES','Spain'),(213,'AS','LK','Sri Lanka'),(214,'AF','SD','Sudan'),(215,'SA','SR','Suriname'),(216,'EU','SJ','Svalbard and Jan Mayen'),(217,'AF','SZ','Swaziland'),(218,'EU','SE','Sweden'),(219,'EU','CH','Switzerland'),(220,'AS','SY','Syrian Arab Republic'),(221,'AS','TW','Taiwan, Province of China'),(222,'AS','TJ','Tajikistan'),(223,'AF','TZ','Tanzania, United Republic of'),(224,'AS','TH','Thailand'),(225,'AS','TL','Timor-Leste'),(226,'AF','TG','Togo'),(227,'OC','TK','Tokelau'),(228,'OC','TO','Tonga'),(229,'NA','TT','Trinidad and Tobago'),(230,'AF','TN','Tunisia'),(231,'AS','TR','Turkey'),(232,'AS','TM','Turkmenistan'),(233,'NA','TC','Turks and Caicos Islands'),(234,'OC','TV','Tuvalu'),(235,'AF','UG','Uganda'),(236,'EU','UA','Ukraine'),(237,'AS','AE','United Arab Emirates'),(238,'EU','GB','United Kingdom'),(239,'NA','US','United States'),(240,'NA','UM','United States Minor Outlying Islands'),(241,'SA','UY','Uruguay'),(242,'AS','UZ','Uzbekistan'),(243,'OC','VU','Vanuatu'),(244,'SA','VE','Venezuela'),(245,'AS','VN','Viet Nam'),(246,'NA','VG','Virgin Islands, British'),(247,'NA','VI','Virgin Islands, U.s.'),(248,'OC','WF','Wallis and Futuna'),(249,'AF','EH','Western Sahara'),(250,'AS','YE','Yemen'),(251,'AF','ZM','Zambia'),(252,'AF','ZW','Zimbabwe');
/*!40000 ALTER TABLE `meta_countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `is_private` tinyint NOT NULL DEFAULT '0',
  `is_hidden` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_extra`
--

DROP TABLE IF EXISTS `user_extra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_extra` (
  `iduser_extra` int NOT NULL AUTO_INCREMENT,
  `okta_id` varchar(20) NOT NULL,
  `profile_picture` longtext,
  `user_role` int DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `alias` varchar(45) DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  `country` char(2) DEFAULT NULL,
  `area` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`iduser_extra`),
  UNIQUE KEY `okta_id_UNIQUE` (`okta_id`),
  KEY `fk-app_role_idx` (`user_role`),
  KEY `fk-country_idx` (`country`),
  CONSTRAINT `fk-app_role` FOREIGN KEY (`user_role`) REFERENCES `app_roles` (`idapp_roles`),
  CONSTRAINT `fk-country` FOREIGN KEY (`country`) REFERENCES `meta_countries` (`country_code`)
) ENGINE=InnoDB AUTO_INCREMENT=203 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_team`
--

DROP TABLE IF EXISTS `user_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` int DEFAULT NULL,
  `team` int DEFAULT NULL,
  `is_manager` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `iduser-team_UNIQUE` (`id`),
  KEY `user_idx` (`user`),
  KEY `fk-team_idx` (`team`),
  CONSTRAINT `fk-team` FOREIGN KEY (`team`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk-user` FOREIGN KEY (`user`) REFERENCES `user_extra` (`iduser_extra`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_team`
--

LOCK TABLES `user_team` WRITE;
/*!40000 ALTER TABLE `user_team` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_team` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-07 12:27:35
