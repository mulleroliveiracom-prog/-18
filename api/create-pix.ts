
// Handler para criação de pagamento PIX no Mercado Pago
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(500).json({ message: 'Configuração de Token (MP_ACCESS_TOKEN) ausente no servidor.' });
  }

  try {
    const paymentData = {
      transaction_amount: 1.00, // Alterado de 0.01 para 1.00 conforme solicitado
      description: 'Luna Sutra VIP - Ativação Vitalícia',
      payment_method_id: 'pix',
      metadata: {
        purpose: 'wallet_purchase',
        test_mode: 'false'
      },
      payer: {
        email: 'contato@lunasutra.com',
        first_name: 'Cliente',
        last_name: 'LunaSutra'
      },
      installments: 1
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `luna-prod-${Date.now()}`
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[MP API ERROR FULL RESPONSE]', JSON.stringify(data, null, 2));
      // Retorna o motivo real da falha da API
      return res.status(response.status).json({ 
        message: 'O Mercado Pago recusou a transação', 
        details: data.message || data.cause?.[0]?.description || 'Erro desconhecido na API do Mercado Pago'
      });
    }

    const pixCode = data.point_of_interaction?.transaction_data?.qr_code;
    
    if (!pixCode) {
      throw new Error('Pix code não gerado pelo Mercado Pago. Verifique as configurações da conta.');
    }

    return res.status(200).json({
      payment_id: data.id,
      pix_code: pixCode,
      status: data.status
    });

  } catch (error: any) {
    console.error('[LUNA PIX ERROR]', error);
    return res.status(500).json({ message: 'Erro interno ao processar pagamento', error: error.message });
  }
}
