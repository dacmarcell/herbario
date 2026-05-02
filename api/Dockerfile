FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copia o wrapper do maven e o pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Garante que o mvnw tem permissão de execução e remove possíveis caracteres do Windows (CRLF)
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Baixa as dependências do projeto (ajuda no cache do Docker)
RUN ./mvnw dependency:go-offline

# Copia o código fonte
COPY src ./src

# Roda o spring boot
CMD ["./mvnw", "spring-boot:run"]
