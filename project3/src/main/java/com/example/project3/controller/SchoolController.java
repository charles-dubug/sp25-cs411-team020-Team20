package com.example.project3.controller;

import com.example.project3.model.School;
import com.example.project3.service.SchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schools")
public class SchoolController {

    @Autowired
    private SchoolService schoolService;

    /**
     * GET /schools
     * Retrieve all schools.
     */
    @GetMapping
    public ResponseEntity<List<School>> getAllSchools() {
        List<School> schools = schoolService.getAllSchools();
        return ResponseEntity.ok(schools);
    }

    /**
     * GET /schools/{id}
     * Retrieve a single school by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<School> getSchoolById(@PathVariable Long id) {
        School school = schoolService.getSchoolById(id);
        if (school == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(school);
    }

    /**
     * GET /schools/search?name={name}
     * Lookup a school's ID by its name.
     */
    @GetMapping("/search")
    public ResponseEntity<?> findIdByName(@RequestParam String name) {
        Long id = schoolService.findIdByName(name);
        if (id == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No school found with name: " + name);
        }
        return ResponseEntity.ok(id);
    }

    /**
     * POST /schools
     * Create a new school.
     */
    @PostMapping
    public ResponseEntity<?> createSchool(@RequestBody School school) {
        try {
            Long newId = schoolService.createSchool(school);
            return ResponseEntity.status(HttpStatus.CREATED).body(newId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    /**
     * PUT /schools/{id}
     * Update an existing school.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchool(
            @PathVariable Long id,
            @RequestBody School school
    ) {
        if (!id.equals(school.getSchoolId())) {
            return ResponseEntity.badRequest().body("ID in path and payload must match");
        }
        try {
            int rows = schoolService.updateSchool(school);
            return ResponseEntity.ok("Updated " + rows + " record(s)");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * DELETE /schools/{id}
     * Delete a school by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchool(@PathVariable Long id) {
        try {
            int rows = schoolService.deleteSchool(id);
            return ResponseEntity.ok("Deleted " + rows + " record(s)");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * POST /schools/batch
     * Batch-fetch multiple schools by a list of IDs.
     */
    @PostMapping("/batch")
    public ResponseEntity<List<School>> getSchoolsByIds(@RequestBody List<Long> ids) {
        List<School> schools = schoolService.getSchoolsByIds(ids);
        return ResponseEntity.ok(schools);
    }
}
