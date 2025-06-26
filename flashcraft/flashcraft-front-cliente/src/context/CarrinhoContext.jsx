import { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);

  function adicionarAoCarrinho(produtoNovo) {
  setCarrinho((prev) => {
    const existente = prev.find((item) => item._id === produtoNovo._id);
    const estoque = produtoNovo.estoque || produtoNovo.quantidade || 0;
    const novaQuantidade = produtoNovo.quantidade || 1;

    // Se já existe no carrinho
    if (existente) {
      const totalDesejado = existente.quantidade + novaQuantidade;

      if (totalDesejado > estoque) {
        alert(`Estoque insuficiente! Você já adicionou ${existente.quantidade}, e o estoque total é ${estoque}.`);
        return prev;
      }

      return prev.map((item) =>
        item._id === produtoNovo._id
          ? { ...item, quantidade: totalDesejado }
          : item
      );
    }

    // Primeira adição ao carrinho
    if (novaQuantidade > estoque) {
      alert(`Estoque insuficiente! Restam apenas ${estoque} unidades.`);
      return prev;
    }

    return [...prev, { ...produtoNovo, quantidade: novaQuantidade, estoque }];
  });
}


  function removerDoCarrinho(id) {
    setCarrinho((prev) => prev.filter((item) => item._id !== id));
  }

  function limparCarrinho() {
    setCarrinho([]);
  }

  return (
    <CarrinhoContext.Provider
      value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho, limparCarrinho }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  return useContext(CarrinhoContext);
}
