
// Handler de Webhook Mercado Pago para Luna Sutra
export default async function handler(req: any, res: any) {
  // O Mercado Pago pode enviar HEAD para validar o endpoint
  if (req.method === 'HEAD') {
    return res.status(200).send('OK');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { data, type, action } = req.body;
    
    // Log para depuração na Vercel
    console.log(`[LUNA WEBHOOK] Recebido: ${type} - ${action} para ID: ${data?.id}`);

    const paymentId = data?.id || req.query.id;

    if ((type === 'payment' || action?.includes('payment')) && paymentId) {
      const accessToken = 'APP_USR-5326774431367267-020617-e374b14b58e3c8e099ca0b14e1eea16e-3187571746';

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

      if (paymentData.status === 'approved') {
        console.log(`[LUNA WEBHOOK] Pagamento ${paymentId} APROVADO.`);
        return res.status(200).json({ status: 'approved' });
      }
    }

    return res.status(200).send('Notificação recebida');
  } catch (error) {
    console.error('[LUNA WEBHOOK ERROR]', error);
    return res.status(200).send('Erro processado'); 
  }
}
