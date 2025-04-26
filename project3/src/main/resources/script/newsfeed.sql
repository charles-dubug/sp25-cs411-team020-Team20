USE project3db;

CREATE TABLE IF NOT EXISTS newsfeed (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(25) NOT NULL,
    school VARCHAR(25) NOT NULL,
    academic INT NOT NULL,
    tuition INT NOT NULL,
    location INT NOT NULL,
    comment TEXT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO newsfeed (email, school, academic, tuition, location, comment) VALUES
('user1@example.com', 'School A', 85, 15000, 90, 'Great school with excellent programs'),
('user2@example.com', 'School B', 78, 12000, 70, 'Affordable and decent'),
('user3@example.com', 'School C', 92, 20000, 85, 'Top-notch faculty and resources');


SELECT * FROM newsfeed;