module.exports = {
    restaurants_read_query : 'SELECT * FROM Restaurants',
    restaurants_read_query_id : 'SELECT * FROM Restaurants WHERE resid = $1',
    restaurants_read_query_name_basedOn_id : 'SELECT rname FROM Restaurants WHERE resid = $1',
    restaurants_read_query_id_basedOn_name : 'SELECT resid FROM Restaurants WHERE rname = $1',
    restaurants_read_query_name : 'SELECT resid,rname FROM Restaurants',
    restaurants_insert_query :  'INSERT INTO Restaurants VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
    restaurants_delete_query : 'DELETE FROM Restaurants WHERE resid = $1',
    restaurants_update_query : 'UPDATE Restaurants SET rname = $1 , openingHour=$2,closingHour = $3, intro=$4, contactNo=$5,town= $6,address = $7 WHERE resid = $8',


    login_read_query_email_user : 'SELECT userid, email, password FROM users WHERE email=$1',
    login_read_query_email_admin : 'SELECT userid, email, password FROM Admins WHERE email=$1',
    login_read_query_email_RO : 'SELECT userid, email, password FROM RestaurantOwners WHERE email=$1',
    login_read_query_id : 'SELECT userid, email, password FROM users WHERE userid=$1',
    login_read_query_email : 'WITH accounts AS (SELECT email,userid FROM users UNION SELECT email,userid FROM admins UNION SELECT email,userid FROM RestaurantOwners) SELECT  email,userid FROM accounts WHERE email=$1',
    register_insert_query_user : 'INSERT INTO Users VALUES (DEFAULT, $1,$2,$3,$4,$5)',
    register_insert_query_admin : 'INSERT INTO Admins VALUES (DEFAULT, $1,$2,$3,$4,$5)',
    register_insert_query_RO : 'INSERT INTO RestaurantOwners VALUES (DEFAULT, $1,$2,$3,$4,$5)',
    register_no_duplicated_query : 'WITH account AS (SELECT email FROM users UNION SELECT email FROM admins UNION SELECT email FROM RestaurantOwners) SELECT 1 FROM account WHERE email= $1',
    user_add_point : "UPDATE users SET points = (SELECT points FROM users WHERE userid = $1) +$2 WHERE userid = $3",
    user_read_point : 'SELECT points FROM users WHERE userid = $1',

    reservations_read_query : 'SELECT * FROM Reservations NATURAL JOIN Availability',
    reservations_read_query_userID : 'SELECT * FROM Reservations NATURAL JOIN Availability NATURAL JOIN Restaurants  where userid = $1',
    reservations_read_query_aid_userID : 'SELECT numPeople FROM Reservations WHERE aid = $1 AND userID = $2',
    reservations_read_query_resid : "SELECT * FROM Reservations NATURAL JOIN Availability NATURAL JOIN users  WHERE resid = $1 AND attendance = $2 ",
    reservations_insert_query : "INSERT INTO Reservations VALUES ($1, 'booked', $2 , $3)",
    reservations_delete_query : 'DELETE FROM Reservations WHERE aid = $1 AND userid = $2',
    reservations_update_query : 'UPDATE Reservations SET attendance = $1 WHERE aid = $2 AND userid = $3',

    availability_read_query : 'SELECT * FROM Availability',
    availability_read_query_resid : 'SELECT * FROM Availability WHERE resid = $1',
    availability_read_query_aid : 'SELECT * FROM Availability WHERE aid = $1',
    availability_read_query_date : 'SELECT resid FROM Availability WHERE dateavailable = $1',
    availability_read_query_date_distinct : 'SELECT DISTINCT resid FROM Availability WHERE dateavailable = $1',
    availability_insert_query : 'INSERT INTO Availability VALUES  (DEFAULT,$1,$2, $3,$4,$5);',
    availability_update_query : 'UPDATE Availability SET dateAvailable = $1 , timeAvailableStart=$2, timeAvailableEnd=$3, numSeats=$4 WHERE aid = $5',
    availability_delete_query : 'DELETE FROM Availability WHERE aid = $1',
    availability_read_query_resid_date : 'SELECT * FROM Availability WHERE resid = $1 AND dateAvailable = $2',
    availability_minus_seat_query : "UPDATE Availability SET numSeats = (SELECT numSeats WHERE aid = $1) - $2 WHERE aid = $3",
    availability_add_seat_query : "UPDATE Availability SET numSeats = (SELECT numSeats WHERE aid = $1) + $2 WHERE aid = $3",
    availability_read_query_count_slot_restaurant : 'SELECT rname , sum(numSeats) FROM Availability NATURAL JOIN Restaurants GROUP BY rname',


    review_read_query : 'SELECT * FROM reviews NATURAL JOIN Restaurants WHERE userid= $1',
    review_insert_query : 'INSERT INTO reviews VALUES($1,$2,$3,$4)',
    review_delete_query : 'DELETE FROM reviews WHERE resid = $1 AND userid = $2',
    review_read_query_resId_userId : 'SELECT rname,rating, review FROM reviews, restaurants WHERE reviews.resid = $1 AND userid = $2',
    review_update_query : 'UPDATE reviews SET rating = $1 , review = $2 WHERE reviews.resid = $3 AND userid = $4',

    locations_read_query : 'SELECT * FROM locations',
    locations_insert_query : 'INSERT INTO locations VALUES ($1)',
    locations_delete_query : 'DELETE FROM locations WHERE town = $1',

    meals_read_query : 'SELECT * FROM meals',
    meals_insert_query : 'INSERT INTO meals VALUES ($1)',
    meals_delete_query : 'DELETE FROM meals WHERE mealType = $1',

    serves_read_query : 'SELECT * FROM serves WHERE resID = $1',
    serves_insert_query : 'INSERT INTO serves VALUES ($1,$2)',
    serves_delete_query : 'DELETE FROM serves WHERE resid = $1 AND mealtype = $2',

    cuisines_read_query : 'SELECT * FROM cuisines',
    cuisines_insert_query : 'INSERT INTO cuisines VALUES ($1)',
    cuisines_delete_query : 'DELETE FROM cuisines WHERE cuisine = $1',

    offers_read_query : 'SELECT * FROM Offers WHERE resID = $1',
    offers_insert_query : 'INSERT INTO offers VALUES ($1,$2)',
    offers_delete_query: 'DELETE FROM offers WHERE resid = $1 AND cuisine = $2',

    menu_read_query : 'SELECT * FROM  menu WHERE resID = $1',
    menu_insert_query : 'INSERT INTO menu VALUES ($1,$2,$3,$4)',
    menu_delete_query : 'DELETE FROM menu WHERE resid = $1 AND item = $2',

    filter_query : 'SELECT * FROM restaurants NATURAL JOIN offers NATURAL JOIN  serves WHERE cuisine = $1 AND mealtype = $2',
    restaurant_recommendation : 'WITH UserCuisines AS (\n' +
        '\tSELECT O1.cuisine AS cuisine, COUNT(*) AS numReservations\n' +
        '\tFROM (Reservations R LEFT JOIN Availability A on R.aid = A.aid) \n' +
        'LEFT JOIN Offers O1 ON A.resID = O1.resID\n' +
        '\tWHERE R.userID = $1\n' +
        '\tGROUP BY O1.cuisine ),\n' +
        'OtherCuisines AS ( \n' +
        '\tSELECT C.cuisine, 0 AS numReservations \n' +
        '\tFROM Cuisines C\n' +
        '\tWHERE C.cuisine NOT IN (SELECT UC.cuisine FROM UserCuisines UC)),\n' +
        'TopCuisines AS (\n' +
        '\tSELECT * FROM UserCuisines\n' +
        '\tUNION\n' +
        '\tSELECT * FROM OtherCuisines\n' +
        '\tORDER BY numReservations DESC \n' +
        '\tLIMIT 3 ),\n' +
        'RestaurantRating AS (\n' +
        '\tSELECT Res.resID AS resID, Res.rname AS rname, COALESCE(AVG(Rev.rating),0) AS rating\n' +
        '\tFROM Restaurants Res LEFT JOIN Reviews Rev ON Res.resID = Rev.resID\n' +
        '\tGROUP BY Res.resID )\n' +
        'SELECT DISTINCT RR.resID, RR.rname, RR.rating\n' +
        'FROM RestaurantRating RR LEFT JOIN Offers O ON RR.resID = O.resID\n' +
        'WHERE O.cuisine IN (SELECT TC.cuisine FROM TopCuisines TC)\n' +
        'ORDER BY RR.rating DESC\n' +
        'LIMIT 10\n' +
        ';\n',
    history_reservation: 'WITH \n' +
        'DateHasReservation AS ( \n' +
        '\tSELECT A.dateAvailable AS sDate, SUM(R.numPeople) AS totalNumAttendees\n' +
        '\tFROM Availability A LEFT JOIN Reservations R ON A.aid = R.aid\n' +
        '\tWHERE A.resID = $1\n' +
        '\tAND R.attendance = \'attended\'\n' +
        '\tAND A.dateAvailable <= $2 \n' +
        '\tGROUP BY A.dateAvailable\n' +
        '),\n' +
        'DateNoReservation AS ( \n' +
        '\tSELECT A.dateAvailable AS sDate, 0 AS totalNumAttendees\n' +
        '\tFROM Availability A\n' +
        '\tWHERE A.resID = $3\n' +
        '\tAND A.dateAvailable <= $4' +
        '\tAND A.dateAvailable NOT IN (SELECT sDate FROM DateHasReservation)\n' +
        ')\n' +
        'SELECT * FROM DateHasReservation UNION SELECT * FROM DateNoReservation\n' +
        'ORDER BY sDate\n' +
        ';\n',
    admin_monitor : "WITH \n" +
        "DailyRestaurantBooking AS (\n" +
        "\tSELECT R.resID, A.dateAvailable AS sDate, \n" +
        "COUNT(DISTINCT (RSV.userID, RSV.aid)) AS numBooking\n" +
        "\tFROM (Restaurants R INNER JOIN Availability A ON R.resID = A.resID)\n" +
        "\t\t INNER JOIN Reservations RSV ON A.aid = RSV.aid\n" +
        "\tWHERE A.dateAvailable <= $1 \n" +
        "\tGROUP BY R.resID, A.dateAvailable\n" +
        "),\n" +
        "HasAvailabilityRecord AS(\n" +
        "\tSELECT resID, AVG(numBooking) AS AvgBooking\n" +
        "\tFROM DailyRestaurantBooking\n" +
        "\tGROUP BY resID\n" +
        "),\n" +
        "NoAvailabilityRecord AS (\n" +
        "\tSELECT resID, 0 AS AvgBooking \n" +
        "\tFROM Restaurants R \n" +
        "\tWHERE resID NOT IN (SELECT resID FROM HasAvailabilityRecord)\n" +
        "),\n" +
        "AverageRestaurantBooking AS (\n" +
        "\tSELECT * FROM HasAvailabilityRecord UNION SELECT * FROM NoAvailabilityRecord\n" +
        "),\n" +
        "RestaurantRating AS (\n" +
        "\tSELECT Res.resID AS resID, COALESCE(AVG(Rev.rating),0) AS rating\n" +
        "\tFROM Restaurants Res LEFT JOIN Reviews Rev ON Res.resID = Rev.resID\n" +
        "\tGROUP BY Res.resID \n" +
        ")\n" +
        "SELECT R1.resID, R1.AvgBooking, R2.rating, RE.rname\n" +
        "FROM AverageRestaurantBooking R1 NATURAL JOIN RestaurantRating R2 NATURAL JOIN Restaurants RE\n" +
        "ORDER BY R1.AvgBooking DESC, R2.rating DESC\n" +
        ";\n",
};