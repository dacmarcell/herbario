package com.dacti.plantas.adapters;

import org.springframework.stereotype.Component;

import com.dacti.plantas.ports.AIPort;

@Component("groq")
public class GroqAdapter implements AIPort{
    @Override
    public String analisar(String conteudo){
        return "Conteudo analisado pelo groq: " + conteudo;
    }
}
