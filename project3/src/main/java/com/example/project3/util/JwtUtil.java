package com.example.project3.util;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "jackyiswritingakeyherehelloworld123nihaowoshizhangyuqihello";

    // Generate a token for a given email
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // Extract the email from a token
    public String extractEmail(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (ExpiredJwtException e) {
            System.err.println("Token expired: " + e.getMessage());
            throw e;
        } catch (JwtException e) {
            System.err.println("Invalid token: " + e.getMessage());
            throw e;
        }
    }

    // Validate the token
    public boolean validateToken(String token, String email) {
        try {
            String extractedEmail = extractEmail(token);
            return email.equals(extractedEmail) && !isTokenExpired(token);
        } catch (JwtException e) {
            System.err.println("Token validation failed: " + e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            Date expiration = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
            return expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            System.err.println("Token expired: " + e.getMessage());
            return true;
        } catch (JwtException e) {
            System.err.println("Invalid token during expiration check: " + e.getMessage());
            return true;
        }
    }

    public String extractUserEmail(String token) {
        try {
            System.out.printf("Token received: %s%n", token);
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();
            System.out.printf("Claims extracted: %s%n", claims);
            return claims.getSubject();
        } catch (ExpiredJwtException e) {
            System.err.println("Token expired: " + e.getMessage());
            throw e;
        } catch (JwtException e) {
            System.err.println("Invalid token: " + e.getMessage());
            throw e;
        }
    }
}
