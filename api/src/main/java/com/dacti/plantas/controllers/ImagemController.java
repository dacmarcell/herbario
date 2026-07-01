package com.dacti.plantas.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dacti.plantas.models.Imagem;
import com.dacti.plantas.models.Planta;
import com.dacti.plantas.repositories.ImagemRepository;
import com.dacti.plantas.repositories.PlantaRepository;

@RestController
@RequestMapping("/plantas/{plantaId}/imagens")
public class ImagemController {

    @Autowired
    private ImagemRepository imagemRepository;

    @Autowired
    private PlantaRepository plantaRepository;

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    @GetMapping
    public ResponseEntity<List<Imagem>> listarImagens(@PathVariable Long plantaId) {
        Planta planta = plantaRepository.findById(plantaId)
                .orElseThrow(() -> new RuntimeException("Planta não encontrada"));
        
        List<Imagem> imagens = imagemRepository.findByPlantaId(plantaId);
        return ResponseEntity.ok(imagens);
    }

    @PostMapping
    public ResponseEntity<?> uploadImagem(
            @PathVariable Long plantaId,
            @RequestParam("arquivo") MultipartFile arquivo) {
        
        // Verificar se a planta existe
        Planta planta = plantaRepository.findById(plantaId)
                .orElseThrow(() -> new RuntimeException("Planta não encontrada"));

        // Verificar limite de 5 imagens
        long count = imagemRepository.countByPlantaId(plantaId);
        if (count >= 5) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Limite máximo de 5 imagens por folha");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Validar arquivo
        if (arquivo.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Arquivo vazio");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        String contentType = arquivo.getContentType();
        if (contentType == null || (!contentType.startsWith("image/"))) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Apenas arquivos de imagem são permitidos");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Validar tamanho (max 10MB)
        if (arquivo.getSize() > 10 * 1024 * 1024) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Tamanho máximo de 10MB");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        try {
            // Criar diretório de upload se não existir
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Gerar nome único
            String originalFilename = arquivo.getOriginalFilename();
            String extension = originalFilename != null ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String uniqueFilename = UUID.randomUUID().toString() + extension;
            
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(arquivo.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Salvar no banco
            Imagem imagem = new Imagem();
            imagem.setNomeArquivo(originalFilename);
            imagem.setUrl("/uploads/" + uniqueFilename);
            imagem.setTamanho(arquivo.getSize());
            imagem.setTipo(contentType);
            imagem.setPlanta(planta);
            
            Imagem saved = imagemRepository.save(imagem);
            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao salvar arquivo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/{imagemId}")
    public ResponseEntity<?> deletarImagem(
            @PathVariable Long plantaId,
            @PathVariable Long imagemId) {
        
        Imagem imagem = imagemRepository.findById(imagemId)
                .orElseThrow(() -> new RuntimeException("Imagem não encontrada"));

        // Verificar se a imagem pertence à planta
        if (!imagem.getPlanta().getId().equals(plantaId)) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Imagem não pertence a esta folha");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        try {
            // Deletar arquivo do disco
            Path filePath = Paths.get(uploadDir, imagem.getUrl().replace("/uploads/", ""));
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }

            // Deletar do banco
            imagemRepository.delete(imagem);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Imagem excluída com sucesso");
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao deletar arquivo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
