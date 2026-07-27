package com.dacti.plantas.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "plantas")
public class Planta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;
    
    @Column(nullable = false, length = 1000)
    private String conteudo;

    @Column(length = 100)
    private String categoria;

    @Column(length = 500)
    private String tags;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column
    private Integer visualizacoes = 0;

    @OneToMany(mappedBy = "planta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Imagem> imagens = new ArrayList<>();

    @ManyToMany(mappedBy = "plantas", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JsonIgnore
    private Set<Sassanha> sassanhas = new HashSet<>();

    public Planta() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Planta(Long id, String nome, String conteudo) {
        this.id = id;
        this.nome = nome;
        this.conteudo = conteudo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public List<Imagem> getImagens() {
        return imagens;
    }

    public void setImagens(List<Imagem> imagens) {
        this.imagens = imagens;
    }

    public void addImagem(Imagem imagem) {
        imagens.add(imagem);
        imagem.setPlanta(this);
    }

    public void removeImagem(Imagem imagem) {
        imagens.remove(imagem);
        imagem.setPlanta(null);
    }

    public Set<Sassanha> getSassanhas() {
        return sassanhas;
    }

    public void setSassanhas(Set<Sassanha> sassanhas) {
        this.sassanhas = sassanhas;
    }

    public void addSassanha(Sassanha sassanha) {
        sassanhas.add(sassanha);
    }

    public void removeSassanha(Sassanha sassanha) {
        sassanhas.remove(sassanha);
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getVisualizacoes() {
        return visualizacoes;
    }

    public void setVisualizacoes(Integer visualizacoes) {
        this.visualizacoes = visualizacoes;
    }

    public void incrementVisualizacoes() {
        this.visualizacoes = (this.visualizacoes == null) ? 1 : this.visualizacoes + 1;
    }

}
