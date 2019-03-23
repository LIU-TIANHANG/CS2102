module.exports = {
    restaurants_read_query : 'SELECT * FROM Restaurants',
    restaurants_read_query_id : 'SELECT * FROM Restaurants WHERE rid = $1',
    restaurants_read_query_name_basedOn_id : 'SELECT rname FROM Restaurants WHERE rid = $1',
    restaurants_read_query_id_basedOn_name : 'SELECT rid FROM Restaurants WHERE rname = $1',
    restaurants_read_query_name : 'SELECT rid,rname FROM Restaurants',
    restaurants_insert_query :  'INSERT INTO Restaurants VALUES (DEFAULT,$1,$2,$3,$4,$5)',
    restaurants_delete_query : 'DELETE FROM Restaurants WHERE rid = $1',
    restaurants_update_query : 'UPDATE Restaurants SET rname = $1 , openingHour=$2, cuisine=$3, intro=$4, contactNumber=$5 WHERE rid = $6',


    login_read_query_email : 'SELECT userid, email, password FROM users WHERE email=$1',
    login_read_query_id : 'SELECT userid, email, password FROM users WHERE userid=$1',
    register_insert_query : 'INSERT INTO Users VALUES (DEFAULT, $1,$2,$3,$4,$5)',
    register_no_duplicated_query : 'SELECT 1 FROM Users WHERE email= $1',

    reservations_read_query : 'SELECT * FROM Reservations',
    reservations_insert_query : "INSERT INTO Reservations VALUES (DEFAULT, $1, $2,$3, 'true', $4 , $5)",
    reservations_delete_query : 'DELETE FROM Reservations WHERE rsvid = $1',


    availability_read_query : 'SELECT * FROM Availability',
    availability_read_query_rid : 'SELECT * FROM Availability WHERE rid = $1',
    availability_read_query_aid : 'SELECT * FROM Availability WHERE aid = $1',
    availability_insert_query : 'INSERT INTO Availability VALUES  (DEFAULT,$1,$2, $3,$4,$5);',
    availability_update_query : 'UPDATE Availability SET dateAvailable = $1 , timeAvailableStart=$2, timeAvailableEnd=$3, numSeats=$4 WHERE aid = $5',
    availability_delete_query : 'DELETE FROM Availability WHERE aid = $1',
    availability_read_query_rid_date : 'SELECT * FROM Availability WHERE rid = $1 AND dateAvailable = $2',
};