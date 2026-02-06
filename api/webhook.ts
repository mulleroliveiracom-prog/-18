
// Handler de Webhook Mercado Pago para Luna Sutra
// Este arquivo deve ser implantado em um ambiente Node.js (Vercel Functions, etc.)

export default async function handler(req: any, res: any) {
  // Apenas aceita requisições POST do Mercado Pago
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { data, type, action } = req.body;

    // O Mercado Pago envia notificações de diferentes tipos. Focamos em 'payment'.
    // O ID do pagamento pode vir em diferentes campos dependendo da versão da API.
    const paymentId = data?.id || req.query.id || (req.body.resource && req.body.resource.split('/').pop());

    if ((type === 'payment' || action?.includes('payment')) && paymentId) {
      const accessToken = 'APP_USR-1622910227733544-020517-deca650e82e776510ab72e26816eeedc-1165314166';

      // Consulta os detalhes do pagamento na API oficial do Mercado Pago para segurança
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na API do Mercado Pago: ${response.statusText}`);
      }

      const paymentData = await response.json();

      // Verifica se o pagamento foi aprovado
      if (paymentData.status === 'approved') {
        console.log(`[LUNA WEBHOOK] Pagamento ${paymentId} APROVADO com sucesso.`);
        
        /**
         * LÓGICA DE LIBERAÇÃO AUTOMÁTICA:
         * Aqui você deve integrar com seu banco de dados. Exemplo:
         * const userEmail = paymentData.external_reference;
         * await db.users.update({ where: { email: userEmail }, data: { isVip: true } });
         */
        
        return res.status(200).json({ 
          status: 'success', 
          message: 'Pagamento aprovado e app liberado.',
          payment_id: paymentId 
        });
      } else {
        console.log(`[LUNA WEBHOOK] Pagamento ${paymentId} status: ${paymentData.status}`);
      }
    }

    // Retorna 200 para o Mercado Pago não tentar reenviar a mesma notificação
    return res.status(200).send('Notificação recebida');

  } catch (error) {
    console.error('[LUNA WEBHOOK ERROR]', error);
    // Mesmo em erro, retornamos 200 ou 4xx controlado para não travar a fila do MP
    return res.status(500).json({ message: 'Erro interno no processamento do webhook' });
  }
}
