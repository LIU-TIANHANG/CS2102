module.exports = {
    restaurants_read_query : 'SELECT * FROM Restaurants',
    restaurants_read_query_id : 'SELECT * FROM Restaurants WHERE resid = $1',
    restaurants_read_query_name_basedOn_id : 'SELECT rname FROM Restaurants WHERE resid = $1',
    restaurants_read_query_id_basedOn_name : 'SELECT resid FROM Restaurants WHERE rname = $1',
    restaurants_read_query_name : 'SELECT resid,rname FROM Restaurants',
    restaurants_insert_query :  'INSERT INTO Restaurants VALUES (DEFAULT,$1,$2,$3,$4,$5)',
    restaurants_delete_query : 'DELETE FROM Restaurants WHERE resid = $1',
    restaurants_update_query : 'UPDATE Restaurants SET rname = $1 , openingHour=$2, cuisine=$3, intro=$4, contactNumber=$5 WHERE resid = $6',


    login_read_query_email : 'SELECT userid, email, password FROM users WHERE email=$1',
    login_read_query_id : 'SELECT userid, email, password FROM users WHERE userid=$1',
    register_insert_query : 'INSERT INTO Users VALUES (DEFAULT, $1,$2,$3,$4,$5)',
    register_no_duplicated_query : 'SELECT 1 FROM Users WHERE email= $1',

    reservations_read_query : 'SELECT * FROM Reservations NATURAL JOIN Availability',
    reservations_insert_query : "INSERT INTO Reservations VALUES (DEFAULT, $1, 'true', $2 , $3, $4)",
    reservations_delete_query : 'DELETE FROM Reservations WHERE rsvid = $1',


    availability_read_query : 'SELECT * FROM Availability',
    availability_read_query_resid : 'SELECT * FROM Availability WHERE resid = $1',
    availability_read_query_aid : 'SELECT * FROM Availability WHERE aid = $1',
    availability_insert_query : 'INSERT INTO Availability VALUES  (DEFAULT,$1,$2, $3,$4,$5);',
    availability_update_query : 'UPDATE Availability SET dateAvailable = $1 , timeAvailableStart=$2, timeAvailableEnd=$3, numSeats=$4 WHERE aid = $5',
    availability_delete_query : 'DELETE FROM Availability WHERE aid = $1',
    availability_read_query_resid_date : 'SELECT * FROM Availability WHERE resid = $1 AND dateAvailable = $2',
    availability_minus_seat_query : "UPDATE Availability SET numSeats = (SELECT numSeats WHERE aid = $1) - $2 WHERE aid = $3",

    review_read_query : 'SELECT * FROM reviews',
    review_insert_query : 'INSERT INTO reviews VALUES($1,$2,$3,$4)',
    review_delete_query : 'DELETE FROM reviews WHERE resid = $1 AND userid = $2',
    review_read_query_resId_userId : 'SELECT rname,rating, review FROM reviews, restaurants WHERE reviews.resid = $1 AND userid = $2',
    review_update_query : 'UPDATE reviews SET rating = $1 , review = $2 WHERE reviews.resid = $3 AND userid = $4'
};