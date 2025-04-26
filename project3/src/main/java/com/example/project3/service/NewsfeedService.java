package com.example.project3.service;

import com.example.project3.model.Newsfeed;
import com.example.project3.dao.NewsfeedDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NewsfeedService {

    @Autowired
    private NewsfeedDAO newsfeedDAO;

    public List<Newsfeed> getAllNewsfeeds() {
        return newsfeedDAO.findAllNewsfeeds();
    }

    public List<Newsfeed> getNewsfeedsBySchoolId(int schoolId) {
        return newsfeedDAO.findNewsfeedsBySchoolId(schoolId);
    }

    public int addNewsfeed(Newsfeed newsfeed) {
        return newsfeedDAO.insertNewsfeed(newsfeed);
    }

    public List<Newsfeed> getNewsfeedsByUserId(int userId) {
        return newsfeedDAO.findNewsfeedsByUserId(userId);
    }
}
