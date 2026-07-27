package com.dacti.plantas.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dacti.plantas.models.Planta;
import com.dacti.plantas.repositories.PlantaRepository;

@RestController
@RequestMapping("/plantas")
public class PlantaController {

    private final PlantaRepository plantaRepository;

    PlantaController(PlantaRepository plantaRepository) {
        this.plantaRepository = plantaRepository;
    }

    @GetMapping
    public List<Planta> listar() {
        return plantaRepository.findAll();
    }

    @GetMapping("/buscar")
    public List<Planta> buscarPorNome(@org.springframework.web.bind.annotation.RequestParam String nome) {
        return plantaRepository.buscarPorNomeSimilar(nome);
    }

    @GetMapping("/{id}")
    public Planta buscarPorId(@PathVariable Long id) {
        Planta planta = plantaRepository.findById(id).orElseThrow(() -> new RuntimeException("Planta não encontrada com o ID: " + id));
        planta.incrementVisualizacoes();
        plantaRepository.save(planta);
        return planta;
    }

    @PostMapping
    public Planta criar(@RequestBody Planta planta) {
        return plantaRepository.save(planta);
    }

    @PatchMapping("/{id}")
    public Planta atualizar(@PathVariable Long id, @RequestBody Planta planta) {
        Planta plantaExistente = plantaRepository.findById(id).orElseThrow(() -> new RuntimeException("Planta não encontrada com o ID: " + id));

        if(planta.getNome() != null) plantaExistente.setNome(planta.getNome());
        if(planta.getConteudo() != null) plantaExistente.setConteudo(planta.getConteudo());

        return plantaRepository.save(plantaExistente);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        plantaRepository.deleteById(id);
    }
}
