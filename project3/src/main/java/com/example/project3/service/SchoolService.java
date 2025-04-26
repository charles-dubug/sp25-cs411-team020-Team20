package com.example.project3.service;

import com.example.project3.dao.SchoolDAO;
import com.example.project3.model.School;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SchoolService {
    private final SchoolDAO schoolDAO;

    public SchoolService(SchoolDAO schoolDAO) {
        this.schoolDAO = schoolDAO;
    }

    /**
     * Look up a school’s ID by its name.
     * @return the PK of the school or null if none found
     */
    public Long findIdByName(String name) {
        return schoolDAO.findIdByName(name);
    }

    /**
     * Register a new school in the system.
     * @throws IllegalArgumentException if a school with the same name already exists
     * @return the generated school ID
     */
    @Transactional
    public Long createSchool(School school) {
        // prevent duplicates
        if (schoolDAO.findIdByName(school.getName()) != null) {
            throw new IllegalArgumentException("School already exists: " + school.getName());
        }
        return schoolDAO.insert(school);
    }

    /**
     * Update an existing school.
     * @throws IllegalArgumentException if the school doesn’t exist
     * @return number of rows affected (should be 1)
     */
    @Transactional
    public int updateSchool(School school) {
        if (school.getSchoolId() == null || schoolDAO.findById(school.getSchoolId()) == null) {
            throw new IllegalArgumentException("Cannot update non-existent school with ID: " + school.getSchoolId());
        }
        return schoolDAO.update(school);
    }

    /**
     * Create or update a school in one call.
     * @return on insert, the new ID; on update, the number of rows affected
     */
    @Transactional
    public Object saveSchool(School school) {
        if (school.getSchoolId() == null) {
            return createSchool(school);
        } else {
            return updateSchool(school);
        }
    }

    /**
     * Fetch a school by its primary key.
     */
    @Transactional(readOnly = true)
    public School getSchoolById(Long id) {
        return schoolDAO.findById(id);
    }

    /**
     * Fetch all schools.
     */
    @Transactional(readOnly = true)
    public List<School> getAllSchools() {
        return schoolDAO.findAll();
    }

    /**
     * Delete a school.
     * @throws IllegalArgumentException if the school doesn’t exist
     * @return number of rows deleted (should be 1)
     */
    @Transactional
    public int deleteSchool(Long id) {
        if (schoolDAO.findById(id) == null) {
            throw new IllegalArgumentException("Cannot delete non-existent school with ID: " + id);
        }
        return schoolDAO.deleteById(id);
    }

    /**
     * Helper to batch-fetch a list of schools by ID.
     */
    @Transactional(readOnly = true)
    public List<School> getSchoolsByIds(List<Long> ids) {
        return schoolDAO.findByIds(ids);
    }
}
