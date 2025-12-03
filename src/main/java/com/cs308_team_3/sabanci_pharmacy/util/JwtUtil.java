package com.cs308_team_3.sabanci_pharmacy.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwsHeader;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.nio.charset.StandardCharsets;
import java.util.function.Function;


@Component
public class JwtUtil {

    private static final String SECRET_STRING = "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";
    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET_STRING.getBytes(StandardCharsets.UTF_8));
    private static final long EXPIRATION_TIME = 86400000;

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Boolean validateToken(String token, String email) {
        final String username =  extractUsername(token);
        return (username.equals(email) && !isTokenExpired(token));
    }

}
