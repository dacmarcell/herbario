package com.dacti.plantas.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dacti.plantas.models.Planta;
import com.dacti.plantas.models.Sassanha;
import com.dacti.plantas.repositories.PlantaRepository;
import com.dacti.plantas.repositories.SassanhaRepository;

@RestController
@RequestMapping("/sassanhas")
public class SassanhaController {

    private final SassanhaRepository sassanhaRepository;
    private final PlantaRepository plantaRepository;

    private static final String AUDIO_DIR = "audio-uploads";

    SassanhaController(SassanhaRepository sassanhaRepository, PlantaRepository plantaRepository) {
        this.sassanhaRepository = sassanhaRepository;
        this.plantaRepository = plantaRepository;
    }

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
        
        if (dto.getAudioUrl() != null) sassanha.setAudioUrl(dto.getAudioUrl());
        if (dto.getTransricaoFonetica() != null) sassanha.setTransricaoFonetica(dto.getTransricaoFonetica());
        
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
        if (dto.getAudioUrl() != null) sassanhaExistente.setAudioUrl(dto.getAudioUrl());
        if (dto.getTransricaoFonetica() != null) sassanhaExistente.setTransricaoFonetica(dto.getTransricaoFonetica());
        
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

    @PostMapping("/{id}/audio")
    public ResponseEntity<String> uploadAudio(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Sassanha sassanha = sassanhaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Sassanha não encontrada com o ID: " + id));

            // Criar diretório se não existir
            Path uploadPath = Paths.get(AUDIO_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Gerar nome único para o arquivo
            String fileName = "sassanha-" + id + "-" + System.currentTimeMillis() + ".mp3";
            Path filePath = uploadPath.resolve(fileName);

            // Salvar arquivo
            Files.copy(file.getInputStream(), filePath);

            // Atualizar URL no banco
            String audioUrl = "/api/audio/" + fileName;
            sassanha.setAudioUrl(audioUrl);
            sassanhaRepository.save(sassanha);

            return ResponseEntity.ok("Áudio uploadado com sucesso: " + audioUrl);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erro ao fazer upload: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/fonetica")
    public ResponseEntity<String> atualizarTransricaoFonetica(@PathVariable Long id, @RequestBody TransricaoFoneticaDTO dto) {
        Sassanha sassanha = sassanhaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sassanha não encontrada com o ID: " + id));
        
        sassanha.setTransricaoFonetica(dto.getTransricaoFonetica());
        sassanhaRepository.save(sassanha);
        
        return ResponseEntity.ok("Transcrição fonética atualizada com sucesso");
    }

    // DTO for creating/updating Sassanha
    public static class SassanhaDTO {
        private String content;
        private String yorubaContent;
        private String audioUrl;
        private String transricaoFonetica;
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

        public String getAudioUrl() {
            return audioUrl;
        }

        public void setAudioUrl(String audioUrl) {
            this.audioUrl = audioUrl;
        }

        public String getTransricaoFonetica() {
            return transricaoFonetica;
        }

        public void setTransricaoFonetica(String transricaoFonetica) {
            this.transricaoFonetica = transricaoFonetica;
        }

        public List<Long> getPlantaIds() {
            return plantaIds;
        }

        public void setPlantaIds(List<Long> plantaIds) {
            this.plantaIds = plantaIds;
        }
    }

    // DTO for updating phonetic transcription
    public static class TransricaoFoneticaDTO {
        private String transricaoFonetica;

        public String getTransricaoFonetica() {
            return transricaoFonetica;
        }

        public void setTransricaoFonetica(String transricaoFonetica) {
            this.transricaoFonetica = transricaoFonetica;
        }
    }
}
