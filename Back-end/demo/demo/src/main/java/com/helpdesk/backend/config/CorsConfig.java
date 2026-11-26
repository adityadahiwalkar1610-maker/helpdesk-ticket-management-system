
package com.helpdesk.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration  //This class contains configuration settings for my application.
public class CorsConfig {

    @Bean //tells Spring to create and manage this object.
    public WebMvcConfigurer corsConfigurer() {   //allows us to customize how Spring handles web requests, including CORS.

        return new WebMvcConfigurer() {

            @Override    //This method is where we configure which frontend websites are allowed to communicate with our backend.
            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/api/**")
                        .allowedOrigins(
                                "http://localhost:5174",
                                "http://127.0.0.1:5174"
                        )
                        .allowedMethods(
                                "GET",
                                "POST",
                                "PUT",
                                "PATCH",
                                "DELETE",
                                "OPTIONS"
                        )
                        .allowedHeaders("*");
            }
        };
    }
}
