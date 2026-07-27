package com.dacti.plantas.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dacti.plantas.models.Planta;

public interface PlantaRepository extends JpaRepository<Planta, Long>, JpaSpecificationExecutor<Planta> {
    @Query("SELECT p FROM Planta p WHERE LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Planta> buscarPorNomeSimilar(@Param("nome") String nome);

    @Query("SELECT p FROM Planta p WHERE LOWER(p.conteudo) LIKE LOWER(CONCAT('%', :conteudo, '%'))")
    List<Planta> buscarPorConteudo(@Param("conteudo") String conteudo);

    @Query("SELECT p FROM Planta p WHERE LOWER(p.categoria) = LOWER(:categoria)")
    List<Planta> buscarPorCategoria(@Param("categoria") String categoria);

    @Query("SELECT p FROM Planta p WHERE p.tags LIKE CONCAT('%', :tag, '%')")
    List<Planta> buscarPorTag(@Param("tag") String tag);

    @Query("SELECT p FROM Planta p WHERE p.createdAt BETWEEN :inicio AND :fim")
    List<Planta> buscarPorPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("SELECT p FROM Planta p WHERE " +
       "(:nome IS NULL OR LOWER(p.nome) LIKE LOWER(CONCAT('%', COALESCE(CAST(:nome AS string), ''), '%'))) AND " +
       "(:conteudo IS NULL OR LOWER(p.conteudo) LIKE LOWER(CONCAT('%', COALESCE(CAST(:conteudo AS string), ''), '%'))) AND " +
       "(:categoria IS NULL OR LOWER(p.categoria) = LOWER(CAST(:categoria AS string))) AND " +
       "(:tag IS NULL OR p.tags LIKE CONCAT('%', COALESCE(CAST(:tag AS string), ''), '%')) AND " +
       "(CAST(:inicio AS timestamp) IS NULL OR p.createdAt >= CAST(:inicio AS timestamp)) AND " +
       "(CAST(:fim AS timestamp) IS NULL OR p.createdAt <= CAST(:fim AS timestamp))")
    List<Planta> buscaAvancada(
        @Param("nome") String nome,
        @Param("conteudo") String conteudo,
        @Param("categoria") String categoria,
        @Param("tag") String tag,
        @Param("inicio") LocalDateTime inicio,
        @Param("fim") LocalDateTime fim
    );

    @Query("SELECT p FROM Planta p ORDER BY p.visualizacoes DESC")
    List<Planta> findMaisVisualizadas();

    @Query("SELECT COUNT(p) FROM Planta p WHERE p.categoria = :categoria")
    Long countByCategoria(@Param("categoria") String categoria);

    @Query("SELECT p.categoria, COUNT(p) FROM Planta p GROUP BY p.categoria")
    List<Object[]> countByAllCategorias();
}
