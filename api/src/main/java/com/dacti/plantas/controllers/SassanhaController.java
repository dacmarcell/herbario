package com.dacti.plantas.controllers;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dacti.plantas.models.Planta;
import com.dacti.plantas.models.Sassanha;
import com.dacti.plantas.repositories.PlantaRepository;
import com.dacti.plantas.repositories.SassanhaRepository;

@RestController
@RequestMapping("/sassanhas")
public class SassanhaController {

    @Autowired
    private SassanhaRepository sassanhaRepository;

    @Autowired
    private PlantaRepository plantaRepository;

    @GetMapping
    public List<Sassanha> listar() {
        return sassanhaRepository.findAll();
    }

    @GetMapping("/buscar")
    public List<Sassanha> buscarPorTermo(@RequestParam String termo) {
        return sassanhaRepository.buscarPorTermo(termo);
    }

    @GetMapping("/{id}")
    public Sassanha buscarPorId(@PathVariable Long id) {
        return sassanhaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sassanha não encontrada com o ID: " + id));
    }

    @PostMapping
    public Sassanha criar(@RequestBody SassanhaDTO dto) {
        Sassanha sassanha = new Sassanha(dto.getContent(), dto.getYorubaContent());
        
        if (dto.getPlantaIds() != null && !dto.getPlantaIds().isEmpty()) {
            Set<Planta> plantas = dto.getPlantaIds().stream()
                    .map(id -> plantaRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Planta não encontrada com o ID: " + id)))
                    .collect(Collectors.toSet());
            sassanha.setPlantas(plantas);
        }
        
        return sassanhaRepository.save(sassanha);
    }

    @PatchMapping("/{id}")
    public Sassanha atualizar(@PathVariable Long id, @RequestBody SassanhaDTO dto) {
        Sassanha sassanhaExistente = sassanhaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sassanha não encontrada com o ID: " + id));

        if (dto.getContent() != null) sassanhaExistente.setContent(dto.getContent());
        if (dto.getYorubaContent() != null) sassanhaExistente.setYorubaContent(dto.getYorubaContent());
        
        if (dto.getPlantaIds() != null) {
            Set<Planta> plantas = dto.getPlantaIds().stream()
                    .map(plantaId -> plantaRepository.findById(plantaId)
                            .orElseThrow(() -> new RuntimeException("Planta não encontrada com o ID: " + plantaId)))
                    .collect(Collectors.toSet());
            sassanhaExistente.setPlantas(plantas);
        }

        return sassanhaRepository.save(sassanhaExistente);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        sassanhaRepository.deleteById(id);
    }

    // DTO for creating/updating Sassanha
    public static class SassanhaDTO {
        private String content;
        private String yorubaContent;
        private List<Long> plantaIds;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getYorubaContent() {
            return yorubaContent;
        }

        public void setYorubaContent(String yorubaContent) {
            this.yorubaContent = yorubaContent;
        }

        public List<Long> getPlantaIds() {
            return plantaIds;
        }

        public void setPlantaIds(List<Long> plantaIds) {
            this.plantaIds = plantaIds;
        }
    }
}
