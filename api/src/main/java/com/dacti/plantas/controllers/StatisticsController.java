package com.dacti.plantas.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dacti.plantas.models.Planta;
import com.dacti.plantas.repositories.PlantaRepository;
import com.dacti.plantas.repositories.SassanhaRepository;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final PlantaRepository plantaRepository;
    private final SassanhaRepository sassanhaRepository;

    StatisticsController(PlantaRepository plantaRepository, SassanhaRepository sassanhaRepository) {
        this.plantaRepository = plantaRepository;
        this.sassanhaRepository = sassanhaRepository;
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        long totalPlantas = plantaRepository.count();
        long totalSassanhas = sassanhaRepository.count();
        
        List<Planta> maisVisualizadas = plantaRepository.findMaisVisualizadas();
        List<Object[]> porCategoria = plantaRepository.countByAllCategorias();
        
        return ResponseEntity.ok(Map.of(
            "totalPlantas", totalPlantas,
            "totalSassanhas", totalSassanhas,
            "maisVisualizadas", maisVisualizadas.stream().limit(10).toList(),
            "porCategoria", porCategoria
        ));
    }

    @GetMapping("/evolucao")
    public ResponseEntity<Map<String, Object>> getEvolucao() {
        List<Planta> todasPlantas = plantaRepository.findAll();
        
        Map<String, Long> porMes = new java.util.TreeMap<>();
        for (Planta planta : todasPlantas) {
            if (planta.getCreatedAt() != null) {
                String mes = planta.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM"));
                porMes.put(mes, porMes.getOrDefault(mes, 0L) + 1);
            }
        }
        
        return ResponseEntity.ok(Map.of(
            "evolucaoPorMes", porMes
        ));
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<Object[]>> getCategorias() {
        List<Object[]> porCategoria = plantaRepository.countByAllCategorias();
        return ResponseEntity.ok(porCategoria);
    }
}
