
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
      transaction_amount: 0.01,
      description: 'Luna Sutra VIP - Teste Final Integração',
      payment_method_id: 'pix',
      // Purpose field as requested to avoid refusal of low value payments
      metadata: {
        purpose: 'wallet_purchase',
        test_mode: 'true'
      },
      payer: {
        email: 'contato@lunasutra.com',
        first_name: 'Cliente',
        last_name: 'Empresa'
      },
      installments: 1
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `luna-test-${Date.now()}`
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[MP API ERROR RESPONSE]', JSON.stringify(data, null, 2));
      return res.status(response.status).json({ 
        message: 'Mercado Pago recusou a transação', 
        details: data.message || 'Erro desconhecido'
      });
    }

    // A estrutura do QR Code no Mercado Pago é aninhada em point_of_interaction
    const pixCode = data.point_of_interaction?.transaction_data?.qr_code;
    
    if (!pixCode) {
      throw new Error('Pix code não gerado pelo Mercado Pago');
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
