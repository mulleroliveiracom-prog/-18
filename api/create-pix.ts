
// Handler para criação de pagamento PIX no Mercado Pago
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(500).json({ message: 'Configuração de Token ausente no servidor.' });
  }

  try {
    const paymentData = {
      transaction_amount: 0.01,
      description: 'Luna Sutra - Acesso Vitalício VIP',
      payment_method_id: 'pix',
      payer: {
        email: 'contato@lunasutra.com', // Email genérico para o payer
        first_name: 'Cliente',
        last_name: 'Luna'
      },
      installments: 1
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `luna-${Date.now()}`
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[MP ERROR]', data);
      return res.status(response.status).json({ 
        message: 'Erro ao gerar Pix no Mercado Pago', 
        details: data.message 
      });
    }

    // Retorna o código Copia e Cola (qr_code)
    return res.status(200).json({
      payment_id: data.id,
      pix_code: data.point_of_interaction.transaction_data.qr_code,
      status: data.status
    });

  } catch (error) {
    console.error('[PIX API ERROR]', error);
    return res.status(500).json({ message: 'Erro interno ao processar pagamento' });
  }
}
