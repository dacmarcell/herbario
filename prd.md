# PRD - Herbário (Catálogo Botânico)

## 1. Visão Geral
O **Herbário** é uma plataforma digital projetada para catalogar e gerenciar informações botânicas de forma visual e organizada. O sistema permite o registro de espécies, com foco em detalhes morfológicos, curiosidades e significados, utilizando formatação Markdown para garantir uma apresentação rica e estruturada.

## 2. Objetivos do Produto
- **Centralização**: Criar um repositório único para o conhecimento botânico pessoal ou compartilhado.
- **Experiência Visual**: Oferecer uma interface premium e imersiva que remeta à natureza e ao cuidado botânico.
- **Flexibilidade**: Permitir descrições detalhadas e formatadas através de um editor Markdown integrado.

## 3. Persona / Público-Alvo
- Estudantes de biologia/botânica.
- Amadores e entusiastas de jardinagem.
- Pesquisadores que buscam uma ferramenta simples para catalogação rápida.

## 4. Requisitos Funcionais

### 4.1. Catálogo (Listagem)
- **Visualização**: Grade (Grid) de cards responsivos com prévia do conteúdo.
- **Busca**: Filtro por nome ou conteúdo textual em tempo real.
- **Ordenação**: Opções de A-Z, Z-A, Mais Recentes e Mais Antigos.
- **Contagem**: Indicador de total de espécies registradas e filtradas.

### 4.2. Detalhes da Folha
- **Renderização**: Conversão de Markdown para HTML estilizado.
- **Ficha Técnica**: Exibição de metadados como ID, Nome e extensão do conteúdo.
- **Navegação**: Breadcrumbs para retorno fácil ao catálogo.

### 4.3. Registro (Criação)
- **Formulário**: Campos para Nome e Conteúdo.
- **Editor**: Textarea com atalhos para Markdown (Negrito, Itálico, Títulos, Listas, Links).
- **Preview**: Visualização em tempo real do conteúdo formatado.
- **Validação**: Verificação de campos obrigatórios e tamanhos mínimos/máximos.

## 5. Requisitos Não-Funcionais

### 5.1. Design e Estética
- **Framework**: Tailwind CSS v4.
- **Paleta de Cores**: Tons de verde botânico (Green 50-950) e creme (Cream 100-300).
- **Tipografia**: *Cormorant Garamond* (Serifada para títulos) e *DM Sans* (Sem-serifa para leitura).
- **UX**: Animações de fade-up, micro-interações de hover e estados de carregamento (Skeletons).

### 5.2. Arquitetura e Performance
- **Frontend**: Single Page Application (SPA) com React e Vite.
- **Backend**: API RESTful robusta com Spring Boot (Java).
- **Infraestrutura**: Containerização completa via Docker Compose.
- **Banco de Dados**: Relacional (PostgreSQL) para integridade dos dados.

## 6. Mapa Tecnológico (Stack)
- **Frontend**: React 19, TypeScript 6, Vite 8, Tailwind CSS 4.
- **Backend**: Java 21, Spring Boot, Spring Data JPA.
- **DevOps**: Docker, Docker Compose.

## 7. Histórico de Evolução Recente
- [x] Migração de CSS Modules para Tailwind CSS v4 para melhor escalabilidade visual.
- [x] Unificação do campo de texto de `descricao` para `conteudo` em todo o sistema (API e Web).
- [x] Implementação de editor Markdown customizado sem dependências externas pesadas.
- [x] Configuração de ambiente multi-container para paridade entre desenvolvimento e produção.
