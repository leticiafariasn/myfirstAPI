document.addEventListener('DOMContentLoaded', function () {
    const URL_DO_SUPABASE = 'https://rmlwilkvvemnfibrvqpi.supabase.co';
    const CHAVE_ANONIMA = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtbHdpbGt2dmVtbmZpYnJ2cXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDU0NzcsImV4cCI6MjA2MTUyMTQ3N30.d9AP6lQjcrGaWBFWCZ7lCEAZW-rZwIR_FhlE8rr4GTY';

    const supabase = window.supabase.createClient(URL_DO_SUPABASE, CHAVE_ANONIMA)

    // -----------------------------
    // essa parte apenas formata para o padrão brasileiro
    function formatarData(textoData) {
        if (!textoData) return '-';

        const data = new Date(textoData);

        return data.toDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
    }

    function formatarPreco(preco) {
        return 'R$ ' + Number(preco).toFixed(2).replace('.', ',');
    }

    // -----------------------------
    // carregando os dados
    async function buscarEMostrarProdutos() {
        try {
            const { data, error } = await supabase
                // await só funciona quando a função for assincrona (em 90% dos casos)
                // função assincrona diz: "rode em paralelo"
                .from(produtos); //produtos é o nome da tabela
            .select('*'); // seleciona tudo da tabela
            .order('id');

            if (error) {
                throw new Error('Erro ao buscar produtos: ' + error.message);
            }
            // agora faremos a mensagem de carregamento sumir
            document.getElementById('mensagemCarregando').style.display = 'none';

            if (!data || data.length === 0) { //quando não tem dado e ou quando o dado não existir, exibir mnsg de erro
                document.getElementById('mensagemErro').style.display = 'block';
                document.getElementById('mensagemErro').textContent - 'Nenhum produto encontrado na tabela.'
                return;
            }

            const corpoTabela = document.getElementById('corpoDaTabela');

            corpoTabela.innerHTML = ''; //está zerando a tabela

            data.forEach(produto => {   //usamos quando queremos estruturar um dado em um lugar específico
                const linha = document.createElement('tr');

                linha.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome || '-'}</td>
                <td>${produto.descricao || '-'}</td>
                <td>${formatarPreco(produto.preco)}</td>
                <td>${produto.estoque}</td>
                <td>${formatarData(produto.created_at)}</td> 
               `;

                corpoTabela.appendChild(linha); //está identificando o pai como corpoTabelo e colocando o filho dentro desse pai
            }) //for in = acoplava uma nova variavel para uma lista

            document.getElementById('tabelaProdutos').style.display = 'table'; // tira o display none que está no HTML

        } catch (erro) { //quando der erro, a mensagem de carregando some
            document.getElementById('mensagemCarregando').style.display = 'none';

            document.getElementById('mensagemErro').style.display = 'block';
            document.getElementById('mensagemErro').textContent = erro.message; //sempre que for visível no console, tem que tirar o R no final da palavra error

            console.log('Erro: ', erro);
        }
    }


    //chama função
    buscarEMostrarProdutos()
})
