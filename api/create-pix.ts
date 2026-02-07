
// Handler para criação de pagamento PIX no Mercado Pago
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  // Token de Acesso fornecido pelo usuário
  const accessToken = 'APP_USR-5326774431367267-020617-e374b14b58e3c8e099ca0b14e1eea16e-3187571746';

  try {
    const paymentData = {
      transaction_amount: 1.00,
      // Descrição oficial que aparece no checkout e comprovante
      description: 'LUNA SUTRA VIP - ACESSO VITALÍCIO (CNPJ 64.988.605/0001-15)',
      // Texto que aparece no extrato bancário do cliente (Limitado a 13-15 caracteres)
      statement_descriptor: 'LUNA SUTRA',
      payment_method_id: 'pix',
      notification_url: 'https://lunasutra.vercel.app/api/webhook',
      metadata: {
        brand: 'Luna Sutra',
        tax_id: '64.988.605/0001-15',
        activation_type: 'vitalicio',
        source: 'webapp_premium'
      },
      payer: {
        email: 'contato@lunasutra.com',
        first_name: 'Usuario',
        last_name: 'Luna'
      },
      installments: 1
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `luna-prod-final-${Date.now()}`
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[MP API ERROR]', JSON.stringify(data, null, 2));
      return res.status(response.status).json({ 
        message: 'O Mercado Pago recusou a transação', 
        details: data.message || (data.cause && data.cause[0]?.description) || 'Erro na validação da conta CNPJ.'
      });
    }

    const pixCode = data.point_of_interaction?.transaction_data?.qr_code;
    
    if (!pixCode) {
      throw new Error('Pix code não gerado. Certifique-se de que a chave Pix está configurada corretamente no Mercado Pago.');
    }

    return res.status(200).json({
      payment_id: data.id,
      pix_code: pixCode,
      status: data.status
    });

  } catch (error: any) {
    console.error('[LUNA PIX ERROR]', error);
    return res.status(500).json({ message: 'Erro interno ao processar pagamento Pix', error: error.message });
  }
}
