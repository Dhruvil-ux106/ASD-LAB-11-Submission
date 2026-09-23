const express = require('express');
const app = express();
app.use(express.json());
const pool = require('./db')

app.get('/assignments',async(req,res)=>{
  const submitted = req.query.submitted
  const query = submitted === 'true'
    ? 'SELECT * FROM assignments WHERE submitted = $1 ORDER BY id DESC'
    : 'SELECT * FROM assignments ORDER BY id DESC'
  const values = submitted === 'true' ? [true] : []

  try {
    const result = await pool.query(query, values)
    res.json(result.rows)
  } catch (err) {
    console.error('Error connecting to the database', err)
    res.status(500).json({error: 'Could not retrieve assignments'})
  }
})

app.post('/assignments',async(req,res)=>{
    const {title,deadline} = req.body
    try{
        console.log(title,deadline)
        const result = await pool.query(
          'INSERT INTO assignments (title, deadline) VALUES ($1, $2) RETURNING *',
          [title, deadline]
        )
        res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error connecting to the database', err)
    res.status(500).json({error: 'Could not save assignment'})
    }
})
 

app.listen(3000,()=>{
    console.log('Server is running on port 3000')
})

