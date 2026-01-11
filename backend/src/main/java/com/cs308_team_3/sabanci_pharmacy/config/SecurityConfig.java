package com.cs308_team_3.sabanci_pharmacy.config;

import com.cs308_team_3.sabanci_pharmacy.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService UserDetailsService;

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. THIS LINE IS CRITICAL.
                // It tells Spring Security to use the configuration from your CorsConfig bean.
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // 1. PUBLIC Endpoints (Everyone can access)
                        .requestMatchers(
                                "/api/user/login",
                                "/api/user/register",
                                "/error" // <--- CRITICAL FIX for 403 errors
                        ).permitAll()

                        // 2. PUBLIC VIEWING (Everyone can SEE products, but not change them)
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/products/**").permitAll()

                        // 3. PRODUCT MANAGER (Can ADD/EDIT products & Approve Reviews)
                        .requestMatchers("/api/reviews/pending", "/api/reviews/*/status").hasAuthority("PRODUCT_MANAGER")
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/products/**").hasAuthority("PRODUCT_MANAGER")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/products/**").hasAuthority("PRODUCT_MANAGER")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/products/**").hasAuthority("PRODUCT_MANAGER")

                        // 4. Allow BOTH Product Manager and Sales Manager to manage orders
                        .requestMatchers("/api/orders/**").hasAnyAuthority("PRODUCT_MANAGER", "SALES_MANAGER")

                        // 5. Keep Sales specific stuff for Sales Manager only
                        .requestMatchers("/api/sales/**").hasAuthority("SALES_MANAGER")

                        // 6. SUPPORT AGENT (Placeholder for future support tasks)
                        .requestMatchers("/api/tickets/**", "/api/support/**").hasAuthority("SUPPORT_AGENT")

                        // 7. CUSTOMER (Authenticated users can do basic things)
                        .requestMatchers("/api/cart/**", "/api/my-orders/**").hasAnyAuthority("CUSTOMER", "PRODUCT_MANAGER", "SALES_MANAGER", "SUPPORT_AGENT")

                        // Block everything else
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(UserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
