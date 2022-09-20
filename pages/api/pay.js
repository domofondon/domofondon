import { v4 as uuidv4 } from 'uuid';

const COST = +process.env.NEXT_PUBLIC_COST || 40;

export default async (req, res) => {
  try {
    console.log('pay params:', req.body);
    const { data, months, returnURL } = JSON.parse(req.body);
    const { fullName, address, email, phone } = data;

    const body = {
      amount: {
        value: (COST * months).toFixed(2),
        currency: 'RUB'
      },
      description: `Адрес: ${address}; Месяцев: ${months}; ${fullName}; ${email}; ${phone}`,
      confirmation: {
        type: 'redirect',
        return_url: returnURL
      },
      capture: true,
      receipt: {
        customer: {
          email
        },
        items: [
          {
            description: 'Услуга "Умный домофон"',
            quantity: months,
            amount: {
              value: COST.toFixed(2),
              currency: 'RUB'
            },
            vat_code: 1
          }
        ]
      }
    };

    console.log('pay body:', JSON.stringify(body, null, 4));

    // INFO: https://yookassa.ru/developers/api#create_payment
    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Idempotence-Key': uuidv4(),
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_SHOP_ID}:${process.env.NEXT_PUBLIC_SECRET_KEY}`
        ).toString('base64')}`
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    console.log('pay result:', result);

    res.status(200).send(result);
  } catch (err) {
    console.log('pay error:', err);
    res.status(err.responseCode || 500).send(err);
  }
};
