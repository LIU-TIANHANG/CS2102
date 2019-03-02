
DROP TABLE IF EXISTS Restaurants2;
DROP TABLE IF EXISTS Menu;
DROP TABLE IF EXISTS Users;
CREATE TABLE Restaurants2 (
	id SERIAL,
	name VARCHAR(30) NOT NULL,
	openingHour TIME,
	intro VARCHAR(500),
	contactNumber INTEGER,
	PRIMARY KEY (id)
);

CREATE TABLE Menu(
	name CHAR(30),
	price NUMERIC,
	desciption VARCHAR(100),
	RestaurantsID INTEGER NOT NULL,
	PRIMARY KEY (name,RestaurantsID),
	FOREIGN KEY (RestaurantsID) REFERENCES Restaurants2(id)
);

CREATE TABLE Users(
	userID SERIAL,
	password 	VARCHAR(100) NOT NULL,
	firstName 		VARCHAR(30) NOT NULL,
	lastName 		VARCHAR(30) NOT NULL,
	email VARCHAR(50) NOT NULL UNIQUE,
	authentication VARCHAR(20) NOT NULL,
	PRIMARY KEY (userID)
);

INSERT INTO Users VALUES (DEFAULT, '123','th','liu','tainhang3@Hotmil.com','standard');
-- Restaurants INSERTION
INSERT INTO Restaurants2 VALUES (DEFAULT, 'the first restaurants', '00:00:00', 'a brief intro of sql', '12345677');

-- MENU insertion
INSERT INTO Menu VALUES('the first menu', 34.32, 'a brief desciption',1);

-- query helper
SELECT * FROM Restaurants2;

SELECT * FROM Users;
SELECT * FROM Menu;