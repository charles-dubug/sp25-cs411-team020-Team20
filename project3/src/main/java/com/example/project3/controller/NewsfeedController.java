package com.example.project3.controller;

import com.example.project3.model.Newsfeed;
import com.example.project3.service.NewsfeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/newsfeed")
public class NewsfeedController {

    @Autowired
    private NewsfeedService newsfeedService;

    @GetMapping
    public List<Newsfeed> getAllNewsfeeds() {
        return newsfeedService.getAllNewsfeeds();
    }

    @GetMapping("/school/{schoolId}")
    public List<Newsfeed> getNewsfeedsBySchoolId(@PathVariable int schoolId) {
        return newsfeedService.getNewsfeedsBySchoolId(schoolId);
    }

    @PostMapping
    public String addNewsfeed(@RequestBody Newsfeed newsfeed) {
        int rowsInserted = newsfeedService.addNewsfeed(newsfeed);
        if (rowsInserted > 0) {
            return "Newsfeed entry added successfully!";
        } else {
            return "Failed to add newsfeed entry.";
        }
    }

    @GetMapping("/user/{userId}")
    public List<Newsfeed> getNewsfeedsForUser(@PathVariable int userId) {
        return newsfeedService.getNewsfeedsByUserId(userId);
    }


}
