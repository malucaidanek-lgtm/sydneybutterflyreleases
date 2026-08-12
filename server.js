
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors"); const app = express();
app.use(cors()); app.use(express.json());
app.use(express.static("public"));
 const db = new sqlite3.Database("/data/database.db");
 
// Create stock table
db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS stock (
            id INTEGER PRIMARY KEY,
            quantity INTEGER
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO stock
        (id, quantity)
        VALUES (1, 50)
    `);
});

// Get stock
app.get("/stock", (req, res) => {

    db.get(
        "SELECT quantity FROM stock WHERE id = 1",
        (err, row) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(row);
        }
    );
});

// Reduce stock
app.post("/reduce-stock", (req, res) => {

    const quantity = req.body.quantity;

    db.run(
        `UPDATE stock
         SET quantity = quantity - ?
         WHERE id = 1`,
        [quantity],
        function(err) {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true
            });
        }
    );
});
app.post("/set-stock", (req, res) => {

    const quantity = req.body.quantity;

    db.run(
        `UPDATE stock
         SET quantity = ?
         WHERE id = 1`,
        [quantity],
        function(err) {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true
            });
        }
    );
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
