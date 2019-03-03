module.exports = {
    restaurants_read_query : 'SELECT * FROM Restaurants',
    restaurants_insert_query :  'INSERT INTO Restaurants VALUES (DEFAULT,$1,$2,$3,$4)',
    restaurants_delete_query : 'DELETE FROM Restaurants WHERE id = $1',
};