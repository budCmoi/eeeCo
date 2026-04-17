import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { CreateCheckoutSessionDto } from '@/payments/dto/create-checkout-session.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe | null;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('stripe.secretKey');
    this.stripe = secretKey ? new Stripe(secretKey, { apiVersion: '2025-08-27.basil' }) : null;
  }

  async createCheckoutSession(dto: CreateCheckoutSessionDto) {
    const frontendUrl = this.configService.get<string>('frontendUrl') ?? 'http://localhost:3000';

    if (!this.stripe) {
      return {
        mode: 'demo',
        url: `${frontendUrl}/account?payment=demo-success`
      };
    }

    const successUrl = this.configService.get<string>('stripe.successUrl') ?? `${frontendUrl}/account?payment=success`;
    const cancelUrl = this.configService.get<string>('stripe.cancelUrl') ?? `${frontendUrl}/checkout`;

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: dto.address.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'GB', 'FR', 'DE', 'AE']
      },
      line_items: dto.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : undefined,
            metadata: {
              slug: item.slug,
              size: item.size
            }
          }
        }
      })),
      metadata: {
        customerName: `${dto.address.firstName} ${dto.address.lastName}`,
        city: dto.address.city,
        country: dto.address.country
      }
    });

    return {
      sessionId: session.id,
      url: session.url
    };
  }
}