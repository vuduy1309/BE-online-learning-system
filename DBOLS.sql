-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: managecourseonline
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `answeroptions`
--

DROP TABLE IF EXISTS `answeroptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answeroptions` (
  `OptionID` int NOT NULL AUTO_INCREMENT,
  `QuestionID` int DEFAULT NULL,
  `Content` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `IsCorrect` bit(1) DEFAULT NULL,
  PRIMARY KEY (`OptionID`),
  KEY `QuestionID` (`QuestionID`),
  CONSTRAINT `answeroptions_ibfk_1` FOREIGN KEY (`QuestionID`) REFERENCES `questions` (`QuestionID`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answeroptions`
--

LOCK TABLES `answeroptions` WRITE;
/*!40000 ALTER TABLE `answeroptions` DISABLE KEYS */;
INSERT INTO `answeroptions` VALUES (31,16,'Library',_binary ''),(32,16,'Framework',_binary '\0'),(33,16,'Database',_binary '\0'),(34,17,'JavaScript + XML',_binary ''),(35,17,'Java + HTML',_binary '\0'),(60,24,'abc',_binary ''),(61,24,'dgfd',_binary '\0'),(62,24,'ádsad',_binary '\0'),(63,24,'fgdg',_binary '\0'),(64,25,'dsffsd',_binary ''),(65,25,'fdsf',_binary '\0'),(66,25,'fdsfds',_binary '\0'),(67,25,'ưew',_binary '\0'),(68,26,'qưedqw',_binary ''),(69,26,'vfdbd',_binary '\0'),(70,26,'bgf',_binary '\0'),(71,26,'cấdcs',_binary '\0'),(72,27,'123',_binary ''),(73,27,'ádasd',_binary '\0'),(74,27,'fdsads',_binary ''),(75,27,'fgdbgd',_binary '\0');
/*!40000 ALTER TABLE `answeroptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cartitems`
--

DROP TABLE IF EXISTS `cartitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cartitems` (
  `CartItemID` int NOT NULL AUTO_INCREMENT,
  `CartID` int DEFAULT NULL,
  `CourseID` int DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`CartItemID`),
  KEY `CartID` (`CartID`),
  KEY `CourseID` (`CourseID`),
  CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`CartID`) REFERENCES `carts` (`CartID`),
  CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartitems`
--

LOCK TABLES `cartitems` WRITE;
/*!40000 ALTER TABLE `cartitems` DISABLE KEYS */;
INSERT INTO `cartitems` VALUES (1,1,1,799.00),(2,2,9,1234.00),(3,4,9,1234.00),(4,2,8,5000.00),(5,2,1,799.00),(6,5,9,1234.00),(7,2,3,999.00),(8,6,9,1234.00),(9,7,9,1234.00),(10,8,9,1234.00),(11,9,9,1234.00),(12,10,9,1234.00),(13,11,9,1234.00),(14,12,9,1234.00),(15,13,9,1234.00),(16,14,8,5000.00),(17,14,3,999.00),(18,15,9,1234.00),(19,16,9,1234.00),(20,17,8,5000.00),(21,14,9,1234.00),(22,18,9,1234.00),(23,18,8,5000.00),(24,18,7,5000.00),(25,19,8,5000.00),(26,18,4,890.00),(27,20,9,1234.00),(28,20,36,54565.00),(29,20,1,799.00),(30,21,1,799.00),(31,22,8,5000.00),(32,23,3,999.00),(33,24,4,890.00);
/*!40000 ALTER TABLE `cartitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `CartID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL,
  `TotalPrice` decimal(10,2) DEFAULT NULL,
  `CreateAt` datetime DEFAULT NULL,
  PRIMARY KEY (`CartID`),
  KEY `fk_carts_user` (`UserID`),
  CONSTRAINT `fk_carts_user` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,4,'checked_out',799.00,'2025-05-18 17:52:45'),(2,2,'checked_out',8032.00,'2025-05-18 17:53:43'),(4,2,'paid',1234.00,'2025-05-18 18:05:27'),(5,2,'paid',1234.00,'2025-05-18 18:57:23'),(6,2,'checked_out',1234.00,'2025-05-18 22:18:57'),(7,2,'paid',1234.00,'2025-05-18 22:19:26'),(8,2,'paid',1234.00,'2025-05-18 22:46:11'),(9,2,'checked_out',1234.00,'2025-05-18 22:46:13'),(10,2,'buy_now',1234.00,'2025-05-19 00:28:09'),(11,2,'buy_now',1234.00,'2025-05-19 00:28:29'),(12,2,'buy_now',1234.00,'2025-05-19 00:30:01'),(13,2,'buy_now',1234.00,'2025-05-19 00:34:55'),(14,2,'checked_out',7233.00,'2025-05-19 00:35:02'),(15,2,'buy_now',1234.00,'2025-05-19 00:35:17'),(16,2,'buy_now',1234.00,'2025-05-19 00:38:14'),(17,2,'buy_now',5000.00,'2025-05-19 00:38:22'),(18,2,'checked_out',12124.00,'2025-05-19 00:44:10'),(19,2,'buy_now',5000.00,'2025-05-19 01:12:07'),(20,2,'pending',56598.00,'2025-05-19 05:48:48'),(21,5,'checked_out',799.00,'2025-05-23 02:34:07'),(22,5,'checked_out',5000.00,'2025-05-23 02:34:14'),(23,5,'checked_out',999.00,'2025-05-23 02:34:17'),(24,5,'checked_out',890.00,'2025-05-23 02:34:25');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatrooms`
--

DROP TABLE IF EXISTS `chatrooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatrooms` (
  `ChatRoomID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `InstructorID` int DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ChatRoomID`),
  KEY `UserID` (`UserID`),
  KEY `InstructorID` (`InstructorID`),
  CONSTRAINT `chatrooms_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `chatrooms_ibfk_2` FOREIGN KEY (`InstructorID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatrooms`
--

LOCK TABLES `chatrooms` WRITE;
/*!40000 ALTER TABLE `chatrooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatrooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaintreplies`
--

DROP TABLE IF EXISTS `complaintreplies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaintreplies` (
  `ReplyID` int NOT NULL AUTO_INCREMENT,
  `ComplaintID` int DEFAULT NULL,
  `ResponderID` int DEFAULT NULL,
  `Content` text,
  `ReplyDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ReplyID`),
  KEY `ComplaintID` (`ComplaintID`),
  KEY `ResponderID` (`ResponderID`),
  CONSTRAINT `complaintreplies_ibfk_1` FOREIGN KEY (`ComplaintID`) REFERENCES `complaints` (`ComplaintID`),
  CONSTRAINT `complaintreplies_ibfk_2` FOREIGN KEY (`ResponderID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaintreplies`
--

LOCK TABLES `complaintreplies` WRITE;
/*!40000 ALTER TABLE `complaintreplies` DISABLE KEYS */;
/*!40000 ALTER TABLE `complaintreplies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `ComplaintID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `Content` text,
  `Status` varchar(50) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `ImageURL` text,
  PRIMARY KEY (`ComplaintID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `complaints_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coursefeedback`
--

DROP TABLE IF EXISTS `coursefeedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coursefeedback` (
  `FeedbackID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `CourseID` int DEFAULT NULL,
  `Rating` int DEFAULT NULL,
  `Comment` text,
  `ReviewDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`FeedbackID`),
  KEY `UserID` (`UserID`),
  KEY `CourseID` (`CourseID`),
  CONSTRAINT `coursefeedback_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `coursefeedback_ibfk_2` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`),
  CONSTRAINT `coursefeedback_chk_1` CHECK ((`Rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coursefeedback`
--

LOCK TABLES `coursefeedback` WRITE;
/*!40000 ALTER TABLE `coursefeedback` DISABLE KEYS */;
INSERT INTO `coursefeedback` VALUES (1,3,1,5,'Khóa học cơ bản rất dễ hiểu!','2025-05-17 21:11:28'),(2,3,2,4,'Rất hữu ích nhưng có vài phần khó hiểu.','2025-05-17 21:11:28'),(3,3,3,5,'Học Node.js rất chi tiết.','2025-05-17 21:11:28'),(4,3,4,4,'Python từ cơ bản đến nâng cao rất tốt.','2025-05-17 21:11:28'),(5,3,5,3,'Phần SQL hơi khô khan.','2025-05-17 21:11:28'),(6,3,6,5,'Spring Boot rất thực tế cho dự án.','2025-05-17 21:11:28');
/*!40000 ALTER TABLE `coursefeedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courseinstructors`
--

DROP TABLE IF EXISTS `courseinstructors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courseinstructors` (
  `CourseID` int NOT NULL,
  `InstructorID` int NOT NULL,
  PRIMARY KEY (`CourseID`,`InstructorID`),
  KEY `courseinstructors_ibfk_2` (`InstructorID`),
  CONSTRAINT `courseinstructors_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`),
  CONSTRAINT `courseinstructors_ibfk_2` FOREIGN KEY (`InstructorID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courseinstructors`
--

LOCK TABLES `courseinstructors` WRITE;
/*!40000 ALTER TABLE `courseinstructors` DISABLE KEYS */;
INSERT INTO `courseinstructors` VALUES (1,3),(2,3),(11,3),(34,3),(35,3),(36,3),(38,3),(40,3),(3,4),(37,4),(41,4);
/*!40000 ALTER TABLE `courseinstructors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courseprogress`
--

DROP TABLE IF EXISTS `courseprogress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courseprogress` (
  `ProgressID` int NOT NULL AUTO_INCREMENT,
  `EnrollmentID` int DEFAULT NULL,
  `LessonID` int DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `Duration` int DEFAULT NULL,
  PRIMARY KEY (`ProgressID`),
  KEY `EnrollmentID` (`EnrollmentID`),
  KEY `LessonID` (`LessonID`),
  CONSTRAINT `courseprogress_ibfk_1` FOREIGN KEY (`EnrollmentID`) REFERENCES `enrollments` (`EnrollmentID`),
  CONSTRAINT `courseprogress_ibfk_2` FOREIGN KEY (`LessonID`) REFERENCES `lessons` (`LessonID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courseprogress`
--

LOCK TABLES `courseprogress` WRITE;
/*!40000 ALTER TABLE `courseprogress` DISABLE KEYS */;
/*!40000 ALTER TABLE `courseprogress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `CourseID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Description` text,
  `Price` decimal(10,2) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `ImageURL` text,
  `Status` varchar(20) DEFAULT 'Draft',
  PRIMARY KEY (`CourseID`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'Web Development with HTML, CSS, and JavaScript','A foundational course that teaches you how to build modern websites from scratch using HTML, CSS, and JavaScript.',799.00,'2025-05-17 16:13:52',NULL,'active'),(2,'New Course Title 2','Updated description',5000.00,'2025-05-17 16:13:52','https://example.com/image.jpg','2'),(3,'Node.js and Express for Backend Development','Learn how to build RESTful APIs using Node.js and Express, with MySQL database integration.',999.00,'2025-05-17 16:13:52','https://example.com/images/nodejs-express.jpg','active'),(4,'Python Programming: Beginner to Advanced','A comprehensive Python course covering basics, file handling, OOP, and popular libraries.',890.00,'2025-05-17 16:13:52','https://example.com/images/python.jpg','active'),(5,'SQL & MySQL for Beginners','Understand how to write SQL queries, design databases, and work with MySQL in real projects.',490.00,'2025-05-17 16:13:52','https://example.com/images/sql-mysql.jpg',NULL),(6,'Java Spring Boot Course','Develop full-stack web applications with Java and Spring Boot, including REST API, JPA, and security.',1299.00,'2025-05-17 16:13:52','https://example.com/images/springboot.jpg',NULL),(7,'123456','duyha123',5000.00,'2025-05-17 22:58:09','123123',NULL),(8,'Duyhvhe176251@fpt.edu.vn','duyha123',5000.00,'2025-05-17 22:59:46','/uploads/courses/course-1747682357024-7243239.png','active'),(9,'Ha Vụ Duy','123',1234.00,'2025-05-17 23:05:59','qvdvdf',NULL),(11,'Node.js Basics','Learn the basics of Node.js',300.00,'2025-05-19 08:29:33','https://example.com/nodejs.jpg','Draft'),(34,'TEST 3','abcd',123.00,'2025-05-19 16:30:29','','Draft'),(35,'Test img','duyha123',200.00,'2025-05-19 16:45:43','/uploads/courses/course-1747647943894-753222106.png','Draft'),(36,'Test 4','duyha123',54565.00,'2025-05-19 17:30:14','/uploads/courses/course-1747650614597-718769494.png','Draft'),(37,'123','123',123.00,'2025-05-19 21:00:02','/uploads/courses/course-1747663202070-423362363.png','Draft'),(38,'ReactJS Beginner Course','Learn React from scratch',49.99,'2025-05-21 21:02:06','/uploads/courses/course-1747836126656-397989179.png','Draft'),(40,'ReactJS Beginner Course','Learn React from scratch',10.00,'2025-05-21 21:17:24','/uploads/courses/course-1747837044879-263203972.png','Draft'),(41,'ReactJS Beginner Course','Learn React from scratch',10.00,'2025-05-21 21:17:29','/uploads/courses/course-1747837049893-982115535.png','Draft');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `EnrollmentID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `CourseID` int DEFAULT NULL,
  `EnrollDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`EnrollmentID`),
  KEY `UserID` (`UserID`),
  KEY `CourseID` (`CourseID`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES (1,5,4,'2025-05-23 03:47:45'),(2,5,4,'2025-05-23 04:12:10'),(3,5,3,'2025-05-23 04:12:12'),(4,5,8,'2025-05-23 04:12:13'),(5,5,1,'2025-05-23 04:12:14'),(6,5,1,'2025-05-23 04:12:21');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `InvoiceID` int NOT NULL AUTO_INCREMENT,
  `OrderID` int DEFAULT NULL,
  `InvoiceDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `PaymentMethod` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`InvoiceID`),
  UNIQUE KEY `OrderID` (`OrderID`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessonmaterials`
--

DROP TABLE IF EXISTS `lessonmaterials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessonmaterials` (
  `MaterialID` int NOT NULL AUTO_INCREMENT,
  `LessonID` int DEFAULT NULL,
  `MaterialType` varchar(50) DEFAULT NULL,
  `URL` text,
  PRIMARY KEY (`MaterialID`),
  KEY `LessonID` (`LessonID`),
  CONSTRAINT `lessonmaterials_ibfk_1` FOREIGN KEY (`LessonID`) REFERENCES `lessons` (`LessonID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessonmaterials`
--

LOCK TABLES `lessonmaterials` WRITE;
/*!40000 ALTER TABLE `lessonmaterials` DISABLE KEYS */;
INSERT INTO `lessonmaterials` VALUES (1,1,'Video','https://example.com/videos/html-intro.mp4'),(2,1,'Slide','https://example.com/slides/html-intro.pdf'),(3,2,'Video','https://example.com/videos/css-basics.mp4'),(5,4,'Video','https://example.com/videos/react-components.mp4'),(6,5,'Video','https://example.com/videos/react-state.mp4'),(7,6,'Video','https://example.com/videos/react-router.mp4'),(8,7,'Video','https://example.com/videos/nodejs-setup.mp4'),(9,8,'Video','https://example.com/videos/express-routing.mp4'),(10,9,'Video','https://example.com/videos/mysql-integration.mp4'),(11,10,'Video','https://example.com/videos/python-basics.mp4'),(12,11,'Video','https://example.com/videos/functions-modules.mp4'),(13,12,'Video','https://example.com/videos/oop.mp4'),(14,13,'Video','https://example.com/videos/sql-queries.mp4'),(15,14,'Video','https://example.com/videos/db-design.mp4'),(16,15,'Video','https://example.com/videos/mysql-advanced.mp4'),(17,16,'Video','https://example.com/videos/springboot-setup.mp4'),(18,17,'Video','https://example.com/videos/rest-api-spring.mp4'),(19,18,'Video','https://example.com/videos/security-springboot.mp4'),(20,3,'Video','https://chatgpt.com/c/682c7187-edcc-8001-a22a-eb6638e25e31');
/*!40000 ALTER TABLE `lessonmaterials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `LessonID` int NOT NULL AUTO_INCREMENT,
  `CourseID` int DEFAULT NULL,
  `Title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Introduction` mediumtext,
  `Content` longtext,
  `Example` mediumtext,
  `OrderNumber` int DEFAULT NULL,
  PRIMARY KEY (`LessonID`),
  KEY `CourseID` (`CourseID`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` VALUES (1,1,'Introduction to HTML','Learn the structure and purpose of HTML in web development.','<h2>What is HTML?</h2>\n<ul>\n  <li>HTML stands for Hyper Text Markup Language</li>\n  <li>HTML is the standard markup language for creating Web pages</li>\n  <li>HTML describes the structure of a Web page</li>\n  <li>HTML consists of a series of elements</li>\n  <li>HTML elements tell the browser how to display the content</li>\n</ul>\n<h2>HTML Page Structure</h2>\n<p>Below is a visualization of an HTML page structure:</p>\n<div class=\"ws-grey\">\n<div class=\"html-structure\">\n&lt;!DOCTYPE html&gt;<br>\n&lt;html&gt;<br>\n&lt;head&gt;<br>\n&lt;title&gt;Page Title&lt;/title&gt;<br>\n&lt;/head&gt;<br>\n&lt;body&gt;<br><br>\n&lt;h1&gt;This is a Heading&lt;/h1&gt;<br>\n&lt;p&gt;This is a paragraph.&lt;/p&gt;<br><br>\n&lt;/body&gt;<br>\n&lt;/html&gt;\n</div>\n</div>\'','<!DOCTYPE html>\n<html>\n  <head><title>My First Page</title></head>\n  <body><h1>Hello World!</h1></body>\n</html>',1),(2,1,'CSS Basics','Understand how CSS styles your HTML content.','<p>CSS (Cascading Style Sheets) lets you control the layout and appearance of your HTML.</p>','h1 {\n  color: blue;\n  font-size: 24px;\n}',2),(3,1,'JavaScript Fundamentals','Get started with programming using JavaScript.','<p>JavaScript adds interactivity and logic to your web pages 3.</p>','console.log(\"Hello, JavaScript!\");',2),(4,2,'React Components',NULL,'',NULL,NULL),(5,2,'React State & Lifecycle',NULL,'',NULL,NULL),(6,2,'React Router',NULL,'',NULL,NULL),(7,3,'Node.js Setup',NULL,'',NULL,NULL),(8,3,'Express.js Routing',NULL,'',NULL,NULL),(9,3,'Connecting MySQL',NULL,'',NULL,NULL),(10,4,'Python Basics',NULL,'',NULL,NULL),(11,4,'Functions and Modules',NULL,'',NULL,NULL),(12,4,'Object-Oriented Programming',NULL,'',NULL,NULL),(13,5,'SQL Queries',NULL,'',NULL,NULL),(14,5,'Database Design',NULL,'',NULL,NULL),(15,5,'MySQL Advanced',NULL,'',NULL,NULL),(16,6,'Spring Boot Setup',NULL,'',NULL,NULL),(17,6,'REST API with Spring',NULL,'',NULL,NULL),(18,6,'Security in Spring Boot',NULL,'',NULL,NULL);
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `MessageID` int NOT NULL AUTO_INCREMENT,
  `ChatRoomID` int DEFAULT NULL,
  `SenderID` int DEFAULT NULL,
  `Content` text,
  `SentAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `ImageURL` text,
  PRIMARY KEY (`MessageID`),
  KEY `ChatRoomID` (`ChatRoomID`),
  KEY `SenderID` (`SenderID`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`ChatRoomID`) REFERENCES `chatrooms` (`ChatRoomID`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`SenderID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetails`
--

DROP TABLE IF EXISTS `orderdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderdetails` (
  `OrderDetailID` int NOT NULL AUTO_INCREMENT,
  `OrderID` int DEFAULT NULL,
  `CourseID` int DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`OrderDetailID`),
  KEY `OrderID` (`OrderID`),
  KEY `CourseID` (`CourseID`),
  CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`),
  CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetails`
--

LOCK TABLES `orderdetails` WRITE;
/*!40000 ALTER TABLE `orderdetails` DISABLE KEYS */;
INSERT INTO `orderdetails` VALUES (1,1,1,799.00),(2,2,9,1234.00),(3,2,8,5000.00),(4,2,1,799.00),(5,2,3,999.00),(6,3,9,1234.00),(7,4,9,1234.00),(8,5,8,5000.00),(9,5,3,999.00),(10,5,9,1234.00),(11,6,9,1234.00),(12,6,8,5000.00),(13,6,7,5000.00),(14,6,4,890.00),(15,7,1,799.00),(16,8,8,5000.00),(17,9,3,999.00),(18,10,4,890.00);
/*!40000 ALTER TABLE `orderdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `OrderID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `OrderDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `TotalAmount` decimal(10,2) DEFAULT NULL,
  `PaymentStatus` varchar(20) DEFAULT NULL,
  `PaymentMethod` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,4,'2025-05-18 22:07:32',799.00,'unpaid','VNPay'),(2,2,'2025-05-18 22:18:14',8032.00,'unpaid','vnpay'),(3,2,'2025-05-18 22:19:02',1234.00,'unpaid','vnpay'),(4,2,'2025-05-19 00:28:01',1234.00,'unpaid','vnpay'),(5,2,'2025-05-19 00:41:56',7233.00,'paid','vnpay'),(6,2,'2025-05-19 05:38:36',12124.00,'paid','VNPay'),(7,5,'2025-05-23 02:34:08',799.00,'paid','VNPay'),(8,5,'2025-05-23 02:34:14',5000.00,'paid','VNPay'),(9,5,'2025-05-23 02:34:20',999.00,'paid','Momo'),(10,5,'2025-05-23 02:34:26',890.00,'paid','VNPay');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `PaymentID` int NOT NULL AUTO_INCREMENT,
  `OrderID` int DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `PaymentMethod` varchar(50) DEFAULT NULL,
  `PaymentDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `PaymentStatus` varchar(50) DEFAULT NULL,
  `TransactionCode` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`PaymentID`),
  KEY `OrderID` (`OrderID`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `QuestionID` int NOT NULL AUTO_INCREMENT,
  `QuizID` int DEFAULT NULL,
  `Content` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ImageURL` text,
  PRIMARY KEY (`QuestionID`),
  KEY `QuizID` (`QuizID`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`QuizID`) REFERENCES `quizzes` (`QuizID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (16,1,'What is React?',NULL),(17,1,'What is JSX? 123',NULL),(24,2,'123',NULL),(25,2,'gfsd',NULL),(26,2,'','fdsfds'),(27,3,'123',NULL);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quizzes` (
  `QuizID` int NOT NULL AUTO_INCREMENT,
  `LessonID` int DEFAULT NULL,
  `Title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`QuizID`),
  KEY `LessonID` (`LessonID`),
  CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`LessonID`) REFERENCES `lessons` (`LessonID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
INSERT INTO `quizzes` VALUES (1,1,'Quiz for Lesson 1'),(2,2,'123'),(3,3,'Lam dep zai');
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `RoleID` int NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`RoleID`),
  UNIQUE KEY `RoleName` (`RoleName`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin'),(2,'Course Manager'),(3,'Instructor'),(4,'Student'),(5,'Support');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `useranswers`
--

DROP TABLE IF EXISTS `useranswers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `useranswers` (
  `AttemptID` int NOT NULL,
  `QuestionID` int NOT NULL,
  `SelectedOptionID` int DEFAULT NULL,
  PRIMARY KEY (`AttemptID`,`QuestionID`),
  KEY `QuestionID` (`QuestionID`),
  KEY `SelectedOptionID` (`SelectedOptionID`),
  CONSTRAINT `useranswers_ibfk_1` FOREIGN KEY (`AttemptID`) REFERENCES `userquizattempts` (`AttemptID`),
  CONSTRAINT `useranswers_ibfk_2` FOREIGN KEY (`QuestionID`) REFERENCES `questions` (`QuestionID`),
  CONSTRAINT `useranswers_ibfk_3` FOREIGN KEY (`SelectedOptionID`) REFERENCES `answeroptions` (`OptionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useranswers`
--

LOCK TABLES `useranswers` WRITE;
/*!40000 ALTER TABLE `useranswers` DISABLE KEYS */;
/*!40000 ALTER TABLE `useranswers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userquizattempts`
--

DROP TABLE IF EXISTS `userquizattempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userquizattempts` (
  `AttemptID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `QuizID` int DEFAULT NULL,
  `Score` float DEFAULT NULL,
  `AttemptDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`AttemptID`),
  KEY `UserID` (`UserID`),
  KEY `QuizID` (`QuizID`),
  CONSTRAINT `userquizattempts_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `userquizattempts_ibfk_2` FOREIGN KEY (`QuizID`) REFERENCES `quizzes` (`QuizID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userquizattempts`
--

LOCK TABLES `userquizattempts` WRITE;
/*!40000 ALTER TABLE `userquizattempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `userquizattempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userroles`
--

DROP TABLE IF EXISTS `userroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userroles` (
  `UserID` int NOT NULL,
  `RoleID` int NOT NULL,
  PRIMARY KEY (`UserID`,`RoleID`),
  KEY `RoleID` (`RoleID`),
  CONSTRAINT `userroles_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `userroles_ibfk_2` FOREIGN KEY (`RoleID`) REFERENCES `roles` (`RoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userroles`
--

LOCK TABLES `userroles` WRITE;
/*!40000 ALTER TABLE `userroles` DISABLE KEYS */;
INSERT INTO `userroles` VALUES (1,1),(2,2),(3,3),(4,3),(5,4);
/*!40000 ALTER TABLE `userroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(100) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `FullName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `AvatarURL` text,
  `Address` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Occupation` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testuser@example.com','$2b$10$oPssRcRptDAgwBDPgWYBg.l7QFcy54yDHNIphcLqWRt/oKsC9jngO','Duy','2025-05-17 15:33:52',NULL,NULL,NULL,NULL,NULL,NULL),(2,'user6@gmail.com','$2b$10$zISsku638SoauxSpI6AcB.4MU7z/wBFtlq9U22Cv.ggKSM11xgK6.','Duy','2025-05-17 15:33:57',NULL,NULL,NULL,NULL,NULL,NULL),(3,'Duyhvhe176251@fpt.edu','$2b$10$h/3kusCRXHiSWjxnpZJwQeImo4Na.QSzE4uhp4Xs8fznLnQH9waFi','Duy','2025-05-17 15:34:12',NULL,NULL,NULL,NULL,NULL,NULL),(4,'duyha8618@gmail.com','$2b$10$4BAGG9rjRIk2iV/r4E9fmOxPnsh3NNlnROpHa3.TtCGv36QHwjXtC','HaVuDuy','2025-05-18 02:14:40',NULL,NULL,NULL,NULL,NULL,NULL),(5,'duyakali12@gmail.com','$2b$10$ovWTZjuOEcepatigkXdhqOIKTWXWnFPseFuLgSp7mErQQ6jZ2O1g6','Lâm','2025-05-22 01:28:39',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-23  6:47:10
