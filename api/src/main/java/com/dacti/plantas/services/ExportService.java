package com.dacti.plantas.services;

import java.io.ByteArrayOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dacti.plantas.models.Planta;
import com.dacti.plantas.repositories.PlantaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.opencsv.CSVWriter;

@Service
public class ExportService {

    private final PlantaRepository plantaRepository;
    private static final String BACKUP_DIR = "backups";

    ExportService(PlantaRepository plantaRepository) {
        this.plantaRepository = plantaRepository;
    }

    public String exportToJson() throws IOException {
        List<Planta> plantas = plantaRepository.findAll();
        
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        
        return mapper.writeValueAsString(plantas);
    }

    public String exportToCsv() throws IOException {
        List<Planta> plantas = plantaRepository.findAll();
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        CSVWriter writer = new CSVWriter(new java.io.OutputStreamWriter(outputStream, "UTF-8"));
        
        String[] header = {"ID", "Nome", "Conteúdo"};
        writer.writeNext(header);
        
        for (Planta planta : plantas) {
            String[] row = {
                String.valueOf(planta.getId()),
                planta.getNome(),
                planta.getConteudo().replace("\n", " ").replace("\r", "")
            };
            writer.writeNext(row);
        }
        
        writer.close();
        return outputStream.toString("UTF-8");
    }

    public ByteArrayOutputStream exportToPdf() throws IOException {
        List<Planta> plantas = plantaRepository.findAll();
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        
        // Título
        Paragraph title = new Paragraph("Herbário - Catálogo de Plantas")
                .setFontSize(20)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER);
        document.add(title);
        
        document.add(new Paragraph("\n"));
        
        // Tabela
        Table table = new Table(new float[]{50, 200, 400});
        table.addHeaderCell("ID");
        table.addHeaderCell("Nome");
        table.addHeaderCell("Conteúdo");
        
        for (Planta planta : plantas) {
            table.addCell(String.valueOf(planta.getId()));
            table.addCell(planta.getNome());
            table.addCell(planta.getConteudo().substring(0, Math.min(200, planta.getConteudo().length())));
        }
        
        document.add(table);
        document.close();
        
        return outputStream;
    }

    public int importFromJson(MultipartFile file) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        
        List<Planta> plantas = mapper.readValue(
            file.getInputStream(),
            mapper.getTypeFactory().constructCollectionType(List.class, Planta.class)
        );
        
        int count = 0;
        for (Planta planta : plantas) {
            if (plantaRepository.buscarPorNomeSimilar(planta.getNome()).isEmpty()) {
                planta.setId(null); // Reset ID para evitar conflitos
                plantaRepository.save(planta);
                count++;
            }
        }
        
        return count;
    }

    public String createBackup() throws IOException {
        // Criar diretório de backup se não existir
        Path backupDir = Paths.get(BACKUP_DIR);
        if (!Files.exists(backupDir)) {
            Files.createDirectories(backupDir);
        }
        
        // Gerar nome do arquivo com timestamp
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        String backupFileName = "herbario-backup-" + timestamp + ".json";
        Path backupPath = backupDir.resolve(backupFileName);
        
        // Exportar dados
        String json = exportToJson();
        
        // Escrever arquivo
        try (FileWriter writer = new FileWriter(backupPath.toFile())) {
            writer.write(json);
        }
        
        return backupPath.toAbsolutePath().toString();
    }
}
