package com.dacti.plantas.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dacti.plantas.models.Planta;

public interface PlantaRepository extends JpaRepository<Planta, Long> {

    @Query("SELECT p FROM Planta p WHERE LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Planta> buscarPorNomeSimilar(@Param("nome") String nome);
}
