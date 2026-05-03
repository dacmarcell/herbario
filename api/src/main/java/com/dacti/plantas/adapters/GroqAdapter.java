package com.dacti.plantas.adapters;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.dacti.plantas.config.AIProperties;
import com.dacti.plantas.ports.AIPort;

@Component("groq")
public class GroqAdapter implements AIPort{
    private final AIProperties aiProps;
    private final WebClient.Builder webClientBuilder;

    public GroqAdapter(AIProperties aiProps, WebClient.Builder webClientBuilder){
        this.aiProps = aiProps;
        this.webClientBuilder = webClientBuilder;
    }

    @Override
    public String analisar(String prompt){
        var props = aiProps.getGroq();
        
        var requestBody = Map.of(
            "model", props.getModel(),
            "messages", List.of(
                Map.of("role", "user", "content", prompt)
            )
        );
        
        return webClientBuilder.build()
            .post()
            .uri(props.getBaseUrl() + "/chat/completions")
            .header("Authorization", "Bearer " + props.getApiKey())
            .header("Content-Type", "application/json")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(GroqResponse.class)
            .map(r -> r.choices().get(0).message().content())
            .block();
    }

    record GroqResponse(List<Choice> choices) {}
    record Choice(Message message) {}
    record Message(String content) {}
}
