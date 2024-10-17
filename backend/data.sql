INSERT INTO authors (first_name, last_name, about) VALUES
('William', 'Shakespeare', 'William Shakespeare was an English playwright, poet, and actor, widely regarded as the greatest writer in the English language and the world''s greatest dramatist.'),
('Jane', 'Austen', 'Jane Austen was an English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.'),
('Leo', 'Tolstoy', 'Count Lev Nikolayevich Tolstoy, usually referred to in English as Leo Tolstoy, was a Russian writer who is regarded as one of the greatest authors of all time.');

INSERT INTO books (title, author) VALUES
('Romeo and Juliet', 1),
('A Midsummer Night''s Dream', 1),
('Hamlet', 1),
('Othello', 1),
('Macbeth', 1),
('Pride and Prejudice', 2),
('Sense and Sensibility', 2),
('Emma', 2),
('Mansfield Park', 2),
('War and Peace', 3),
('Anna Karenina', 3);

INSERT INTO book_genre (book, genre) VALUES
(1, 'Tragedy'),
(1, 'Romance'),
(1, 'Drama'),
(2, 'Comedy'),
(2, 'Fantasy'),
(2, 'Romance'),
(3, 'Tragedy'),
(3, 'Drama'),
(4, 'Tragedy'),
(4, 'Drama'),
(5, 'Tragedy'),
(5, 'Drama'),
(6, 'Romance'),
(6, 'Comedy'),
(7, 'Romance'),
(7, 'Comedy'),
(8, 'Romance'),
(8, 'Comedy'),
(9, 'Romance'),
(9, 'Comedy'),
(10, 'Historical Fiction'),
(10, 'War'),
(11, 'Romance'),
(11, 'Tragedy');

INSERT INTO editions (ISBN, book, format, pages, publisher, lang) VALUES
("1542097584",1,"Kindle",190,"Amazon","English"),
("0140707018",1,"Paperback",304,"Penguin Classics","English"),
("9788175994508",2,"Paperback",132,"Fingerprint! Publishing","English"),
("9354991033",2,"Hardcover",96,"GENERAL PRESS","English"),
("1515028070",3,"Paperback",122,'Createspace Independent Pub',"French"),
("0141396504",3,"Paperback",400,"Penguin Classics","English"),
("9789380816302",4,"Paperback",160,"Maple Press","English"),
("1853260185",4,"Paperback",176,"Wordsworth Editions","English"),
("9788175994195",5,"Paperback",160,"Fingerprint! Publishing","English"),
("9789350334416",5,"Paperback",120,"Maple Press","English"),
("9780141439518",6,"Paperback",448,"Penguin Classics","English"),
("9789387779679",6,"Hardcover",529,"Fingerprint! Publishing","English"),
("9395624116",7,"Hardcover",NULL,"Penguin Classics","English"),
("0141439661",7,"Paperback",432,"Penguin Classics","English"),
("8131938603",8,"Paperback",488,"B Jain Publishers", "English"),
("0141439580",8,"Paperback",512,"Penguin Classics","English"),
("9815202936",9,"Paperback",464,"Penguin Select Classics","English"),
("8172345232",9,"Paperback",384,"Fingerprint! Publishing","English"),
("0140447938",10,"Paperback",1440,"Penguin Classics","English"),
("8175992832",10,"Paperback",1232,"Fingerprint! Publishing","English"),
("1940849241",11,"Hardcover",638,"Ancient Wisdom Publications","English"),
("0140449175",11,"Paperback",864,"Penguin Classics","English");

INSERT INTO users (username, password_hash, isAdmin) VALUES
('admin@admin', '$2b$12$maBkAyvQpaQ/iEc0QZ466O5TMKsQoBZHUyHQIrjqyCLqbfdeyg5pm', TRUE),
('user@user', '$2b$12$RGVHZElZBSsM.tAbUbQP1.HgwJJSZgD3lJZCXgK13g9Dl8KFhsmxu', FALSE);
-- User password: MarioLuigi

INSERT INTO reviews (read_status, rating, reviewer, book, user_Review, start_read, finish_read) VALUES
('To Read', 0, 2, 9, 'I want to read this book', NULL, NULL),
('To Read', 0, 2, 10, 'I want to read this book', NULL, NULL),
('To Read', 0, 2, 11, 'I want to read this book', NULL, NULL),
('Read', 5, 2, 1, 'I loved this book', '2021-01-01', '2021-01-10'),
('Read', 4, 2, 2, 'I liked this book', '2021-01-01', '2021-01-10'),
('Read', 3, 2, 3, 'I didn''t like this book', '2021-01-01', '2021-01-10'),
('Read', 2, 2, 4, 'I hated this book', '2021-01-01', '2021-01-10'),
('Read', 1, 2, 5, 'I despised this book', '2021-01-01', '2021-01-10'),
('Reading', 0, 2, 6, 'I am currently reading this book', '2021-01-01', NULL),
('Reading', 0, 2, 7, 'I am currently reading this book', '2021-01-01', NULL),
('Reading', 0, 2, 8, 'I am currently reading this book', '2021-01-01', NULL);