package com.dacti.plantas.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ai")
public class AIProperties {
    private Provider groq = new Provider();
    private Provider gemini = new Provider();

    public Provider getGroq() {
        return groq; 
    }

    public void setGroq(Provider groq) {
        this.groq = groq;
    }

    public Provider getGemini() {
        return gemini;
    }

    public void setGemini(Provider gemini) {
        this.gemini = gemini;
    }

    public static class Provider {
        private String apiKey;
        private String baseUrl;
        private String model;

        public String getApiKey() {
            return apiKey;
        }

        public void setApiKey(String apiKey) {
            this.apiKey = apiKey;
        }

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }
    }
}
