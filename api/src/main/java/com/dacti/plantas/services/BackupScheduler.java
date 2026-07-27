package com.dacti.plantas.services;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class BackupScheduler {

    private static final Logger logger = LoggerFactory.getLogger(BackupScheduler.class);
    
    private final ExportService exportService;

    BackupScheduler(ExportService exportService) {
        this.exportService = exportService;
    }

    @Scheduled(cron = "0 0 2 * * ?") // Executa todos os dias às 2h da manhã
    public void scheduledBackup() {
        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            logger.info("Iniciando backup automático às {}", timestamp);
            
            String backupPath = exportService.createBackup();
            
            logger.info("Backup automático concluído: {}", backupPath);
        } catch (IOException e) {
            logger.error("Erro ao criar backup automático: {}", e.getMessage());
        }
    }
}
