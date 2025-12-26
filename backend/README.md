# 🏥 Sabancı Pharmacy Backend – README

A Spring Boot backend application built with **Java 21**, **Gradle**, and a layered architecture (Controller → Service → Repository).
This document explains how to configure, run, and develop the application.

---

# 📁 Project Structure

```
Root
├── build.gradle
├── gradlew / gradlew.bat
├── HELP.md
├── key.txt
├── settings.gradle
├── gradle/wrapper/gradle-wrapper.properties
└── src/
    ├── main/java/com/cs308_team_3/sabanci_pharmacy/
    │   ├── SabanciPharmacyApplication.java   (Entry point)
    │   ├── config/
    │   ├── controller/
    │   ├── dto/
    │   ├── entity/
    │   ├── repository/
    │   ├── service/
    │   └── util/
    ├── main/resources/
    │   └── application.properties
    └── test/java/com/cs308_team_3/sabanci_pharmacy/
```

---

# 🚀 How to Run the Application

## **1. Install Requirements**

| Requirement | Version                                       |
| ----------- | --------------------------------------------- |
| Java        | **21**                                        |
| Gradle      | Use the included **Gradle Wrapper**           |
| Database    | PostgreSQL / MySQL (depending on your config) |

Verify Java:

```bash
java --version
```

---

## **2. Configure application.properties**

Found at:

```
src/main/resources/application.properties
```

### **Required values to update:**

### 🔹 **Database Configuration**

Examples:

**PostgreSQL**

```
spring.datasource.url=jdbc:postgresql://localhost:5432/pharmacy_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

**MySQL**

```
spring.datasource.url=jdbc:mysql://localhost:3306/pharmacy_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 🔹 **JPA Settings**

```
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 🔹 **JWT Secret (key.txt reference)**

If your `JwtUtil.java` loads the secret from `key.txt`, ensure this file exists at the project root:

```
key.txt
```

Content should be your JWT secret key (example):

```
my-super-secret-key
```

### 🔹 **Mail Settings**

If `EmailService.java` uses SMTP:

```
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=youremail@gmail.com
spring.mail.password=APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 🔹 **Server Port**

Optional:

```
server.port=8080
```

---

## **3. Run the Project**

### 🔹 Using Gradle Wrapper

Mac/Linux:

```bash
./gradlew bootRun
```

Windows:

```bash
gradlew bootRun
```

---

## **4. Build & Run the JAR**

### Build:

```bash
./gradlew clean build
```

### Run:

```bash
java -jar build/libs/sabanci-pharmacy-backend.jar
```

(Your jar name may differ — check `build/libs/`.)

---

# 🧪 Running Tests

Run all tests:

```bash
./gradlew test
```

Runs service-layer tests:

* CartServiceTest
* CategoryServiceTest
* ProductServiceTest
* ReviewServiceTest
* UserServiceTest

---

# 🔧 Modifying the Backend

Below are the files you are most likely to change while developing.

---

## 🔐 **Security & Authentication**

### Located in:

```
src/main/java/com/cs308_team_3/sabanci_pharmacy/config/
```

### Files:

* `CorsConfig.java` → CORS rules
* `JwtFilter.java` → JWT request filtering
* `SecurityConfig.java` → Authentication rules, public/private endpoints

Update these when:

* Allowing new public routes (e.g., product listing)
* Changing JWT behavior
* Modifying password/auth flow

---

## 🧩 **Controllers (Routes / API Endpoints)**

Located at:

```
controller/
```

Each controller exposes REST endpoints:

* `ProductController`
* `ReviewController`
* `OrderController`
* `UserController`
* etc.

Modify these to add or change API routes.

---

## 🧠 **Services (Business Logic)**

Located at:

```
service/
```

Contains core logic for:

* Cart
* Orders
* Products
* Users
* Authentication (`CustomUserDetailsService`)
* Email sending (`EmailService`)
* PDF creation (`PdfService`)

---

## 🏗️ **Repositories (Database Access)**

Located at:

```
repository/
```

These are Spring JPA interfaces.
Modify them when:

* Adding new DB queries
* Extending search/filter features

---

## 🏛️ **Entities (Database Models)**

Located at:

```
entity/
```

Update these when your database schema changes.

---

# ⚙️ build.gradle – Important Sections

### Ensure Java 21 is configured:

```gradle
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}
```

### Dependencies Example:

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-mail'
    implementation 'com.fasterxml.jackson.core:jackson-databind'
    implementation 'io.jsonwebtoken:jjwt-api:0.11.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.11.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.11.5'

    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

---

# 🔍 Environment Profiles (Optional)

You may create:

* `application-dev.properties`
* `application-prod.properties`

Run with:

```bash
./gradlew bootRun --args='--spring.profiles.active=dev'
```

---

# 🐳 Docker Support (Optional)

If you add a `Dockerfile`:

```bash
docker build -t sabanci-pharmacy .
docker run -p 8080:8080 sabanci-pharmacy
```
