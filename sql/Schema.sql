
DROP TABLE IF EXISTS Restaurants;
DROP TABLE IF EXISTS Menu;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Availability;
DROP TABLE IF EXISTS Reservations;
CREATE TABLE Restaurants(
	rid SERIAL,
	rname VARCHAR(30) NOT NULL,
	openingHour TIME NOT NULL,
	cuisine VARCHAR(30) NOT NULL,
	intro VARCHAR(500) NOT NULL,
	contactNumber INTEGER NOT NULL,
	PRIMARY KEY (rid)
);
--e.g query
INSERT INTO Restaurants VALUES (DEFAULT, 'the first restaurants', '00:00:00','chinese', 'a brief intro of sql', '12345677');

CREATE TABLE Availability(
    aid SERIAL,
    rid INTEGER,
    dateAvailable DATE,
    timeAvailableStart TIME,
    timeAvailableEnd TIME,
    numSeats NUMERIC,
    PRIMARY KEY (rid,dateAvailable,timeAvailableStart,timeAvailableEnd)
);

INSERT INTO Availability VALUES  (DEFAULT,100,'January 8, 1999','00:00:00','10:00:00',5);

CREATE TABLE Menu(
	name CHAR(30),
	price NUMERIC,
	desciption VARCHAR(100),
	RestaurantsID INTEGER NOT NULL,
	PRIMARY KEY (name,RestaurantsID),
	FOREIGN KEY (RestaurantsID) REFERENCES Restaurants(id)
);

CREATE TABLE Reservations(
	rsvID       SERIAL,
	rdate       DATE NOT NULL,
	numPeople   INT NOT NULL,
	attendance  BOOL DEFAULT FALSE,
	PRIMARY KEY (rsvID),
	-- Relationship with Users
	userID      INT NOT NULL,
	FOREIGN KEY (userID) REFERENCES Users,
	-- Relationship with Restaurants
	resID       INT NOT NULL,
	FOREIGN KEY (resID) REFERENCES Restaurants,
    aid         NUMERIC NOT NULL,
	FOREIGN KEY (aid) REFERENCES Availability
);

INSERT INTO Reservations VALUES (DEFAULT, 'January 8, 1999', 'breakfast','1', 'true', '1' , '1');

CREATE TABLE Users(
	userID SERIAL,
	password 	    VARCHAR(100) NOT NULL,
	firstName 		VARCHAR(30) NOT NULL,
	lastName 		VARCHAR(30) NOT NULL,
	email           VARCHAR(50) NOT NULL UNIQUE,
	authentication  VARCHAR(20) NOT NULL,
	PRIMARY KEY (userID)
);

INSERT INTO Users VALUES (DEFAULT, '123','th','liu','tainhang3@Hotmil.com','standard');
-- Restaurants INSERTION

-- MENU insertion
INSERT INTO Menu VALUES('the first menu', 34.32, 'a brief desciption',1);

-- query helper
SELECT * FROM Restaurants2;

SELECT * FROM Users;
SELECT * FROM Menu;