module.exports = {
    restaurants_read_query : 'SELECT * FROM Restaurants',
    restaurants_read_query_id : 'SELECT * FROM Restaurants WHERE rid = $1',
    restaurants_insert_query :  'INSERT INTO Restaurants VALUES (DEFAULT,$1,$2,$3,$4,$5)',
    restaurants_delete_query : 'DELETE FROM Restaurants WHERE rid = $1',
    restaurants_update_query : 'UPDATE Restaurants SET rname = $1 , openingHour=$2, cuisine=$3, intro=$4, contactNumber=$5 WHERE rid = $6',

    login_read_query_email : 'SELECT userid, email, password FROM users WHERE email=$1',
    login_read_query_id : 'SELECT userid, email, password FROM users WHERE userid=$1',
    register_insert_query : 'INSERT INTO Users VALUES (DEFAULT, $1,$2,$3,$4,$5)',
    register_no_duplicated_query : 'SELECT 1 FROM Users WHERE email= $1',

    reservations_read_query : 'SELECT * FROM Reservations',

};