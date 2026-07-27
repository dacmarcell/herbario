package com.dacti.plantas.controllers;

import java.io.ByteArrayOutputStream;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dacti.plantas.services.ExportService;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    private final ExportService exportService;

    ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping("/json")
    public ResponseEntity<byte[]> exportToJson() {
        try {
            String json = exportService.exportToJson();
            byte[] bytes = json.getBytes("UTF-8");
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setContentDispositionFormData("attachment", "herbario-export.json");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(bytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/csv")
    public ResponseEntity<byte[]> exportToCsv() {
        try {
            String csv = exportService.exportToCsv();
            byte[] bytes = csv.getBytes("UTF-8");
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(new MediaType("text", "csv"));
            headers.setContentDispositionFormData("attachment", "herbario-export.csv");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(bytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> exportToPdf() {
        try {
            ByteArrayOutputStream pdf = exportService.exportToPdf();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "herbario-export.pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdf.toByteArray());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/import")
    public ResponseEntity<String> importFromJson(@RequestParam("file") MultipartFile file) {
        try {
            int count = exportService.importFromJson(file);
            return ResponseEntity.ok("Importadas " + count + " plantas com sucesso");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao importar: " + e.getMessage());
        }
    }

    @PostMapping("/backup")
    public ResponseEntity<String> createBackup() {
        try {
            String backupPath = exportService.createBackup();
            return ResponseEntity.ok("Backup criado em: " + backupPath);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao criar backup: " + e.getMessage());
        }
    }
}
