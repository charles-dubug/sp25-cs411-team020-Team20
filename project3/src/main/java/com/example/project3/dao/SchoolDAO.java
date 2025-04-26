package com.example.project3.dao;

import com.example.project3.model.School;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.List;

@Repository
public class SchoolDAO {
    private final JdbcTemplate jdbc;

    public SchoolDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<School> schoolRowMapper = (rs, rowNum) -> {
        School school = new School();
        school.setSchoolId(rs.getLong("School_id"));
        school.setName(rs.getString("Name"));
        school.setLocation(rs.getString("Location"));
        school.setTuition(rs.getBigDecimal("Tuition"));
        return school;
    };

    /**
     * Look up an existing school by name; returns its PK or null if not found
     */
    public Long findIdByName(String name) {
        String sql = "SELECT School_id FROM Schools WHERE Name = ?";
        List<Long> ids = jdbc.queryForList(sql, new Object[]{name}, Long.class);
        return ids.isEmpty() ? null : ids.get(0);
    }

    /**
     * Insert a new School. On success, returns the generated School_id.
     */
    public Long insert(School school) {
        String sql = """
            INSERT INTO Schools (Name, Location, Tuition)
            VALUES (?, ?, ?)
            """;
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update((Connection con) -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, school.getName());
            ps.setString(2, school.getLocation());
            ps.setBigDecimal(3, school.getTuition());
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        return (key != null) ? key.longValue() : null;
    }

    /**
     * Update an existing School. Returns number of rows affected.
     */
    public int update(School school) {
        String sql = """
            UPDATE Schools
               SET Name = ?, Location = ?, Tuition = ?
             WHERE School_id = ?
            """;
        return jdbc.update(
                sql,
                school.getName(),
                school.getLocation(),
                school.getTuition(),
                school.getSchoolId()
        );
    }

    /**
     * Save a School: insert if id==null, otherwise update.
     * Returns the new id on insert, or the number of rows affected on update.
     */
    public Object save(School school) {
        if (school.getSchoolId() == null) {
            return insert(school);
        } else {
            return update(school);
        }
    }

    /**
     * Find a school by its primary key.
     */
    public School findById(Long id) {
        String sql = """
            SELECT School_id, Name, Location, Tuition
              FROM Schools
             WHERE School_id = ?
            """;
        List<School> schools = jdbc.query(sql, new Object[]{id}, schoolRowMapper);
        return schools.isEmpty() ? null : schools.get(0);
    }

    /**
     * Retrieve all schools in the database.
     */
    public List<School> findAll() {
        String sql = """
            SELECT School_id, Name, Location, Tuition
              FROM Schools
            ORDER BY Name
            """;
        return jdbc.query(sql, schoolRowMapper);
    }

    /**
     * Delete a school by id. Returns number of rows affected.
     */
    public int deleteById(Long id) {
        String sql = "DELETE FROM Schools WHERE School_id = ?";
        return jdbc.update(sql, id);
    }

    /**
     * Batch-fetch schools by a list of IDs.
     */
    public List<School> findByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        String inSql = String.join(",", ids.stream().map(i -> "?").toList());
        String sql = String.format("""
            SELECT School_id, Name, Location, Tuition
              FROM Schools
             WHERE School_id IN (%s)
            """, inSql);
        return jdbc.query(sql, ids.toArray(), schoolRowMapper);
    }
}
