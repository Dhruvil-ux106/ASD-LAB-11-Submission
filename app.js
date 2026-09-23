const express = require('express');
const app = express();
app.use(express.json());
const pool = require('./db')

app.get('/assignments',async(req,res)=>{
   try {
    result = await pool.query(`SELECT * FROM assignments ORDER BY id desc;`)
    res.end(JSON.stringify(result.rows))
  }catch (err) {
    console.error('Error connecting to the database', err)
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

