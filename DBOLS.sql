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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answeroptions`
--

LOCK TABLES `answeroptions` WRITE;
/*!40000 ALTER TABLE `answeroptions` DISABLE KEYS */;
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
  PRIMARY KEY (`CartItemID`),
  KEY `CartID` (`CartID`),
  KEY `CourseID` (`CourseID`),
  CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`CartID`) REFERENCES `carts` (`CartID`),
  CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartitems`
--

LOCK TABLES `cartitems` WRITE;
/*!40000 ALTER TABLE `cartitems` DISABLE KEYS */;
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
  PRIMARY KEY (`CartID`),
  UNIQUE KEY `UserID` (`UserID`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coursefeedback`
--

LOCK TABLES `coursefeedback` WRITE;
/*!40000 ALTER TABLE `coursefeedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `coursefeedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courseimages`
--

DROP TABLE IF EXISTS `courseimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courseimages` (
  `ImageID` int NOT NULL AUTO_INCREMENT,
  `CourseID` int DEFAULT NULL,
  `ImageURL` text,
  `Caption` text,
  PRIMARY KEY (`ImageID`),
  KEY `CourseID` (`CourseID`),
  CONSTRAINT `courseimages_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courseimages`
--

LOCK TABLES `courseimages` WRITE;
/*!40000 ALTER TABLE `courseimages` DISABLE KEYS */;
/*!40000 ALTER TABLE `courseimages` ENABLE KEYS */;
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
  KEY `InstructorID` (`InstructorID`),
  CONSTRAINT `courseinstructors_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`),
  CONSTRAINT `courseinstructors_ibfk_2` FOREIGN KEY (`InstructorID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courseinstructors`
--

LOCK TABLES `courseinstructors` WRITE;
/*!40000 ALTER TABLE `courseinstructors` DISABLE KEYS */;
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
  PRIMARY KEY (`CourseID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'Web Development with HTML, CSS, and JavaScript','A foundational course that teaches you how to build modern websites from scratch using HTML, CSS, and JavaScript.',799.00,'2025-05-17 16:13:52','https://example.com/images/web-basic.jpg'),(2,'ReactJS from Beginner to Advanced','Learn how to build modern user interfaces with ReactJS, including hooks, routing, and state management.',1199.00,'2025-05-17 16:13:52','https://example.com/images/reactjs-course.jpg'),(3,'Node.js and Express for Backend Development','Learn how to build RESTful APIs using Node.js and Express, with MySQL database integration.',999.00,'2025-05-17 16:13:52','https://example.com/images/nodejs-express.jpg'),(4,'Python Programming: Beginner to Advanced','A comprehensive Python course covering basics, file handling, OOP, and popular libraries.',890.00,'2025-05-17 16:13:52','https://example.com/images/python.jpg'),(5,'SQL & MySQL for Beginners','Understand how to write SQL queries, design databases, and work with MySQL in real projects.',490.00,'2025-05-17 16:13:52','https://example.com/images/sql-mysql.jpg'),(6,'Java Spring Boot Course','Develop full-stack web applications with Java and Spring Boot, including REST API, JPA, and security.',1299.00,'2025-05-17 16:13:52','https://example.com/images/springboot.jpg');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessonmaterials`
--

LOCK TABLES `lessonmaterials` WRITE;
/*!40000 ALTER TABLE `lessonmaterials` DISABLE KEYS */;
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
  `Content` text,
  PRIMARY KEY (`LessonID`),
  KEY `CourseID` (`CourseID`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetails`
--

LOCK TABLES `orderdetails` WRITE;
/*!40000 ALTER TABLE `orderdetails` DISABLE KEYS */;
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
  `PaymentStatus` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
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
INSERT INTO `userroles` VALUES (1,1),(2,2),(3,3);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testuser@example.com','$2b$10$oPssRcRptDAgwBDPgWYBg.l7QFcy54yDHNIphcLqWRt/oKsC9jngO','Duy','2025-05-17 15:33:52',NULL,NULL,NULL,NULL,NULL,NULL),(2,'user6@gmail.com','$2b$10$zISsku638SoauxSpI6AcB.4MU7z/wBFtlq9U22Cv.ggKSM11xgK6.','Duy','2025-05-17 15:33:57',NULL,NULL,NULL,NULL,NULL,NULL),(3,'Duyhvhe176251@fpt.edu','$2b$10$h/3kusCRXHiSWjxnpZJwQeImo4Na.QSzE4uhp4Xs8fznLnQH9waFi','Duy','2025-05-17 15:34:12',NULL,NULL,NULL,NULL,NULL,NULL);
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

-- Dump completed on 2025-05-17 20:58:42
