# desenv-backend

## Desenvolvimento de Backend

### Passo a passo para rodar o script:

1 - Clonar o arquivo;<br />
2 - Criar o Banco de Dados no MySql;<br />
3 - Instalar dependencias (npm install)<br />
4 - Iniciar o serviço (npm start)<br /><br /><br />

### Script do Banco de Dados no MySql

```sql
CREATE DATABASE `backend`;

USE `backend`;

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) DEFAULT NULL,
  `cpf` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `idade` int(11) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `senha` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
