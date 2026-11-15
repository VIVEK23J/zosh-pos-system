package com.zosh.zosh.pos.system.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // Public authentication & webhook endpoints
                        .requestMatchers("/auth/signup", "/auth/login", "/api/payments/razorpay/webhook").permitAll()

                        // Role-specific API namespaces
                        .requestMatchers("/api/super-admin/**").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers("/api/store-admin/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN")
                        .requestMatchers("/api/manager/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN", "MANAGER", "BRANCH_MANAGER", "STORE_MANAGER")
                        .requestMatchers("/api/cashier/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN", "MANAGER", "BRANCH_MANAGER", "STORE_MANAGER", "CASHIER")

                        // Super Admin sensitive operations
                        .requestMatchers(HttpMethod.GET, "/api/store/stores").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/store/*/moderate").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/store/**").hasAnyRole("SUPER_ADMIN", "ADMIN")

                        // Store & Branch Administration
                        .requestMatchers(HttpMethod.POST, "/api/store/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/branches/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/branches/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN")

                        // Product & Catalog Administration (Cashiers cannot manage)
                        .requestMatchers(HttpMethod.POST, "/api/products/**", "/api/categories/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**", "/api/categories/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**", "/api/categories/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN")

                        // Employee Management
                        .requestMatchers(HttpMethod.POST, "/api/employees/store/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/employees/branch/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN", "MANAGER", "BRANCH_MANAGER", "STORE_MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/employees/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN")

                        // Inventory Control (Cashiers cannot modify inventory)
                        .requestMatchers(HttpMethod.POST, "/api/inventories/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN", "MANAGER", "BRANCH_MANAGER", "STORE_MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/inventories/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN", "MANAGER", "BRANCH_MANAGER", "STORE_MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/inventories/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "STORE_ADMIN")

                        // All other APIs require authentication
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Authentication required. Please provide a valid Bearer token.\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"status\":403,\"error\":\"Forbidden\",\"message\":\"Access Denied: You do not have permission to access this resource.\"}");
                        })
                )
                .addFilterBefore(new JwtValidator(), UsernamePasswordAuthenticationFilter.class)
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .build();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder
    ) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration cfg = new CorsConfiguration();
                cfg.setAllowedOrigins(
                        Arrays.asList(
                                "http://localhost:5173",
                                "http://localhost:3000"
                        )
                );
                cfg.setAllowedMethods(Collections.singletonList("*"));
                cfg.setAllowedHeaders(Collections.singletonList("*"));
                cfg.setAllowCredentials(true);
                cfg.setExposedHeaders(Arrays.asList("Authorization"));
                cfg.setMaxAge(3600L);
                return cfg;
            }
        };
    }
}
