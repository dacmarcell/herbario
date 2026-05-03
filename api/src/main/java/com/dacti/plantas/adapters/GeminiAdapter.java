package com.dacti.plantas.adapters;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.dacti.plantas.config.AIProperties;
import com.dacti.plantas.ports.AIPort;

@Component("gemini")
public class GeminiAdapter implements AIPort {
    private final AIProperties aiProps;
    private final WebClient.Builder webClientBuilder;

    public GeminiAdapter(AIProperties aiProps, WebClient.Builder webClientBuilder) {
        this.aiProps = aiProps;
        this.webClientBuilder = webClientBuilder;
    }

    @Override
    public String analisar(String prompt){
        var props = aiProps.getGemini();
        
        var requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            )
        );

        String url = props.getBaseUrl()
            + "/models/" + props.getModel()
            + ":generateContent?key=" + props.getApiKey();

        return webClientBuilder.build()
            .post()
            .uri(url)
            .header("Content-Type", "application/json")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(GeminiResponse.class)
            .map(r -> r.candidates().get(0).content().parts().get(0).text())
            .block();
    }

    record GeminiResponse(List<Candidate> candidates) {}
    record Candidate(Content content) {}
    record Content(List<Part> parts) {}
    record Part(String text) {}
}
