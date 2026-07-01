package com.dacti.plantas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dacti.plantas.models.Sassanha;

public interface SassanhaRepository extends JpaRepository<Sassanha, Long> {

    @Query("SELECT s FROM Sassanha s WHERE LOWER(s.content) LIKE LOWER(CONCAT('%', :termo, '%')) OR LOWER(s.yorubaContent) LIKE LOWER(CONCAT('%', :termo, '%'))")
    java.util.List<Sassanha> buscarPorTermo(@Param("termo") String termo);
}
