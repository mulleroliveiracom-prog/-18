
// Handler para verificação manual de status de pagamento no Mercado Pago
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { id } = req.query;
  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!id) {
    return res.status(400).json({ message: 'ID do pagamento é obrigatório.' });
  }

  if (!accessToken) {
    return res.status(500).json({ message: 'Configuração de Token ausente no servidor.' });
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        message: 'Erro ao consultar pagamento', 
        details: data.message 
      });
    }

    // Retorna se o status é approved
    return res.status(200).json({
      status: data.status,
      isApproved: data.status === 'approved'
    });

  } catch (error) {
    console.error('[CHECK API ERROR]', error);
    return res.status(500).json({ message: 'Erro interno ao verificar pagamento' });
  }
}
