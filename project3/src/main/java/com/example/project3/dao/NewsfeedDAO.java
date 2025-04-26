package com.example.project3.dao;

import com.example.project3.model.Newsfeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class NewsfeedDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Newsfeed> findAllNewsfeeds() {
        String sql = "SELECT id, user_id, school_id, academic, tuition, location, comment, timestamp FROM NewsFeed ORDER BY timestamp DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Newsfeed newsfeed = new Newsfeed();
            newsfeed.setId(rs.getInt("id"));
            newsfeed.setUserId(rs.getInt("user_id"));
            newsfeed.setSchoolId(rs.getInt("school_id"));
            newsfeed.setAcademic(rs.getInt("academic"));
            newsfeed.setTuition(rs.getInt("tuition"));
            newsfeed.setLocation(rs.getInt("location"));
            newsfeed.setComment(rs.getString("comment"));
            newsfeed.setTimestamp(rs.getTimestamp("timestamp").toLocalDateTime());
            return newsfeed;
        });
    }

    public List<Newsfeed> findNewsfeedsBySchoolId(int schoolId) {
        String sql = "SELECT id, user_id, school_id, academic, tuition, location, comment, timestamp FROM NewsFeed WHERE school_id = ? ORDER BY timestamp DESC";
        return jdbcTemplate.query(sql, new Object[]{schoolId}, (rs, rowNum) -> {
            Newsfeed newsfeed = new Newsfeed();
            newsfeed.setId(rs.getInt("id"));
            newsfeed.setUserId(rs.getInt("user_id"));
            newsfeed.setSchoolId(rs.getInt("school_id"));
            newsfeed.setAcademic(rs.getInt("academic"));
            newsfeed.setTuition(rs.getInt("tuition"));
            newsfeed.setLocation(rs.getInt("location"));
            newsfeed.setComment(rs.getString("comment"));
            newsfeed.setTimestamp(rs.getTimestamp("timestamp").toLocalDateTime());
            return newsfeed;
        });
    }

    public int insertNewsfeed(Newsfeed newsfeed) {
        String sql = "INSERT INTO NewsFeed (id, user_id, school_id, academic, tuition, location, comment, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                newsfeed.getId(),
                newsfeed.getUserId(),
                newsfeed.getSchoolId(),
                newsfeed.getAcademic(),
                newsfeed.getTuition(),
                newsfeed.getLocation(),
                newsfeed.getComment(),
                Timestamp.valueOf(newsfeed.getTimestamp())
        );
    }

    public List<Newsfeed> findNewsfeedsByUserId(int userId) {
        String sql = """
        SELECT n.id,
               n.user_id,
               n.school_id,
               n.academic,
               n.tuition,
               n.location,
               n.comment,
               n.timestamp
          FROM NewsFeed n
          JOIN User_Schools u
            ON n.school_id = u.SchoolId
         WHERE u.User_id = ?
         ORDER BY n.timestamp DESC
        """;
        return jdbcTemplate.query(sql, new Object[]{userId}, (rs, rowNum) -> {
            Newsfeed nf = new Newsfeed();
            nf.setId(rs.getInt("id"));
            nf.setUserId(rs.getInt("user_id"));
            nf.setSchoolId(rs.getInt("school_id"));
            nf.setAcademic(rs.getInt("academic"));
            nf.setTuition(rs.getInt("tuition"));
            nf.setLocation(rs.getInt("location"));
            nf.setComment(rs.getString("comment"));
            nf.setTimestamp(rs.getTimestamp("timestamp").toLocalDateTime());
            return nf;
        });
    }

}

/*
DELIMITER $$

CREATE TRIGGER fix_newsfeed_update
BEFORE UPDATE ON NewsFeed
FOR EACH ROW
BEGIN
  IF NEW.Academic < 1 OR NEW.Academic > 5 THEN
    SET NEW.Academic = 3;
  END IF;
  IF NEW.Tuition < 1 OR NEW.Tuition > 5 THEN
    SET NEW.Tuition = 3;
  END IF;
  IF NEW.Location < 1 OR NEW.Location > 5 THEN
    SET NEW.Location = 3;
  END IF;
END$$

DELIMITER;

* */


/*
ALTER TABLE NewsFeed
ADD CONSTRAINT check_academic_rating
CHECK (Academic BETWEEN 1 AND 5);

ALTER TABLE NewsFeed
ADD CONSTRAINT check_tuition_rating
CHECK (Tuition BETWEEN 1 AND 5);

ALTER TABLE NewsFeed
ADD CONSTRAINT check_location_rating
CHECK (Location BETWEEN 1 AND 5);

* */
