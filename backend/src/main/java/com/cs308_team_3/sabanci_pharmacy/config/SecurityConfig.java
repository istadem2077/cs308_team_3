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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
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
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // 1. PUBLIC Endpoints
                        .requestMatchers(
                                "/api/user/login",
                                "/api/user/register",
                                "/error",
                                "/ws-chat/**"
                        ).permitAll()

                        // 2. PUBLIC VIEWING
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/products/**").permitAll()

                        // 3. PRODUCT MANAGER - Changed to hasRole
				       .requestMatchers("/api/reviews/pending", "/api/reviews/*/status").hasAnyRole("PRODUCT_MANAGER", "SALES_MANAGER")
				       .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/products/**").hasAnyRole("PRODUCT_MANAGER", "SALES_MANAGER")
				       .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/products/**").hasAnyRole("PRODUCT_MANAGER", "SALES_MANAGER")
				       .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/products/**").hasAnyRole("PRODUCT_MANAGER", "SALES_MANAGER")
				       .requestMatchers("/api/pm/**").hasAnyRole("PRODUCT_MANAGER", "SALES_MANAGER")

                        // 4. ORDERS (PM & Sales) - Changed to hasAnyRole
                        .requestMatchers("/api/orders/*/status*").hasAnyRole("PRODUCT_MANAGER", "SALES_MANAGER")

                        // 5. SALES MANAGER - Changed to hasRole
                        .requestMatchers("/api/sales/**").hasRole("SALES_MANAGER")

				       //.requestMatchers("/api/pm/order/*/status*").permitAll()

                        // 6. SUPPORT AGENT - Changed to hasRole
                        .requestMatchers("/api/tickets/**", "/api/support/context/**", "/api/support/queue", "/api/support/session/*/claim").hasRole("SUPPORT_AGENT")

                        // 7. PUBLIC/CUSTOMER for Initiating Chat
                        .requestMatchers("/api/support/session/init").permitAll()

                        // 8. AUTHENTICATED USERS - Changed to hasAnyRole
                        .requestMatchers("/api/cart/**", "/api/orders/**",
                                "/api/wishlist/**", "/api/addresses/**",
                                "/api/categories**", "/api/invoice/**").hasAnyRole("CUSTOMER", "PRODUCT_MANAGER", "SALES_MANAGER", "SUPPORT_AGENT")

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
