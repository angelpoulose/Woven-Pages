DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS book_genre;
DROP TABLE IF EXISTS editions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reviews;

CREATE TABLE authors(
    AuthorID int AUTO_INCREMENT PRIMARY KEY,
    first_name varchar(50),
    last_name varchar(50),
    about varchar(1000)
);

CREATE TABLE books(
    BookID int AUTO_INCREMENT PRIMARY KEY,
    Title varchar(100) NOT NULL,
    Author INT,
    FOREIGN KEY (Author) REFERENCES authors(AuthorID)
);

CREATE TABLE book_genre(
    Book int NOT NULL,
    Genre varchar(30) NOT NULL,
    FOREIGN KEY (Book) REFERENCES books(BookID)
);

CREATE TABLE editions(
    ISBN int PRIMARY KEY,
    Book int NOT NULL,
    Format varchar(15) NOT NULL,
    Pages int,
    Publisher varchar(50),
    Publish_date DATE,
    lang varchar(20),
    FOREIGN KEY (Book) REFERENCES books(BookID)
);

CREATE TABLE users(
    UserId int AUTO_INCREMENT PRIMARY KEY,
    Username varchar(32) NOT NULL,
    password_hash char(60) NOT NULL
);

CREATE TABLE reviews(
    Rating int DEFAULT 0,
    Reviewer int NOT NULL,
    Book int NOT NULL,
    User_Review varchar(1000),
    Start_read Date,
    Finish_read Date,
    CHECK (Rating>=0 AND Rating<=5),
    UNIQUE (Reviewer,Book),
    FOREIGN KEY (Book) REFERENCES books(BookID),
    FOREIGN KEY (Reviewer) REFERENCES users(UserID)
);