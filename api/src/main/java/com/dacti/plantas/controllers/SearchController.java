package com.dacti.plantas.controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dacti.plantas.models.Planta;
import com.dacti.plantas.ports.AIPort;
import com.dacti.plantas.repositories.PlantaRepository;
import com.dacti.plantas.specifications.PlantaSpecification;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final PlantaRepository plantaRepository;
    private AIPort aiPort;

    public SearchController(Map<String, AIPort> providers, @Value("${ai.provider}") String provider, PlantaRepository plantaRepository){
        this.aiPort = providers.get(provider);

        if(this.aiPort == null){
            throw new RuntimeException("Provider " + provider + " não encontrado.");
        }
        this.plantaRepository = plantaRepository;
    }

    @GetMapping("/avancada")
    public ResponseEntity<List<Planta>> buscaAvancada(
        @RequestParam(required = false) String nome,
        @RequestParam(required = false) String conteudo,
        @RequestParam(required = false) String categoria,
        @RequestParam(required = false) String tag,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim
    ) {
        List<Planta> resultado = plantaRepository.findAll(
            PlantaSpecification.comFiltros(nome, conteudo, categoria, tag, inicio, fim)
        );
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/conteudo")
    public ResponseEntity<List<Planta>> buscarPorConteudo(@RequestParam String conteudo) {
        List<Planta> resultados = plantaRepository.buscarPorConteudo(conteudo);
        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/categoria")
    public ResponseEntity<List<Planta>> buscarPorCategoria(@RequestParam String categoria) {
        List<Planta> resultados = plantaRepository.buscarPorCategoria(categoria);
        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/tag")
    public ResponseEntity<List<Planta>> buscarPorTag(@RequestParam String tag) {
        List<Planta> resultados = plantaRepository.buscarPorTag(tag);
        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/periodo")
    public ResponseEntity<List<Planta>> buscarPorPeriodo(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim
    ) {
        List<Planta> resultados = plantaRepository.buscarPorPeriodo(inicio, fim);
        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/mais-visualizadas")
    public ResponseEntity<List<Planta>> getMaisVisualizadas() {
        List<Planta> resultados = plantaRepository.findMaisVisualizadas();
        return ResponseEntity.ok(resultados);
    }

    @PostMapping("/semantica")
    public ResponseEntity<List<Planta>> buscaSemantica(@RequestBody BuscaSemanticaRequest request) {
        List<Planta> todasPlantas = plantaRepository.findAll();
        
        String plantasTexto = todasPlantas.stream()
            .map(p -> "ID: " + p.getId() + ", Nome: " + p.getNome() + ", Conteúdo: " + p.getConteudo().substring(0, Math.min(200, p.getConteudo().length())))
            .reduce((a, b) -> a + "\n" + b)
            .orElse("");
        
        String prompt = String.format(
            """
            Você é um especialista em botânica. O usuário está buscando plantas com a seguinte descrição: "%s"
            
            Do seguinte catálogo de plantas:
            %s
            
            Retorne APENAS os IDs das plantas mais relevantes para essa busca, separados por vírgula (ex: 1,3,5).
            Se nenhuma for relevante, retorne "nenhum".
            """,
            request.query(),
            plantasTexto
        );
        
        String resposta = aiPort.analisar(prompt);
        
        if (resposta.toLowerCase().contains("nenhum")) {
            return ResponseEntity.ok(List.of());
        }
        
        String[] ids = resposta.split(",");
        List<Long> idsLong = new java.util.ArrayList<>();
        for (String id : ids) {
            try {
                idsLong.add(Long.parseLong(id.trim()));
            } catch (NumberFormatException e) {
                // Ignorar IDs inválidos
            }
        }
        
        List<Planta> resultados = plantaRepository.findAllById(idsLong);
        return ResponseEntity.ok(resultados);
    }

    public record BuscaSemanticaRequest(String query) {}
}
