package com.example.project3.service;

import com.example.project3.dao.SchoolDAO;
import com.example.project3.dao.UserDAO;
import com.example.project3.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {
    private final UserDAO userDAO;
    private final SchoolDAO schoolDAO;

    public UserService(UserDAO userDAO, SchoolDAO schoolDAO) {
        this.userDAO   = userDAO;
        this.schoolDAO = schoolDAO;
    }

    public int updateFinalSchool(Long userId, String finalSchool) {
        try {
            User user = userDAO.findById(userId);
            user.setFinalSchool(finalSchool);
            return userDAO.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update final school", e);
        }
    }

    @Transactional
    public void updateUserSchools(Long userId, List<String> schoolNames) {
        // 1) clear out old choices
        userDAO.deleteUserSchoolsByUserId(userId);

        // 2) for each name, look it up — if not found, error out
        for (String name : schoolNames) {
            Long schoolId = schoolDAO.findIdByName(name);
            if (schoolId == null) {
                throw new IllegalArgumentException("Unknown school: " + name);
            }
            userDAO.insertUserSchool(userId, schoolId);
        }
    }

    public String getFinalSchool(Long userId) {
        try {
            User user = userDAO.findById(userId);
            return user.getFinalSchool();
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve final school", e);
        }
    }

    public String registerUser(User user) {
        if (userDAO.userExists(user.getEmail())) {
            return "User already exists!";
        }
        userDAO.save(user);
        return "User registered successfully!";
    }

    public User getUserByEmail(String email) {
        return userDAO.findByEmail(email);
    }

    public User getUserById(Long id) {
        return userDAO.findById(id);
    }

    public int save(User user) {
        return userDAO.save(user);
    }

    public List<String> getUserSchools(Long userId) {
        return userDAO.findSchoolsByUserId(userId);
    }

    @Transactional
    public void clearUserSchools(Long userId) {
        userDAO.callClearUserSchools(userId.intValue());
    }

}
