USE project3db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    schools JSON
);

INSERT INTO users (email, password, schools) VALUES
('user1@example.com', 'password1', '["School A", "School B"]'),
('user2@example.com', 'password2', '["School C"]'),
('user3@example.com', 'password3', '["School D", "School E", "School F"]');


SELECT * FROM users;
