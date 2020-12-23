import { InMemoryDbService, RequestInfo } from "angular-in-memory-web-api";

export class InMemoryDb implements InMemoryDbService {

    createDb() {
        const categories = [
            { id: 1, name: "Lazer", description: "Cinema, parques, praia, etc." },
            { id: 2, name: "Saúde", description: "Remédios, Hospitalizações, Plano de Saúde" },
            { id: 3, name: "Moradia", description: "Contas, IPTU, Aluguel" },
            { id: 4, name: "Freelance", description: "Contratos, Trabalhos" },
            { id: 5, name: "Salário", description: "Recebimento de salário" }

        ];

        return { categories };
    }
}