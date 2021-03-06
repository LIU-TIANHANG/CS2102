

DROP TABLE IF EXISTS Restaurants;
DROP TABLE IF EXISTS Menu;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Availability;
DROP TABLE IF EXISTS Reservations;

CREATE TABLE Admins(
	userID          SERIAL,
	password        VARCHAR(100) NOT NULL,
	firstName 		VARCHAR(30) NOT NULL,
	lastName 		VARCHAR(30) NOT NULL,
	email           VARCHAR(50) NOT NULL UNIQUE,
	contactNo       INT NOT NULL,
	PRIMARY KEY (userID)
);

CREATE TABLE RestaurantOwners(
	userID          SERIAL,
	password        VARCHAR(100) NOT NULL,
	firstName       VARCHAR(30) NOT NULL,
	lastName        VARCHAR(30) NOT NULL,
	email           VARCHAR(50) NOT NULL UNIQUE,
    contactNo       INT NOT NULL,
	PRIMARY KEY (userID)
);

CREATE TABLE Users(
	userID          SERIAL,
	password        VARCHAR(100) NOT NULL,
	firstName       VARCHAR(30) NOT NULL,
	lastName        VARCHAR(30) NOT NULL,
	email           VARCHAR(50) NOT NULL UNIQUE,
	contactNo       INT NOT NULL,
	points          INT DEFAULT 0,
	PRIMARY KEY (userID)
);

CREATE TABLE Locations(
	town 			VARCHAR(20),
	PRIMARY KEY(town)
);

CREATE TABLE Restaurants (
    resID               INTEGER,
    rname               VARCHAR(30) NOT NULL,
    openingHour         TIME NOT NULL,
    closingHour         TIME NOT NULL,
    contactNo           INTEGER NOT NULL,
    intro               VARCHAR(500) NOT NULL,
    PRIMARY KEY (resID),
    -- Each restaurant can operate in at most one location
    town                VARCHAR(20) NOT NULL,
    address             VARCHAR(100),
    FOREIGN KEY (town) REFERENCES Locations (town),
    -- Each restaurant is owned by exactly 1 restaurant owner
    FOREIGN KEY (resID) REFERENCES RestaurantOwners(userID)
);


CREATE TABLE Availability(
    aid SERIAL UNIQUE,
    resid INTEGER,
    dateAvailable DATE,
    timeAvailableStart TIME,
    timeAvailableEnd TIME,
    numSeats INTEGER NOT NULL,
    PRIMARY KEY (resid,dateAvailable,timeAvailableStart,timeAvailableEnd),
    FOREIGN KEY (resid) REFERENCES Restaurants(resid) ON DELETE CASCADE.
    check (numSeats >=0)
);


CREATE TABLE Menu(
	item VARCHAR(50),
	price NUMERIC,
	description VARCHAR(100),
	resID INTEGER NOT NULL,
	PRIMARY KEY (item,resID),
	FOREIGN KEY (resID) REFERENCES Restaurants(resID) ON DELETE CASCADE
);

CREATE TYPE booking_status AS ENUM('booked','attended','missing');

CREATE TABLE Reservations(
	numPeople   INT NOT NULL,
	attendance  booking_status DEFAULT ('booked'),
	-- Relationship with Users
	userID      INT NOT NULL,
	FOREIGN KEY (userID) REFERENCES Users(userID),
    aid         INT NOT NULL,
	FOREIGN KEY (aid) REFERENCES Availability(aid) ON DELETE CASCADE,
	PRIMARY KEY (userID, aid),
	CHECK (numPeople > 0)
);

CREATE TABLE Reviews(
	userID      INT,
	resID       INT,
	rating      INT,
	review      VARCHAR(500),
	PRIMARY KEY (userID, resID),
	FOREIGN KEY (userID) REFERENCES Users,
	FOREIGN KEY (resID) REFERENCES Restaurants ON DELETE CASCADE,
	CHECK (rating <= 5)
);



CREATE TABLE Meals(
    -- E.g. breakfast, lunch, dinner, supper, etc.
	mealType    VARCHAR(20),
	PRIMARY KEY (mealType)
);

CREATE TABLE Serves(
	resID           INTEGER NOT NULL,
	mealType        VARCHAR(20),
	PRIMARY KEY (resID, mealType),
	FOREIGN KEY (resID) REFERENCES Restaurants (resID) ON DELETE CASCADE,
	FOREIGN KEY (mealType) REFERENCES Meals (mealType) ON DELETE CASCADE
);


CREATE TABLE Cuisines( -- E.g. Italian, Chinese, Peranakan, etc.
	cuisine 		VARCHAR(20),
	PRIMARY KEY (cuisine)
);

CREATE TABLE Offers(
	resID       INTEGER NOT NULL,
	cuisine     VARCHAR(20),
	PRIMARY KEY (resID, cuisine),
	FOREIGN KEY (resID) REFERENCES Restaurants ON DELETE CASCADE,
	FOREIGN KEY (cuisine) REFERENCES Cuisines ON DELETE CASCADE
);
