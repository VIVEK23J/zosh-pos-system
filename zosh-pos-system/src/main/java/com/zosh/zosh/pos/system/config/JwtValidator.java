
package com.zosh.zosh.pos.system.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;

public class JwtValidator extends OncePerRequestFilter {

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        return path.equals("/auth/signup")
                || path.equals("/auth/login");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String jwt = request.getHeader(JwtConstant.JWT_HEADER);

        try {
            if (jwt != null && jwt.startsWith("Bearer ")) {

                SecretKey secretKey = Keys.hmacShaKeyFor(
                        JwtConstant.JWT_SECRET.getBytes(
                                java.nio.charset.StandardCharsets.UTF_8
                        )
                );

                Claims claims = Jwts.parser()
                        .verifyWith(secretKey)
                        .build()
                        .parseSignedClaims(jwt.substring(7))
                        .getPayload();

                String email = claims.get("email", String.class);
                String authorities =
                        claims.get("authorities", String.class);

                var auths =
                        AuthorityUtils.commaSeparatedStringToAuthorityList(
                                authorities == null ? "" : authorities
                        );

                var authentication =
                        new UsernamePasswordAuthenticationToken(
                                email, null, auths
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }

            // IMPORTANT: Always continue the filter chain.
            filterChain.doFilter(request, response);

        } catch (io.jsonwebtoken.JwtException
                 | IllegalArgumentException e) {

            SecurityContextHolder.clearContext();

            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid JWT token"
            );
        }
    }
}
