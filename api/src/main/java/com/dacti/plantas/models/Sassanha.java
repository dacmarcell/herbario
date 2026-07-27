package com.dacti.plantas.models;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "sassanhas")
public class Sassanha {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String yorubaContent;

    @Column(length = 500)
    private String audioUrl;

    @Column(length = 500)
    private String transricaoFonetica;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name = "sassanha_planta",
        joinColumns = @JoinColumn(name = "sassanha_id"),
        inverseJoinColumns = @JoinColumn(name = "planta_id")
    )
    @JsonIgnore
    private Set<Planta> plantas = new HashSet<>();

    public Sassanha() {
    }

    public Sassanha(String content, String yorubaContent) {
        this.content = content;
        this.yorubaContent = yorubaContent;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getYorubaContent() {
        return yorubaContent;
    }

    public void setYorubaContent(String yorubaContent) {
        this.yorubaContent = yorubaContent;
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

    public Set<Planta> getPlantas() {
        return plantas;
    }

    public void setPlantas(Set<Planta> plantas) {
        this.plantas = plantas;
    }

    public void addPlanta(Planta planta) {
        plantas.add(planta);
    }

    public void removePlanta(Planta planta) {
        plantas.remove(planta);
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getTransricaoFonetica() {
        return transricaoFonetica;
    }

    public void setTransricaoFonetica(String transricaoFonetica) {
        this.transricaoFonetica = transricaoFonetica;
    }
}
