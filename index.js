const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const port = process.env.PORT || 3003; // Choose your desired port

app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./dua_main.sqlite');

app.get('/api/dua', (req, res) => {
    const { cat_id,subcat_id } = req.query;
 
    let duaQuery = 'SELECT * FROM dua';
  
    // If cat_id is provided, add a WHERE clause to filter by cat_id
    if (cat_id) {
      duaQuery += ` WHERE cat_id = ${cat_id}`;
    }
    if (subcat_id) {
        duaQuery += ` AND subcat_id = ${subcat_id}`;
      }
    db.all(duaQuery, (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(rows);
      }
    });
  });
  
  // API route to fetch a single dua record based on the id
  app.get('/api/dua/:id', (req, res) => {
    const { id } = req.params;
    const duaIdQuery = 'SELECT * FROM dua WHERE id = ?';
  
    db.get(duaIdQuery, [id], (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (!row) {
        res.status(404).json({ error: 'Dua not found' });
      } else {
        res.status(200).json(row);
      }
    });
  });

// Example API route to fetch data from the 'category' table
app.get('/api/category', (req, res) => {
  const categoryQuery = 'SELECT * FROM category';

  db.all(categoryQuery, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(rows);
    }
  });
});
app.get('/', (req,res)=>{
    res.send("My dua information coming soon... Has come")
})
// Example API route to fetch data from the 'sub_category' table
app.get('/api/sub_category', (req, res) => {
    const { cat_id } = req.query;
  let subCategoryQuery = 'SELECT * FROM sub_category';

  if (cat_id) {
    subCategoryQuery += ` WHERE cat_id = ${cat_id}`;
  }
  db.all(subCategoryQuery, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
