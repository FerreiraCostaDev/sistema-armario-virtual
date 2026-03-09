interface ProvaVirtualParams {
  fotoClienteUrl: string;
  fotoProdutoUrl: string;
}

export const gerarProvaVirtual = async ({
  fotoClienteUrl,
  fotoProdutoUrl,
}: ProvaVirtualParams): Promise<string> => {
  try {
    console.log('🤖 Gerando prova virtual (modo simulado)...');
    console.log('foto cliente:', fotoClienteUrl);
    console.log('foto produto:', fotoProdutoUrl);

    // Simula o tempo de processamento da IA
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Retorna a foto do cliente como resultado simulado
    // Substituir por API real quando tiver créditos
    const imagemSimulada = fotoClienteUrl;

    console.log('✅ Prova virtual gerada (simulada)!');
    return imagemSimulada;
  } catch (error: any) {
    console.error('❌ Erro:', error?.message || error);
    throw new Error('Erro ao gerar prova virtual!');
  }
};