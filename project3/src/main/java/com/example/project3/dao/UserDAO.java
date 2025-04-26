package com.example.project3.dao;

import com.example.project3.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserDAO {

    private final JdbcTemplate jdbcTemplate;

    public UserDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setId(rs.getLong("Id"));
        user.setEmail(rs.getString("Email"));
        user.setPassword(rs.getString("Password"));
        user.setFinalSchool(rs.getString("FinalSchool"));
        return user;
    };

    public int save(User user) {
        if (user.getId() == null) {
            String sql = """
                INSERT INTO Users (Email, Password, FinalSchool)
                VALUES (?, ?, ?)
                """;
            return jdbcTemplate.update(
                    sql,
                    user.getEmail(),
                    user.getPassword(),
                    user.getFinalSchool()
            );
        } else {
            String sql = """
                UPDATE Users
                SET Email = ?, Password = ?, FinalSchool = ?
                WHERE Id = ?
                """;
            return jdbcTemplate.update(
                    sql,
                    user.getEmail(),
                    user.getPassword(),
                    user.getFinalSchool(),
                    user.getId()
            );
        }
    }

    public User findByEmail(String email) {
        String sql = """
            SELECT Id, Email, Password, FinalSchool
              FROM Users
             WHERE Email = ?
            """;
        List<User> matches = jdbcTemplate.query(sql, new Object[]{email}, userRowMapper);
        return matches.isEmpty() ? null : matches.get(0);
    }

    public User findById(Long id) {
        String sql = """
            SELECT Id, Email, Password, FinalSchool
              FROM Users
             WHERE Id = ?
            """;
        List<User> matches = jdbcTemplate.query(sql, new Object[]{id}, userRowMapper);
        return matches.isEmpty() ? null : matches.get(0);
    }

    public boolean userExists(String email) {
        String sql = "SELECT COUNT(*) FROM Users WHERE Email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, new Object[]{email}, Integer.class);
        return count != null && count > 0;
    }

    public List<String> findSchoolsByUserId(Long userId) {
        String sql = """
        SELECT s.Name
          FROM User_Schools us
          JOIN Schools s
            ON us.SchoolId = s.School_id
         WHERE us.User_id = ?
        """;
        return jdbcTemplate.queryForList(sql, new Object[]{userId}, String.class);
    }

    public void deleteUserSchoolsByUserId(Long userId) {
        String sql = "DELETE FROM User_Schools WHERE User_id = ?";
        jdbcTemplate.update(sql, userId);
    }

    public int insertUserSchool(Long userId, Long schoolId) {
        String sql = """
      INSERT INTO User_Schools (User_id, SchoolId)
      VALUES (?, ?)
      """;
        return jdbcTemplate.update(sql, userId, schoolId);
    }

    public void callClearUserSchools(int userId) {
        String sql = "CALL sp_clear_user_schools(?)";
        jdbcTemplate.update(sql, userId);
    }


}
