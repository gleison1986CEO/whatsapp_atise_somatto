import { Request, Response } from "express";
import { logger } from "../utils/logger";
import FormData from 'form-data';
import fetch from 'node-fetch';

const authUser = async () => {
    try {
        // Verificar se todas as variáveis necessárias estão configuradas
        if (!process.env.HINOVA_API_URL || !process.env.HINOVA_USER || !process.env.HINOVA_PASS) {
            throw new Error("Variáveis de ambiente não configuradas corretamente.");
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'insomnia/2023.5.8',
                Authorization: 'Bearer d85b9ad6f4d50d5c7502b75f33abdfaf0374f9de88a32addb5f6824372235bb77807d97fe93ebb7b35899bd6e39d003fea6ad595129655a4483df6abab93e0a6770617a2c8c53c9aa7bb9319bcea14a561d595a75b06a390a2f018fd9aa0f228c0dbe2a0b17eace22200d07ac9ca601f',
            },
            body: JSON.stringify({
                usuario: process.env.HINOVA_USER,
                senha: process.env.HINOVA_PASS,
            }),
        };

        const response = await fetch(`${process.env.HINOVA_API_URL}/usuario/autenticar`, options);

        if (!response.ok) {
            throw new Error(`Erro na autenticação: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        return data.token_usuario;
    } catch (error) {
        console.error("Erro ao autenticar usuário:", error.message);
        throw error;
    }
};

export const listAssociate = async (req: Request, res: Response) => {
    try {
        const auth = await authUser();

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            },
            body: JSON.stringify({
                "codigo_situacao": "1",
                "inicio_paginacao": "0",
                "quantidade_por_pagina": "999"
            })
        };

        const response = await fetch(`${process.env.HINOVA_API_URL}/listar/associado`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        return res.json(result.associados.map(({ codigo_associado, nome }) => ({ codigo_associado, nome })));
    } catch (error) {
        logger.error("Erro ao listar associados:", error);
        throw error;
    }
};


export const associateData = async (req: Request, res: Response) => {
    try {
        const auth = await authUser();

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            }
        };

        const response = await fetch(`${process.env.HINOVA_API_URL}/associado/buscar/${req.params.userCpf}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return res.json(result);
    } catch (error) {
        logger.error("Erro ao listar associados:", error);
        throw error;
    }
};

export const associateDataFromBackEnd = async (userID) => {
    try {
        const auth = await authUser();

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            }
        };

        const response = await fetch(`${process.env.HINOVA_API_URL}/associado/buscar/${userID}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        logger.error("Erro ao listar associados:", error);
        throw error;
    }
};

