package com.dacti.plantas.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dacti.plantas.models.AI;
import com.dacti.plantas.models.Planta;
import com.dacti.plantas.ports.AIPort;
import com.dacti.plantas.repositories.PlantaRepository;

@RestController
@RequestMapping("/ai")
public class AIController {

    @Autowired
    private PlantaRepository plantaRepository;
    private AIPort aiPort;

    public AIController(@Qualifier("${ai.provider}") AIPort aiPort){
        this.aiPort = aiPort;
    }

    @PostMapping("/{planta_id}")
    public String analisar(@PathVariable Long planta_id) {
        Planta planta = plantaRepository.findById(planta_id).orElseThrow(() -> new RuntimeException("Planta não encontrada com o ID: " + planta_id));
        String conteudoGerado = aiPort.analisar(planta.getNome());
        return conteudoGerado;
    }
}
