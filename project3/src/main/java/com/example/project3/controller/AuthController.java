package com.example.project3.controller;

import com.example.project3.model.User;
import com.example.project3.service.UserService;
import com.example.project3.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User storedUser = userService.getUserByEmail(user.getEmail());
        if (storedUser == null || !storedUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials!");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(token);
    }

    @PutMapping("/{id}/schools")
    public ResponseEntity<?> updateUserSchools(
            @PathVariable Long id,
            @RequestBody List<String> schoolNames,
            @RequestHeader("Authorization") String tokenHeader
    ) {
        userService.updateUserSchools(id, schoolNames);
        return ResponseEntity.ok("User schools updated");
    }


    @PutMapping("/{id}/finalSchool")
    public ResponseEntity<?> updateFinalSchool(@PathVariable Long id, @RequestBody String finalSchool) {
        userService.updateFinalSchool(id, finalSchool);
        return ResponseEntity.ok("Final school updated successfully!");
    }

    @DeleteMapping("/{id}/schools")
    public ResponseEntity<?> clearUserSchools(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        userService.clearUserSchools(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader(value = "Authorization", required = false) String tokenHeader) {
        if (tokenHeader == null || !tokenHeader.startsWith("Bearer ")) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or malformed Authorization header");
        }

        try {
            String token = tokenHeader.substring(7);
            String email = jwtUtil.extractUserEmail(token);

            User user = userService.getUserByEmail(email);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // ←—— NEW: load school names from join table
            List<String> schools = userService.getUserSchools(user.getId());

            // build a simple JSON payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("id",      user.getId());
            payload.put("email",   user.getEmail());
            payload.put("schools", schools);

            return ResponseEntity.ok(payload);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");
        }
    }
}
