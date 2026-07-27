package com.dacti.plantas.specifications;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.dacti.plantas.models.Planta;

import jakarta.persistence.criteria.Predicate;

public class PlantaSpecification {

    public static Specification<Planta> comFiltros(
            String nome,
            String conteudo,
            String categoria,
            String tag,
            LocalDateTime inicio,
            LocalDateTime fim) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (nome != null && !nome.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%"));
            }

            if (conteudo != null && !conteudo.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("conteudo")), "%" + conteudo.toLowerCase() + "%"));
            }

            if (categoria != null && !categoria.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("categoria")), categoria.toLowerCase()));
            }

            if (tag != null && !tag.isBlank()) {
                predicates.add(cb.like(root.get("tags"), "%" + tag + "%"));
            }

            if (inicio != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), inicio));
            }

            if (fim != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), fim));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}