package com.dacti.plantas.adapters;

import org.springframework.stereotype.Component;

import com.dacti.plantas.ports.AIPort;

@Component("gemini")
public class GeminiAdapter implements AIPort {
    @Override
    public String analisar(String conteudo){
        return "Conteudo analisado pelo gemini: " + conteudo;
    }
}
