package com.dacti.plantas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dacti.plantas.models.Planta;

public interface PlantaRepository extends JpaRepository<Planta, Long> {}
