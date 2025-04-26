const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

// Database connection pool
const pool = mysql.createPool({
    host: '34.59.117.251',
    user: 'root',
    password: '',
    database: 'university_rankings'
});

app.get('/api/rankings', async (req, res) => {
    try {

        let query = `
            SELECT 
                s.School_id,
                s.Name,
                s.Country AS Country,
                ROUND(AVG(qs.Ranking), 1) AS Avg_QS_Rank,
                ROUND(AVG(usn.Ranking), 1) AS Avg_USNews_Rank,
                ROUND((COALESCE(qs.Ranking, 1000) + COALESCE(usn.Ranking, 1000)) / 2, 1) AS Combined_Score
            FROM Schools s
            LEFT JOIN QS_RANKING qs ON s.School_id = qs.School_id
            LEFT JOIN US_NEWS_RANKING usn ON s.School_id = usn.School_id
        `;
        const whereClauses = [];
        const params = [];
        
        // Search filter
        if (req.query.search) {
            whereClauses.push('s.Name LIKE ?');
            params.push(`%${req.query.search}%`);
        }
        

        if (req.query.country && req.query.country !== 'all') {
            whereClauses.push('s.Country = ?');
            params.push(req.query.country);
        }
        
        // Add WHERE if we have any filters
        if (whereClauses.length > 0) {
            query += ' WHERE ' + whereClauses.join(' AND ');
        }
        
        // Add GROUP BY
        query += ' GROUP BY s.School_id, s.Name';
        
        // Add ORDER BY based on sort options
        let orderBy = 'Combined_Score';
        if (req.query.sortBy === 'qs') {
            orderBy = 'Avg_QS_Rank';
        } else if (req.query.sortBy === 'usnews') {
            orderBy = 'Avg_USNews_Rank';
        } else if (req.query.sortBy === 'name') {
            orderBy = 's.Name';
        }
        
        const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';
        query += ` ORDER BY ${orderBy} ${sortOrder}`;
        
        // Execute query
        const [rows] = await pool.query(query, params);
        

        let filteredRows = rows;
        if (req.query.rankRange && req.query.rankRange !== 'all') {
            const range = req.query.rankRange;
            if (range === 'top10') {
                filteredRows = rows.slice(0, 10);
            } else if (range === 'top50') {
                filteredRows = rows.slice(0, 50);
            } else if (range === 'top100') {
                filteredRows = rows.slice(0, 100);
            } else if (range === '101-200') {
                filteredRows = rows.slice(100, 200);
            } else if (range === '201-500') {
                filteredRows = rows.slice(200, 500);
            } else if (range === '501+') {
                filteredRows = rows.slice(500);
            }
        }
        
        res.json(filteredRows);
    } catch (error) {
        console.error('Error fetching rankings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});