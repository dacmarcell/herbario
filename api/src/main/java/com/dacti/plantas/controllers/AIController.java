package com.dacti.plantas.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dacti.plantas.ports.AIPort;

@RestController
@RequestMapping("/ai")
public class AIController {

    private AIPort aiPort;

    public AIController(Map<String, AIPort> providers, @Value("${ai.provider}") String provider){
        this.aiPort = providers.get(provider);

        if(this.aiPort == null){
            throw new RuntimeException("Provider " + provider + " não encontrado.");
        }
    }

    @PostMapping
    public String analisar(@RequestBody Analise analise) {
        String prompt = String.format(
            """
            Você conhece profundamente as tradições de banhos rituais do Brasil. O usuário está buscando plantas para: %s
            (exemplo: 'estou me sentindo pesado', 'quero atrair amor', 'preciso de proteção') Do seguinte catálogo de plantas disponíveis:
            %s
            Sugira as 3 mais indicadas para essa intenção, explicando brevemente o porquê de cada uma. 
            Se nenhuma for ideal, diga honestamente. Responda em Markdown.
            """,
            analise.intencao(),
            String.join(", ", analise.nomes())
        );

        String conteudoGerado = aiPort.analisar(prompt);
        return conteudoGerado;
    }

    public record Analise(
        String[] nomes,
        String intencao
    ) {}
}
