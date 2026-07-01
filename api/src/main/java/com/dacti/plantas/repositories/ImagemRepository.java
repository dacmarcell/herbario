package com.dacti.plantas.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dacti.plantas.models.Imagem;

public interface ImagemRepository extends JpaRepository<Imagem, Long> {

    List<Imagem> findByPlantaId(Long plantaId);

    @Query("SELECT COUNT(i) FROM Imagem i WHERE i.planta.id = :plantaId")
    long countByPlantaId(@Param("plantaId") Long plantaId);
}
